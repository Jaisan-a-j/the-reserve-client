import { useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/icon.jpeg";
import { navLinks } from "../../constants/menus";
import type { LinkTypes } from "../../types";
import SecondaryButton from "./SecondaryButton";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logoutThunk } from "../../features/auth/authThunk";
import Modal from "./Modal";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const authAction = () => {
    if (user) {
      setIsConfirmOpen(true);
    } else {
      navigate("/auth");
    }
  };

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, path?: string) => {
    e.preventDefault();

    if (path?.startsWith("/")) {
      navigate(path);
      setIsOpen(false);
    } else {
      if (path) {
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
      }
    }
  };

  const isActiveLink = (path?: string) => {
    if (path?.startsWith("/")) {
      return location.pathname === path;
    }
    return location.pathname === "/" && activeSection === path;
  };

  const confirmLogout = async () => {
    navigate("/");
    await dispatch(logoutThunk());
    setIsConfirmOpen(false);
  };

  const cancelLogout = () => {
    setIsConfirmOpen(false);
  };

  return (
    <nav className="relative">
      <header className="fixed top-0 left-0 w-full h-16 z-70 flex items-center justify-between px-2 sm:px-4 md:px-8 lg:px-12 bg-white border-b border-gray-100 shadow-sm">
        <a
          href="/#home"
          onClick={(e) => handleLinkClick(e, "home")}
          className="flex items-center"
          aria-label="Go to home"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-xl font-bold text-[#1e293b] tracking-tight">
            The Reserve
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link: LinkTypes) => (
            <a
              key={link.name}
              onClick={(e) => handleLinkClick(e, link.path)}
              className={`font-medium transition-colors hover:text-[#7c5dfa] cursor-pointer ${
                isActiveLink(link.path) ? "text-[#7c5dfa]" : "text-gray-700"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <SecondaryButton
            path="/#reservation"
            content="Book A Table"
            onClick={(e) => handleLinkClick(e, "reservation")}
          />
          <SecondaryButton
            onClick={authAction}
            content={user ? "Logout" : "Login"}
            className="hidden lg:block cursor-pointer"
          />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      <div
        className={`lg:hidden fixed left-0 w-full bg-white z-60 border-b border-gray-100 transition-all duration-300 ease-in-out shadow-xl overflow-hidden ${
          isOpen ? "top-16 opacity-100 py-8" : "-top-full opacity-0 py-0"
        }`}
      >
        <nav className="flex flex-col px-6 gap-6">
          {navLinks.map((link: LinkTypes) => (
            <a
              key={link.name}
              onClick={(e) => {
                handleLinkClick(e, link.path);
                setIsOpen(false);
              }}
              className={`text-lg font-medium transition-colors cursor-pointer ${
                isActiveLink(link.path) ? "text-[#7c5dfa]" : "text-gray-700"
              }`}
            >
              {link.name}
            </a>
          ))}

          <SecondaryButton
            onClick={authAction}
            content={user ? "Logout" : "Login"}
            className="lg:hidden self-start"
          />
        </nav>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Modal
        isOpen={isConfirmOpen}
        title="Confirm Logout"
        message="Are you sure you want to Logout?"
        confirmLabel="Yes, Logout"
        cancelLabel="Cancel"
        onConfirm={confirmLogout}
        onClose={cancelLogout}
      />
    </nav>
  );
};

export default Header;
