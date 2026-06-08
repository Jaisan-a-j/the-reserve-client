import Button from "../common/Button";
import FormInput from "../reservation/FormInput";
import PasswordField from "./PasswordField";
import { Mail, PersonStandingIcon } from "lucide-react";
import OtpVerification from "./OtpVerification";
import { useAuthForm } from "../../hooks/useAuthForm";

const AuthForm = () => {
  const {
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
  } = useAuthForm();

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
          <OtpVerification
            verificationMessage={verificationMessage}
            onChange={handleVerificationChange}
            verificationCode={verificationCode}
            error={fieldErrors.otp}
          />
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
