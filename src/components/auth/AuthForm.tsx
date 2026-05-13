import { useState } from "react";
import Button from "../common/Button";
import FormInput from "../reservation/FormInput";
import { Mail, PersonStandingIcon } from "lucide-react";
import PasswordField from "./PasswordField";
const AuthForm = () => {
  const [userExist, setUserExist] = useState(true);

  return (
    <>
      <form className="space-y-5">
        {!userExist && (
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
          <Button content={userExist ? "Login" : "Register"} />
        </div>
      </form>
      <p className="text-center mt-8 text-gray-600">
        {!userExist ? "Already have an account?" : "Don't have an account?"}{" "}
        <a
          onClick={() => setUserExist(!userExist)}
          className="text-[#7c5dfa] font-bold hover:underline cursor-pointer"
        >
          {!userExist ? "Login" : " Register"}
        </a>
      </p>
    </>
  );
};

export default AuthForm;
