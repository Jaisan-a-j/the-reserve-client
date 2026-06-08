import logo from "../../assets/icon.jpeg";
import { Gamepad2, GitMerge, X } from "lucide-react";
import { navLinks } from "../../constants/menus";
import type { LinkTypes } from "../../types";
import { useNavigation } from "../../hooks/useNavigation";

const Footer = () => {
  const { handleLinkClick } = useNavigation();

  return (
    <footer className="w-full bg-[#f5f5f5] py-6 px-4 flex flex-col items-center justify-center">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden">
          <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
        </div>
        <span className="text-xl font-bold text-[#1e293b] tracking-tight">
          The Reserve
        </span>
      </div>

      <nav className="w-full max-w-xs mb-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-gray-600 text-sm font-medium">
          {navLinks.map((links: LinkTypes) => (
            <li key={links.name}>
              <a
                onClick={(e) => handleLinkClick(e, links.path)}
                className="hover:text-black transition-colors"
              >
                {links.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-6 text-gray-700">
        <a className="hover:text-black transition-colors">
          <Gamepad2 size={22} />
        </a>

        <a className="hover:text-black transition-colors">
          <X size={22} />
        </a>

        <a className="hover:text-black transition-colors">
          <GitMerge size={22} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
