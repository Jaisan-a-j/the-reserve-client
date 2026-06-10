import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { logoutThunk } from "../features/auth/authThunk";
import { useNavigation } from "./useNavigation";

export default function useAuthMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setIsOpen } = useNavigation();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const authAction = () => {
    if (user) {
      setIsProfileOpen((current) => !current);
    } else {
      navigate("/auth");
    }
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

  return {
    isConfirmOpen,
    isProfileOpen,
    authAction,
    confirmLogout,
    cancelLogout,
    openLogoutConfirm,
    openProfilePage,
    logoutLoading,
  } as const;
}
