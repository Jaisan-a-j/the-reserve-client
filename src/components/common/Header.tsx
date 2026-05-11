import { Menu } from "lucide-react";
import logo from "../../assets/icon.jpeg";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-2 py-3 bg-white border-b border-gray-100 shadow-sm">
      {/* Left Section: Logo and Brand Name */}
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden">
          {/* Replaced SVG with your local image */}
          <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
        </div>
        <span className="text-xl font-bold text-[#1e293b] tracking-tight">
          The Reserve
        </span>
      </div>

      {/* Right Section: Button and Hamburger */}
      <div className="flex items-center gap-3">
        <button className="bg-[#7c5dfa] text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-[#6a4ee0] transition-colors shadow-md">
          Book A Table
        </button>

        <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Menu />
        </button>
      </div>
    </header>
  );
};

export default Header;
