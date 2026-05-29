import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/cart`,
});

const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getCartItems = async (token: string) => {
  const response = await API.get("/", authHeaders(token));
  return response.data;
};

export const addCartItem = async (
  data: { foodId: string; quantity?: number },
  token: string,
) => {
  const response = await API.post("/", data, authHeaders(token));
  return response.data;
};

export const updateCartItemQuantity = async (
  data: { foodId: string; quantity: number },
  token: string,
) => {
  const response = await API.patch(
    `/${data.foodId}`,
    { quantity: data.quantity },
    authHeaders(token),
  );
  return response.data;
};

export const removeCartItem = async (foodId: string, token: string) => {
  const response = await API.delete(`/${foodId}`, authHeaders(token));
  return response.data;
};
