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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Email and password are required");
      return;
    }

    if (!userExist && !formData.fullName) {
      setErrorMessage("Full name is required");
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
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Something went wrong",
        );
      } else {
        setErrorMessage("Something went wrong");
      }
    }
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
        {errorMessage && (
          <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
        )}

        <div className="grid">
          <Button content={userExist ? "Login" : "Register"} />
        </div>
      </form>

      <p className="text-center mt-8 text-gray-600">
        {!userExist ? "Already have an account?" : "Don't have an account?"}{" "}
        <a
          className="text-[#7c5dfa] font-bold hover:underline cursor-pointer"
          onClick={() => setUserExist(!userExist)}
        >
          {!userExist ? "Login" : " Register"}
        </a>
      </p>
    </>
  );
};

export default AuthForm;
