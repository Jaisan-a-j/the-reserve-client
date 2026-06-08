import { LogOut, User } from "lucide-react";
import type { LinkTypes } from "../../types";
import SecondaryButton from "../common/SecondaryButton";

interface User {
  fullName: string;
  email: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: LinkTypes[];
  isActiveLink: (path?: string) => boolean;
  handleLinkClick: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
  user: User | null;
  openProfilePage: () => void;
  openLogoutConfirm: () => void;
  setIsOpen: (isOpen: boolean) => void;
  authAction: () => void;
}

const MobileMenu = ({
  isOpen,
  navLinks,
  isActiveLink,
  handleLinkClick,
  user,
  openProfilePage,
  openLogoutConfirm,
  setIsOpen,
  authAction,
}: MobileMenuProps) => {
  return (
    <>
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
                handleLinkClick(e, link.path ?? "");
                setIsOpen(false);
              }}
              className={`text-lg font-medium transition-colors cursor-pointer ${
                isActiveLink(link.path) ? "text-[#7c5dfa]" : "text-gray-700"
              }`}
            >
              {link.name}
            </a>
          ))}

          {user ? (
            <div className="border-t border-gray-100 pt-4">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={openProfilePage}
                  className="flex h-11 w-full items-center gap-4 rounded-md px-1 text-left text-sm font-medium text-[#1e293b] transition-colors hover:text-[#7c5dfa]"
                >
                  <User size={16} strokeWidth={2.3} />
                  My Account
                </button>
              </div>

              <div className="mt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openLogoutConfirm();
                  }}
                  className="flex h-11 w-full items-center gap-4 rounded-md px-1 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} strokeWidth={2.3} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <SecondaryButton
              onClick={authAction}
              content="Login"
              className="lg:hidden self-start"
            />
          )}
        </nav>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileMenu;
