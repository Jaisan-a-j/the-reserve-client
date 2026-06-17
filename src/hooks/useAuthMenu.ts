import { useState , useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./reduxHooks";
import { logoutThunk } from "../features/auth/authThunk";
import { useNavigation } from "./useNavigation";

export default function useAuthMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setIsOpen } = useNavigation();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const authAction = () => {
    setIsProfileOpen((current) => !current);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);

    try {
      await dispatch(logoutThunk());
      setIsProfileOpen(false);
      setIsConfirmOpen(false);
      navigate("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  const cancelLogout = () => {
    setIsConfirmOpen(false);
  };

  const openLogoutConfirm = () => {
    setIsProfileOpen(false);
    setIsConfirmOpen(true);
  };

  const openProfilePage = () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate("/profile");
  };

  const openAuthPage = () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate("/auth");
  };

  return {
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
    profileMenuRef
  } as const;
}
