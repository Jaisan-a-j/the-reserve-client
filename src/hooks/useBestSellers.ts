import { useQuery } from "@tanstack/react-query";
import { getBestSellers } from "../services/foodService";
import type { FoodItem } from "../types";

type BestSellersResponse = {
  data: FoodItem[];
};

export const useBestSellers = (enabled: boolean) => {
  return useQuery<FoodItem[], Error>({
    queryKey: ["bestSellers"],
    queryFn: async () => {
      const response = (await getBestSellers()) as BestSellersResponse;
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
