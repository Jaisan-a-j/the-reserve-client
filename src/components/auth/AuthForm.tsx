import Button from "../common/Button";
import FormInput from "../reservation/FormInput";
import { Mail, PersonStandingIcon } from "lucide-react";
import PasswordField from "./PasswordField";
const AuthForm = ({ type = "login" }) => {
  const isLogin = type === "login";

  return (
    <form className="space-y-5">
      {!isLogin && (
        <FormInput
          label="Full Name"
          type="text"
          icon={PersonStandingIcon}
          placeholder="Enter your full name"
        />
      )}

      <FormInput
        label="Email"
        type="email"
        icon={Mail}
        placeholder="Enter your email"
      />

      <PasswordField />

      <div className="grid">
        <Button content={isLogin ? "Login" : "Register"} />
      </div>
    </form>
  );
};

export default AuthForm;
