import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const registerUser = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/register", data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  console.log("data", data);

  const response = await API.post("/login", data);
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await API.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
