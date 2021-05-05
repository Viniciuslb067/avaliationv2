import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import Router from "next/router";

import { toast } from "react-toastify";
import { api } from "../services/api";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface User {
  email: string;
  name: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

interface AuthProvidorProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "evaluator.token");
  Router.push("/");
}

export function AuthProvider({ children }: AuthProvidorProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/auth/authenticate", {
        email,
        password,
      });

      if (response.data.status === 1) {
        const { token, name } = response.data;

        setCookie(undefined, "evaluator.token", token, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });

        setUser({
          email,
          name,
        });

        api.defaults.headers["Authorization"] = `Bearer ${token}`;

        Router.push("/dashboard");
      } else {
        const notify = () => toast.warning(response.data.error);
        notify();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
