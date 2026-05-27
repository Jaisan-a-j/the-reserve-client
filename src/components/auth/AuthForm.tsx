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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    const errors = [];

    if (!userExist && !formData.fullName.trim()) {
      errors.push("Full name");
    }

    if (!formData.email.trim()) {
      errors.push("Email");
    }

    if (!formData.password.trim()) {
      errors.push("Password");
    }

    if (errors.length > 0) {
      setErrorMessage(`${errors.join(", ")} is required`);
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
      if (typeof error === "string") {
        setErrorMessage(error);
      } else if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Something went wrong",
        );
      } else {
        setErrorMessage("Something went wrong");
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
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          name="password"
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
