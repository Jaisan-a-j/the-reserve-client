import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getFoodItems,
  getFoodPriceRange,
  type FoodItemsQueryParams,
} from "../services/foodService";
import type { FoodItem } from "../types";

export type FoodItemsFilters = {
  minPrice: number;
  maxPrice: number;
  cuisines: string[];
  dietary: string[];
  spice: string[];
};

export type PaginatedFoodItemsResponse = {
  data: FoodItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type FoodPriceRange = {
  minPrice: number;
  maxPrice: number;
};

type FoodItemsApiResponse = {
  data: FoodItem[];
  pagination: PaginatedFoodItemsResponse["pagination"];
};

type FoodPriceRangeApiResponse = {
  data: FoodPriceRange;
};

export const useFoodItems = (
  page: number,
  filters: FoodItemsFilters,
  enabled: boolean,
  limit = 9,
) => {
  return useQuery<PaginatedFoodItemsResponse, Error>({
    queryKey: ["foodItems", { page, limit, filters }],
    queryFn: async () => {
      const params: FoodItemsQueryParams = {
        page,
        limit,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        cuisines: filters.cuisines,
        dietary: filters.dietary,
        spice: filters.spice,
      };
      const response = (await getFoodItems(params)) as FoodItemsApiResponse;
      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useFoodPriceRange = () => {
  return useQuery<FoodPriceRange, Error>({
    queryKey: ["foodPriceRange"],
    queryFn: async () => {
      const response = (await getFoodPriceRange()) as FoodPriceRangeApiResponse;
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
