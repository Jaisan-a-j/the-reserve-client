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
  verifyOtpThunk,
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
    otp?: string;
  }>({});
  const [otpStage, setOtpStage] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setErrorMessage("");
    setVerificationMessage("");
  };

  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setFieldErrors((prev) => ({ ...prev, otp: undefined }));
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
    setVerificationMessage("");

    if (userExist) {
      const errors: {
        email?: string;
        password?: string;
      } = {};

      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        errors.email =
          "Enter a valid email address with @ and a proper domain like .com or .org";
      }

      if (!formData.password.trim()) {
        errors.password = "Password is required";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        await dispatch(
          loginUserThunk({
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();

        navigate("/");
      } catch (error) {
        const message =
          typeof error === "string"
            ? error
            : axios.isAxiosError(error)
              ? error.response?.data?.message
              : "Something went wrong";

        setErrorMessage(message || "Something went wrong");
      }

      return;
    }

    if (!otpStage) {
      const errors: {
        fullName?: string;
        email?: string;
        password?: string;
      } = {};

      if (!formData.fullName.trim()) {
        errors.fullName = "Full name is required";
      }

      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        errors.email =
          "Enter a valid email address with @ and a proper domain like .com or .org";
      }

      if (!formData.password.trim()) {
        errors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        errors.password =
          "Password must be at least 8 characters, include uppercase, lowercase, number, special character, and contain no spaces.";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        const response = await dispatch(
          registerUserThunk({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();

        setOtpStage(true);
        setPendingEmail(response.email || formData.email.trim().toLowerCase());
        setVerificationMessage(
          response.message ||
            "A verification code has been sent to your email. Enter it below.",
        );
        setFormData((current) => ({
          ...current,
          email: response.email || current.email.trim().toLowerCase(),
        }));
      } catch (error) {
        const message =
          typeof error === "string"
            ? error
            : axios.isAxiosError(error)
              ? error.response?.data?.message
              : "Something went wrong";

        if (message === "User already exists") {
          setFieldErrors({ email: message });
        } else {
          setErrorMessage(message || "Something went wrong");
        }
      }

      return;
    }

    const errors: { otp?: string } = {};
    if (!verificationCode.trim()) {
      errors.otp = "Verification code is required";
      setFieldErrors(errors);
      return;
    }

    try {
      await dispatch(
        verifyOtpThunk({
          email: pendingEmail || formData.email,
          otp: verificationCode.trim(),
        }),
      ).unwrap();

      navigate("/");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Something went wrong";

      setFieldErrors({ otp: message || "Something went wrong" });
    }
  };

  const changeForm = () => {
    setErrorMessage("");
    setFormData({
      fullName: "",
      email: "",
      password: "",
    });
    setFieldErrors({
      fullName: "",
      email: "",
      password: "",
      otp: "",
    });
    setOtpStage(false);
    setVerificationCode("");
    setPendingEmail("");
    setVerificationMessage("");
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
            disabled={otpStage}
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
          disabled={otpStage}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          error={fieldErrors.password}
          disabled={otpStage}
        />

        {!userExist && otpStage && (
          <>
            <p className="text-sm text-gray-600">
              {verificationMessage ||
                "A verification code has been sent to your email. Enter it below."}
            </p>
            <FormInput
              label="Verification Code"
              type="text"
              name="otp"
              value={verificationCode}
              onChange={handleVerificationChange}
              icon={Mail}
              placeholder="Enter the 6-digit code"
              error={fieldErrors.otp}
            />
          </>
        )}

        {errorMessage && (
          <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
        )}

        <div className="grid">
          <Button
            content={
              userExist ? "Login" : otpStage ? "Verify Code" : "Register"
            }
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
