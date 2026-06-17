import { useEffect, type RefObject } from "react";

interface UseClickOutsideProps {
  ref: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

export function useClickOutside({ ref, isOpen, onClose }: UseClickOutsideProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose(); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, ref, onClose]);
}