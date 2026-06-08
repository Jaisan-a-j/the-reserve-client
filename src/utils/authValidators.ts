import { validateEmail, validatePassword } from "./authValidation";

export const validateLogin = (email: string, password: string) => {
  const errors: {
    email?: string;
    password?: string;
  } = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email =
      "Enter a valid email address with @ and a proper domain like .com or .org";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateRegister = (
  fullName: string,
  email: string,
  password: string,
) => {
  const errors: {
    fullName?: string;
    email?: string;
    password?: string;
  } = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email =
      "Enter a valid email address with @ and a proper domain like .com or .org";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (!validatePassword(password)) {
    errors.password =
      "Password must be at least 8 characters, include uppercase, lowercase, number, special character, and contain no spaces.";
  }

  return errors;
};
