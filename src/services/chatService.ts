import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/chat`,
});

export const sendChatMessage = async (message: string) => {
  const response = await API.post("/", { message });
  return response.data;
};
