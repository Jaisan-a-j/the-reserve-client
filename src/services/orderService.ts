import axios from "axios";
import type { OrderInput } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/orders`,
});

export const createOrder = async (orderData: OrderInput, token: string) => {
  const response = await API.post("/", orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
