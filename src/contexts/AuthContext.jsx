import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  const [token, setToken] = useState(getToken());

  const login = (userToken) => {
    if (!userToken) return;
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.setItem("token", "");
    setToken("");
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
