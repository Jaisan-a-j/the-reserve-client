import { LogOut, User, UserRound } from "lucide-react";
import SecondaryButton from "../common/SecondaryButton";

interface User {
  fullName: string;
  email: string;
}

interface ProfileDropdownProps {
  isProfileOpen: boolean;
  user: User | null;
  onProfilePage: () => void;
  onLogoutConfirm: () => void;
  onLogin: () => void;
}

const ProfileDropdown = ({
  isProfileOpen,
  user,
  onProfilePage,
  onLogoutConfirm,
  onLogin,
}: ProfileDropdownProps) => {
  return (
    <div
      className={`absolute right-0 top-12 w-60 rounded-md border border-gray-100 bg-white p-3 shadow-xl transition-all duration-200 ${
        isProfileOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f5f2ff] text-[#7c5dfa]">
          <UserRound size={20} strokeWidth={2.4} />
        </div>
        {user && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#1e293b]">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        )}
      </div>

      {user ? (
        <>
          <div className="mt-2 space-y-1">
            <button
              type="button"
              onClick={onProfilePage}
              className="flex h-10 w-full items-center gap-3 rounded-md bg-[#f5f2ff] px-3 text-left text-sm font-medium text-[#7c5dfa]"
            >
              <User size={16} strokeWidth={2.3} />
              My Account
            </button>
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onLogoutConfirm}
              className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} strokeWidth={2.3} />
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="mt-2">
          <SecondaryButton
            onClick={onLogin}
            content="Login"
            className="block w-full cursor-pointer text-center"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
