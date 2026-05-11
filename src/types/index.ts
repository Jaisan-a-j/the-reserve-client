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
}
