import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/food`,
});

export type FoodItemsQueryParams = {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  cuisines?: string[];
  dietary?: string[];
  spice?: string[];
};

const serializeFoodParams = (params?: FoodItemsQueryParams) => {
  if (!params) return undefined;

  const serialized: Record<string, string | number> = {};

  if (params.page !== undefined) serialized.page = params.page;
  if (params.limit !== undefined) serialized.limit = params.limit;
  if (params.minPrice !== undefined) serialized.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) serialized.maxPrice = params.maxPrice;
  if (params.cuisines && params.cuisines.length > 0) {
    serialized.cuisines = params.cuisines.join(",");
  }
  if (params.dietary && params.dietary.length > 0) {
    serialized.dietary = params.dietary.join(",");
  }
  if (params.spice && params.spice.length > 0) {
    serialized.spice = params.spice.join(",");
  }

  return serialized;
};

export const getFoodItems = async (params?: FoodItemsQueryParams) => {
  const response = await API.get("/", {
    params: serializeFoodParams(params),
  });
  return response.data;
};

export const getFoodPriceRange = async () => {
  const response = await API.get("/price-range");
  return response.data;
};

export const getBestSellers = async () => {
  const response = await API.get("/best-sellers");
  return response.data;
};

export const getChefSpecials = async () => {
  const response = await API.get("/chef-specials");
  return response.data;
};

export const getNewArrivals = async () => {
  const response = await API.get("/new-arrivals");
  return response.data;
};

export const getTrending = async () => {
  const response = await API.get("/trending");
  return response.data;
};
