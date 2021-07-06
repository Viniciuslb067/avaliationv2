import Router from "next/router";
import { useRouter } from "next/router";
import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import { toast } from "react-toastify";
import { api } from "../services/api";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface User {
  name: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
}

interface AuthProvidorProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "feedback.token");
  Router.push("/");
}

export function verifyToken() {
  const { "feedback.token": token } = parseCookies();

  useEffect(() => {
    async function verify() {
      const response = await api.get("/auth/check", {
        params: { token: `Bearer ${token}` },
      });

      if (!token) {
        Router.push("/");
        const notify = () => toast.warning("Faça login primeiro");
        notify();
      }
    }

    verify();
  }, [token]);
}

export function AuthProvider({ children }: AuthProvidorProps) {
  const [user, setUser] = useState<User>();

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/auth/authenticate", {
        email,
        password,
      });

      if (response.data.status === 1) {
        const { token, email } = response.data;

        setCookie(undefined, "feedback.token", token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setUser({ name: email });

        api.defaults.headers["Authorization"] = `Bearer ${token}`;

        Router.push("/dashboard");
      } else {
        const notify = () => toast.error(response.data.error);
        notify();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}
