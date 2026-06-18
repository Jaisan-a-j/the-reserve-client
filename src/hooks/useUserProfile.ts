import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/authService";
import { useAppSelector } from "./reduxHooks";
import type { UserType } from "../types";

export const useUserProfile = () => {
  const token = useAppSelector((state) => state.auth.token);

  return useQuery<UserType, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!token) {
        throw new Error("Please log in to load your profile.");
      }

      return await getCurrentUser(token);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
