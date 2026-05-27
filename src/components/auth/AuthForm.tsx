import { useState } from "react";
import Button from "../common/Button";
import FormInput from "../reservation/FormInput";
import PasswordField from "./PasswordField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, PersonStandingIcon } from "lucide-react";
import { useAppDispatch } from "../../hooks/reduxHooks";

import {
  loginUserThunk,
  registerUserThunk,
} from "../../features/auth/authThunk";

const AuthForm = () => {
  const [userExist, setUserExist] = useState(true);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setErrorMessage("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])(?!.*\s).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const errors: {
      fullName?: string;
      email?: string;
      password?: string;
    } = {};

    if (!userExist && !formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!userExist && !validateEmail(formData.email)) {
      errors.email =
        "Enter a valid email address with @ and a proper domain like .com or .org";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!userExist && !validatePassword(formData.password)) {
      errors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, special character, and contain no spaces.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      if (userExist) {
        await dispatch(
          loginUserThunk({
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();

        navigate("/");
      } else {
        await dispatch(
          registerUserThunk({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();

        navigate("/");
      }
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Something went wrong";

      if (!userExist && message === "User already exists") {
        setFieldErrors({ email: message });
      } else {
        setErrorMessage(message || "Something went wrong");
      }
    }
  };

  const changeForm = () => {
    setErrorMessage("");
    setFormData({
      fullName: "",
      email: "",
      password: "",
    });
    setUserExist(!userExist);
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {!userExist && (
          <FormInput
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            icon={PersonStandingIcon}
            placeholder="Enter your full name"
            error={fieldErrors.fullName}
          />
        )}

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          placeholder="Enter your email"
          error={fieldErrors.email}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          error={fieldErrors.password}
        />

        {userExist && (
          <a
            href="#"
            className="text-sm font-semibold text-[#7c5dfa] hover:underline flex justify-end"
          >
            Forgot Password?
          </a>
        )}

        {errorMessage && (
          <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
        )}

        <div className="grid">
          <Button
            content={userExist ? "Login" : "Register"}
            onClick={() => handleSubmit()}
          />
        </div>
      </form>

      <p className="text-center mt-8 text-gray-600">
        {!userExist ? "Already have an account?" : "Don't have an account?"}{" "}
        <a
          className="text-[#7c5dfa] font-bold hover:underline cursor-pointer"
          onClick={changeForm}
        >
          {!userExist ? "Login" : " Register"}
        </a>
      </p>
    </>
  );
};

export default AuthForm;
