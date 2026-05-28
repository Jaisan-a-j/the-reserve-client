import type { LucideIcon } from "lucide-react";
import type { ChangeEvent, InputHTMLAttributes } from "react";

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

export interface FormFieldMeta {
  label: string;
  type: string;
  placeholder?: string;
  icon: LucideIcon;
  name: string;
  min?: string;
  maxLength?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

export interface FormInputProps extends FormFieldMeta {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export interface BookingInput {
  phone: string;
  date: string;
  time: string;
  message?: string;
}

export interface UserBooking {
  _id: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  status: string;
}

export interface ButtonTypes {
  path?: string;
  content: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
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
  minLoaderDuration?: number;
}

export type ChefType = {
  id: number;
  image: string;
  name: string;
  role: string;
  description: string;
};
