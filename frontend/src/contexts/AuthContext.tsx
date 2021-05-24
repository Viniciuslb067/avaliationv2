import Router from "next/router";
import { useRouter } from "next/router";
import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";

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

export function verifyToken() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();
  const { "evaluator.token": token } = parseCookies();

  useEffect(() => {
    async function verify() {
      const response = await api.get("/auth/check", {
        params: { token: `Bearer ${token}` },
      });

      if (response.data.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      if (!isAuthenticated) {
        await Router.push("/");
        const notify = () => toast.warning("Faça login primeiro");
        notify();
      } else if(isAuthenticated){
        if(router.pathname === "/" || router.pathname === "/register")
          await Router.push("/dashboard");
      } 
    }

    verify();
  }, [isAuthenticated]);
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
        const { token, name } = response.data;

        setCookie(undefined, "evaluator.token", token, {
          maxAge: 60 * 60 * 24 * 7,
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
