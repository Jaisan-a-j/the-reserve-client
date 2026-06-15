import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { createReview } from "../services/reviewService";
import { useAppSelector } from "./reduxHooks";
import type { ReviewInput } from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useCreateReview = () => {
  const token = useAppSelector((state) => state.auth.token);

  return useMutation({
    mutationFn: async (reviewData: ReviewInput) => {
      if (!token) {
        throw new Error("Please log in to submit your review.");
      }

      try {
        return await createReview(reviewData, token);
      } catch (error: unknown) {
        throw new Error(
          getErrorMessage(error, "Unable to submit your review."),
        );
      }
    },
  });
};
