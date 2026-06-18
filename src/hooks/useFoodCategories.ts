import { useQuery } from "@tanstack/react-query";
import {
  getBestSellers,
  getChefSpecials,
  getNewArrivals,
  getTrending,
} from "../services/foodService";
import type { FoodItem } from "../types";

type FoodItemsResponse = {
  data: FoodItem[];
};

const foodCategoryQueryOptions = (enabled: boolean) => ({
  enabled,
  staleTime: 1000 * 60 * 5,
  retry: 1,
});

const fetchFoodCategory =
  (fetcher: () => Promise<unknown>) => async (): Promise<FoodItem[]> => {
    const response = (await fetcher()) as FoodItemsResponse;
    return response.data;
  };

export const useBestSellers = (enabled: boolean) => {
  return useQuery<FoodItem[], Error>({
    queryKey: ["bestSellers"],
    queryFn: fetchFoodCategory(getBestSellers),
    ...foodCategoryQueryOptions(enabled),
  });
};

export const useChefSpecials = (enabled: boolean) => {
  return useQuery<FoodItem[], Error>({
    queryKey: ["chefSpecials"],
    queryFn: fetchFoodCategory(getChefSpecials),
    ...foodCategoryQueryOptions(enabled),
  });
};

export const useNewArrivals = (enabled: boolean) => {
  return useQuery<FoodItem[], Error>({
    queryKey: ["newArrivals"],
    queryFn: fetchFoodCategory(getNewArrivals),
    ...foodCategoryQueryOptions(enabled),
  });
};

export const useTrending = (enabled: boolean) => {
  return useQuery<FoodItem[], Error>({
    queryKey: ["trending"],
    queryFn: fetchFoodCategory(getTrending),
    ...foodCategoryQueryOptions(enabled),
  });
};
