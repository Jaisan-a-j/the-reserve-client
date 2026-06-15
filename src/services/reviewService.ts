import axios from "axios";
import type { ReviewInput } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/reviews`,
});

export const createReview = async (reviewData: ReviewInput, token: string) => {
  const response = await API.post("/", reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getReviews = async () => {
  const response = await API.get("/");
  return response.data.reviews;
};
