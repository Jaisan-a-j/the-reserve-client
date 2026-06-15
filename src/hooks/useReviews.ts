import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../services/reviewService";
import type { ReviewType } from "../types";

export const useReviews = () => {
  return useQuery<ReviewType[], Error>({
    queryKey: ["reviews"],
    queryFn: getReviews,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
