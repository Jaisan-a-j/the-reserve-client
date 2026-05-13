import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import type { FormInputProps } from "../../types";

const PasswordField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
}: Omit<FormInputProps, "icon" | "type">) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <a
          href="#"
          className="text-sm font-semibold text-[#7c5dfa] hover:underline"
        >
          Forgot Password?
        </a>
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7c5dfa] focus:bg-white outline-none transition-all"
        />
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </>
  );
};

export default PasswordField;
