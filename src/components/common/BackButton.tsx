import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type BackButtonProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

const BackButton = ({ to, children, className = "" }: BackButtonProps) => (
  <Link
    to={to}
    className={`inline-flex h-11 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111111] shadow-sm transition-colors hover:border-[#825cff] ${className}`}
  >
    {children}
  </Link>
);

export default BackButton;
