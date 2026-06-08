import { type MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../providers/NavigationProvider";

export const useNavigation = () => {
  const navigate = useNavigate();
  const { setActiveSection } = useNavigationContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, path?: string) => {
    e.preventDefault();

    if (path?.startsWith("/")) {
      navigate(path);
      setIsOpen(false);
      return;
    }

    if (!path) return;

    const targetElement = document.getElementById(path);

    navigate(`/#${path}`);
    setActiveSection(path);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.pushState(null, "", `#${path}`);

      setIsOpen(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleLinkClick,
  };
};
