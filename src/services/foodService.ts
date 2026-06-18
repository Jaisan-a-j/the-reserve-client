import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/food`,
});

export const getFoodItems = async () => {
  const response = await API.get("/");
  return response.data;
};

export const getBestSellers = async () => {
  const response = await API.get("/best-sellers");
  return response.data;
};
