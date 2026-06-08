import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAppDispatch } from "./reduxHooks";

import {
  loginUserThunk,
  registerUserThunk,
  verifyOtpThunk,
} from "../features/auth/authThunk";

import type { FieldErrors, AuthFormData } from "../types/auth";

import { validateLogin, validateRegister } from "../utils/authValidators";

export const useAuthForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userExist, setUserExist] = useState(true);

  const [formData, setFormData] = useState<AuthFormData>({
    fullName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [otpStage, setOtpStage] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");

  const [pendingEmail, setPendingEmail] = useState("");

  const [verificationMessage, setVerificationMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
    }));

    setErrorMessage("");
    setVerificationMessage("");
  };

  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);

    setFieldErrors((prev) => ({
      ...prev,
      otp: undefined,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setErrorMessage("");
    setFieldErrors({});
    setVerificationMessage("");

    // LOGIN
    if (userExist) {
      const errors = validateLogin(formData.email, formData.password);

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

    // REGISTER
    if (!otpStage) {
      const errors = validateRegister(
        formData.fullName,
        formData.email,
        formData.password,
      );

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
          setFieldErrors({
            email: message,
          });
        } else {
          setErrorMessage(message || "Something went wrong");
        }
      }

      return;
    }

    // VERIFY OTP
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

      setFieldErrors({
        otp: message || "Something went wrong",
      });
    }
  };

  const changeForm = () => {
    setErrorMessage("");

    setFormData({
      fullName: "",
      email: "",
      password: "",
    });

    setFieldErrors({});

    setOtpStage(false);
    setVerificationCode("");
    setPendingEmail("");
    setVerificationMessage("");

    setUserExist((prev) => !prev);
  };

  return {
    userExist,
    formData,
    fieldErrors,
    errorMessage,
    otpStage,
    verificationCode,
    verificationMessage,

    handleChange,
    handleVerificationChange,
    handleSubmit,
    changeForm,
    setUserExist,
  };
};
