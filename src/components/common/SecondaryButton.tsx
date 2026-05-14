import type { ButtonTypes } from "../../types";
const SecondaryButton = ({
  path,
  content,
  className,
  onClick,
}: ButtonTypes) => {
  return (
    <a
      href={path}
      onClick={onClick}
      className={`bg-[#7c5dfa] text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-[#6a4ee0] transition-colors shadow-md ${className}`}
    >
      {content}
    </a>
  );
};

export default SecondaryButton;
