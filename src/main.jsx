import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Todo from "./pages/Todo";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectRoute from "./components/ProtectedRoute";
import AuthForm from "./pages/AuthForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectRoute>
        <Todo />
      </ProtectRoute>
    ),
  },
  {
    path: "/signup",
    element: <AuthForm type="signup" />,
  },
  {
    path: "/login",
    element: <AuthForm type="login" />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <Toaster />
  </StrictMode>
);
