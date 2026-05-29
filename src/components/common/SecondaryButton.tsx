import type { MouseEventHandler } from "react";
import type { ButtonTypes } from "../../types";

type SecondaryButtonProps = Omit<ButtonTypes, "onClick"> & {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const SecondaryButton = ({
  path,
  content,
  className,
  onClick,
}: SecondaryButtonProps) => {
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
