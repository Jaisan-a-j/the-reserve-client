export interface AuthFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  otp?: string;
}
