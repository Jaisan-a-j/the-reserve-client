import type { LucideIcon } from "lucide-react";

export interface LinkTypes {
  name: string;
  active: boolean;
}

export interface CategoryTypes {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface FormInputProps {
  label: string;
  type: string;
  placeholder?: string;
  icon: LucideIcon;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface ButtonTypes {
  path?: string;
  content: string;
  className?: string;
  onClick?: () => void;
}

export interface UserType {
  _id: string;
  fullName: string;
  email: string;
}

export interface AuthState {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export type ChefType = {
  id: number;
  image: string;
  name: string;
  role: string;
  description: string;
};
