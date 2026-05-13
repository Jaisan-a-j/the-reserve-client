import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/icon.jpeg";
import { navLinks } from "../../constants/menus";
import type { LinkTypes } from "../../types";
import SecondaryButton from "./SecondaryButton";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      <header className="fixed top-0 left-0 w-full h-16 z-[70] flex items-center justify-between px-2 sm:px-4 md:px-8 lg:px-12 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-xl font-bold text-[#1e293b] tracking-tight">
            The Reserve
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link: LinkTypes) => (
            <a
              key={link.name}
              href={`#${link.name.replace(/\s+/g, "").toLowerCase()}`}
              className={`font-medium transition-colors hover:text-[#7c5dfa] ${
                link.active ? "text-[#7c5dfa]" : "text-gray-700"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <SecondaryButton path="#reservation" content="Book A Table" />
          <SecondaryButton
            path="login"
            content="Login"
            className="hidden lg:block"
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
        className={`lg:hidden fixed left-0 w-full bg-white z-[60] border-b border-gray-100 transition-all duration-300 ease-in-out shadow-xl overflow-hidden ${
          isOpen ? "top-16 opacity-100 py-8" : "top-[-100%] opacity-0 py-0"
        }`}
      >
        <nav className="flex flex-col px-6 gap-6">
          {navLinks.map((link: LinkTypes) => (
            <a
              key={link.name}
              href={`#${link.name.replace(/\s+/g, "").toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium transition-colors ${
                link.active ? "text-[#7c5dfa]" : "text-gray-700"
              }`}
            >
              {link.name}
            </a>
          ))}

          <SecondaryButton
            path="login"
            content="Login"
            className="lg:hidden self-start"
          />
        </nav>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-[50]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Header;
