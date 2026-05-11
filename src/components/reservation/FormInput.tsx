import type { FormInputProps } from "../../types";
const FormInput = ({
  label,
  type,
  placeholder,
  icon: Icon,
}: FormInputProps) => {
  return (
    <div>
      <label className="block text-sm text-[#2b2d42] mb-2">{label}</label>

      <div className="flex items-center border border-gray-300 rounded-xl px-4 h-[52px]">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />

        <Icon className="text-gray-500" size={18} />
      </div>
    </div>
  );
};

export default FormInput;
