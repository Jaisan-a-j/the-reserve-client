import type { FormInputProps } from "../../types";

const FormInput = ({
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  name,
  error,
}: FormInputProps) => {
  return (
    <div>
      <label className="block text-sm text-[#2b2d42] mb-2">{label}</label>

      <div
        className={`flex items-center border rounded-xl px-4 h-13 transition-colors ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      >
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
        />

        <Icon className={error ? "text-red-500" : "text-gray-500"} size={18} />
      </div>

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
