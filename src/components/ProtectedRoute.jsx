import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function ProtectRoute({ children }) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <nav className="flex justify-center items-center py-2 ">
        <Card className="w-[1080px] bg-secondary  flex flex-row justify-between py-3 px-5">
          <span className="text-2xl font-medium">Todo Application</span>
          <Button className="cursor-pointer " onClick={logout}>
            Logout
          </Button>
        </Card>
      </nav>
      {children}
    </main>
  );
}
