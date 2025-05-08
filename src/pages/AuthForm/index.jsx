import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LabelInput from "@/components/ui/label-input";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthForm({ type = "signup", className, ...props }) {
  const isSignupPage = type === "signup";
  const header = isSignupPage ? "Create new account" : "Login to your account";
  const description = isSignupPage
    ? "Enter your email below to create your account"
    : "Enter your email below to login to your account";
  const buttonText = isSignupPage ? "Sign up" : "Login";
  const authPrompt = isSignupPage ? "Do you have account?" : "Don't have an account?";
  const authLinkText = isSignupPage ? "Login" : "Sign up";
  const authLink = isSignupPage ? "login" : "signup";

  const navigate = useNavigate();
  const { login, token } = useAuth();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {};

    // Validation Check
    if (type === "signup") {
      // Required Validation
      const requiredError = ["name", "email", "password", "confirmPassword"].reduce(
        (acc, key) => (form[key] ? acc : { ...acc, [key]: "Required" }),
        {}
      );

      if (Object.keys(requiredError).length > 0) return setErrors(requiredError);

      // Passwords match
      if (form.confirmPassword !== form.password)
        return setErrors((prev) => ({ ...prev, confirmPassword: "Password doesn't match!" }));

      payload = form;
    } else if (type === "login") {
      // Required Validation
      const requiredError = ["email", "password"].reduce(
        (acc, key) => (form[key] ? acc : { ...acc, [key]: "Required" }),
        {}
      );

      if (Object.keys(requiredError).length > 0) return setErrors(requiredError);

      payload = { email: form.email, password: form.password };
    }

    try {
      setIsLoading(true);
      const response = await api.post(type === "signup" ? "/register" : "/login", payload);
      const { status, message, data = {} } = response?.data || {};

      if (status === "success") {
        toast.success(message);
        if (type === "signup") {
          navigate("/login");
        } else if (type === "login") {
          login(data.token);
        }
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  useEffect(() => {
    setForm(initialState);
    setErrors(initialState);
  }, [type]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>{header}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form noValidate onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {isSignupPage && (
                    <LabelInput
                      label="Name"
                      id="username"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      error={errors.name}
                      disabled={isLoading}
                      required
                    />
                  )}
                  <LabelInput
                    label="Email"
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={isLoading}
                    required
                  />
                  <LabelInput
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    disabled={isLoading}
                    required
                  />
                  {isSignupPage && (
                    <LabelInput
                      label="Confirm Password"
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      disabled={isLoading}
                      required
                    />
                  )}
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      {buttonText}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  {authPrompt}{" "}
                  <Link to={`/${authLink}`} className="underline underline-offset-4">
                    {authLinkText}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
