import type { LucideIcon } from "lucide-react";
import type { ChangeEvent, InputHTMLAttributes } from "react";

export interface LinkTypes {
  name: string;
  active: boolean;
  path?: string;
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

export interface FoodItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  dietary: string[];
  spice: string;
  image: string;
  chefSpecial?: boolean;
}

export interface CartItem {
  _id: string;
  food: FoodItem;
  quantity: number;
}

export interface OrderInput {
  contact: {
    fullName: string;
    email: string;
    phone: string;
  };
  fulfillment: "delivery" | "pickup";
  deliveryAddress?: {
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: "card" | "counter";
}

export interface UserOrderItem {
  food: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface UserOrder {
  _id: string;
  items: UserOrderItem[];
  contact: {
    fullName: string;
    email: string;
    phone: string;
  };
  fulfillment: "delivery" | "pickup";
  deliveryAddress?: {
    address?: string;
    city?: string;
    zipCode?: string;
  };
  paymentMethod: "card" | "counter";
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface ButtonTypes {
  path?: string;
  content: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface UserProfile {
  address: string;
  city: string;
  pinCode: string;
}

export interface UserType {
  _id: string;
  fullName: string;
  email: string;
  profile?: UserProfile;
}

export interface UpdateUserProfileInput {
  address: string;
  city: string;
  pinCode: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}

export interface ReviewType {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
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
