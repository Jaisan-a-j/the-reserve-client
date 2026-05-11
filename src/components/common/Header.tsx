import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/icon.jpeg";
import { navLinks } from "../../constants/menus";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      <header className="fixed top-0 left-0 w-full h-[64px] z-[70] flex items-center justify-between px-2 py-3 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-xl font-bold text-[#1e293b] tracking-tight">
            The Reserve
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-[#7c5dfa] text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-[#6a4ee0] transition-colors shadow-md">
            Book A Table
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
        className={`fixed left-0 w-full bg-white z-[60] border-b border-gray-100 transition-all ease-in-out shadow-xl overflow-hidden ${
          isOpen
            ? "top-[64px] opacity-100 h-auto py-8"
            : "top-[-100%] opacity-0 h-0"
        }`}
      >
        <nav className="flex flex-col px-6 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.name.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium transition-colors ${
                link.active ? "text-[#7c5dfa]" : "text-gray-700"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[50]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Header;
