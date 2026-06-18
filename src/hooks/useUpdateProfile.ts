import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setUser } from "../features/auth/authSlice";
import { updateUserProfile } from "../services/authService";
import type { UpdateUserProfileInput, UserType } from "../types";

type UpdateProfileResponse = {
  message: string;
  user: UserType;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);

  return useMutation({
    mutationFn: async (profileData: UpdateUserProfileInput) => {
      if (!token) {
        throw new Error("Please log in to update your profile.");
      }

      try {
        return (await updateUserProfile(profileData, token)) as UpdateProfileResponse;
      } catch (error: unknown) {
        throw new Error(
          getErrorMessage(error, "Unable to update your profile."),
        );
      }
    },
    onSuccess: (response) => {
      dispatch(setUser(response.user));
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
