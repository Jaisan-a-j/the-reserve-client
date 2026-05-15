import type { CredentialResponse } from "@react-oauth/google";
import { createContext } from "react";

export interface UserType {
  id: string;
  fullName: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;

  loginGoogle: (credentialResponse: CredentialResponse) => Promise<void>;

  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
