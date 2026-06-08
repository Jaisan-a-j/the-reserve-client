import FormInput from "../reservation/FormInput";
import { Mail } from "lucide-react";
interface OtpVerificationProps {
  verificationCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  verificationMessage: string;
}

const OtpVerification = ({
  verificationCode,
  onChange,
  error,
  verificationMessage,
}: OtpVerificationProps) => {
  return (
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
        onChange={onChange}
        icon={Mail}
        placeholder="Enter the 6-digit code"
        error={error}
      />
    </>
  );
};

export default OtpVerification;
