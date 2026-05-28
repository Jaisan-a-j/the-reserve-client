import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api/bookings`,
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

export const cancelBooking = async (bookingId: string, token: string) => {
  const response = await API.delete(`/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getBookedTimeSlots = async (date: string) => {
  const response = await API.get("/available-slots", {
    params: { date },
  });

  return response.data;
};
