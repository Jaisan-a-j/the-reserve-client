import { Menu, X } from "lucide-react";
import logo from "../../assets/icon.jpeg";
import { navLinks } from "../../constants/menus";
import type { LinkTypes } from "../../types";
import SecondaryButton from "./SecondaryButton";
import { useAppSelector } from "../../hooks/reduxHooks";
import Modal from "./Modal";
import { useNavigation } from "../../hooks/useNavigation";
import { useNavigationContext } from "../../providers/NavigationProvider";
import { UserRound } from "lucide-react";
import ProfileDropdown from "../header/ProfileDropdown";
import MobileMenu from "../header/MobileMenu";
import useAuthMenu from "../../hooks/useAuthMenu";
import { useClickOutside } from "../../hooks/useClickOutside";
const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const {
    isConfirmOpen,
    isProfileOpen,
    authAction,
    confirmLogout,
    cancelLogout,
    openLogoutConfirm,
    openProfilePage,
    openAuthPage,
    setIsProfileOpen,
    logoutLoading,
    profileMenuRef,
  } = useAuthMenu();
  useClickOutside({ ref: profileMenuRef, isOpen: isProfileOpen, onClose: () => setIsProfileOpen(false) });
  const { isOpen, setIsOpen, handleLinkClick } = useNavigation();
  const { activeSection } = useNavigationContext();

  const isActiveLink = (path?: string) => {
    if (path?.startsWith("/")) {
      return location.pathname === path;
    }
    return location.pathname === "/" && activeSection === path;
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

          <div className="relative hidden lg:block" ref={profileMenuRef}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={authAction}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#ded7ff] bg-[#f5f2ff] text-[#7c5dfa] transition-colors hover:border-[#7c5dfa]"
              >
                <UserRound size={19} strokeWidth={2.4} />
              </button>
            </div>

            <ProfileDropdown
              isProfileOpen={isProfileOpen}
              user={user}
              onProfilePage={openProfilePage}
              onLogoutConfirm={openLogoutConfirm}
              onLogin={openAuthPage}
            />
          </div>

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

      <MobileMenu
        isOpen={isOpen}
        navLinks={navLinks}
        isActiveLink={isActiveLink}
        handleLinkClick={handleLinkClick}
        user={user}
        openProfilePage={openProfilePage}
        openLogoutConfirm={openLogoutConfirm}
        setIsOpen={setIsOpen}
        authAction={openAuthPage}
      />

      <Modal
        isOpen={isConfirmOpen}
        title="Confirm Logout"
        message="Are you sure you want to Logout?"
        confirmLabel="Yes, Logout"
        cancelLabel="Cancel"
        confirmLoading={logoutLoading}
        onConfirm={confirmLogout}
        onClose={cancelLogout}
      />
    </nav>
  );
};

export default Header;
