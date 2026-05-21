import type { ButtonTypes } from "../../types";
const Button = ({
  content,
  className,
  onClick,
  disabled,
  type = "button",
}: ButtonTypes) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-linear-to-r from-purple-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
      } ${className ?? ""}`}
    >
      {content}
    </button>
  );
};

export default Button;
