import type { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/auth`,
});

export const registerUser = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/register", data);
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await API.post("/verifyotp", data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await API.post("/login", data);
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await API.post(
    "/user",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const updateUserProfile = async (
  profile: {
    address: string;
    city: string;
    pinCode: string;
  },
  token: string,
) => {
  const response = await API.put("/profile", profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const loginGoogleUser = async (
  credentialResponse: CredentialResponse,
) => {
  const response = await API.post("/google", {
    credential: credentialResponse.credential,
  });

  return response.data;
};
