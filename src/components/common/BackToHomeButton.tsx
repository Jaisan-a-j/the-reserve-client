import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ButtonTypes } from "../../types";

const BackToHomeButton = ({ className }: Pick<ButtonTypes, "className">) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className={`absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#7c5dfa] transition-colors font-medium text-sm group ${className}`}
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Back
    </button>
  );
};

export default BackToHomeButton;
