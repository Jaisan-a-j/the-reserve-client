import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/bookings",
});

export const createBooking = async (
  bookingData: {
    phone: string;
    date: string;
    time: string;
    message?: string;
  },
  token: string,
) => {
  const response = await API.post("/", bookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyBookings = async (token: string) => {
  const response = await API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
