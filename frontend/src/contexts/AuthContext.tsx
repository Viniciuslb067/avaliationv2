import Router from "next/router";
import { createContext, ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { login, getToken } from "../services/auth";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProvidorProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProvidorProps) {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      await api.post("/auth/authenticate", { email, password }).then((res) => {
        if (res.data.status === 1) {
          login(res.data.token);
          setIsAuthenticated(true);
          Router.push("/dashboard");
        } else {
          const notify = () => toast.warning(res.data.error);
          notify();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function verify() {
    var res = await api.get("/auth/check", { params: { token: getToken() } });
    if (res.data.status === 200) {
      setLoading(false);
      setRedirect(false);
    } else {
      setLoading(false);
      setRedirect(true);
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
