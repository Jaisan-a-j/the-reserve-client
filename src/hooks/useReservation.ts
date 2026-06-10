import {
  useState,
  useCallback,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { createBookingThunk } from "../features/booking/bookingThunk";
import { clearBookingMessage } from "../features/booking/bookingSlice";
import {
  getBookedTimeSlots,
  getMyBookings,
  cancelBooking,
} from "../services/bookingService";
import type { BookingInput, UserBooking } from "../types";

const defaultFormData = {
  message: "",
  phone: "",
  date: "",
  time: "",
};

const timeSlots = [
  "09:00 AM",
  "11:00 AM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
  "07:00 PM",
];

const getTimeSlotsForDate = (selectedDate: string, today: string) => {
  if (selectedDate !== today) {
    return timeSlots;
  }

  const currentHour = new Date().getHours();

  return timeSlots.filter((slot) => {
    const [time, period] = slot.split(" ");
    let hour = parseInt(time.split(":")[0], 10);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return hour > currentHour;
  });
};

export const useReservation = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { loading, success, error, message } = useAppSelector(
    (state) => state.booking,
  );
  const [formData, setFormData] =
    useState<Record<string, string>>(defaultFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const refreshMyBookings = useCallback(async () => {
    if (!token) {
      setUserBookings([]);
      return;
    }

    setLoadingBookings(true);
    try {
      const data = await getMyBookings(token);
      setUserBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setUserBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [token]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (success) {
      timer = setTimeout(() => {
        dispatch(clearBookingMessage());
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [success, dispatch]);

  useEffect(() => {
    const loadBookings = async () => {
      await refreshMyBookings();
    };

    void loadBookings();
  }, [refreshMyBookings]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!formData.date) {
        setBookedSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const data = await getBookedTimeSlots(formData.date);
        setBookedSlots(data.bookedTimeSlots || []);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    void fetchBookedSlots();
  }, [formData.date]);

  const existingBookingForSelectedDate = userBookings.find(
    (booking) => booking.date === formData.date,
  );
  const hasReachedBookingLimit = userBookings.length >= 2;

  const handleTimeSlotSelect = (time: string) => {
    if (bookedSlots.includes(time) || existingBookingForSelectedDate) {
      return;
    }

    setFormData((prev) => ({ ...prev, time }));
    if (fieldErrors.time) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated.time;
        return updated;
      });
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const nextValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!token) {
      setCancelError("You must be logged in to cancel a booking.");
      return;
    }

    setCancelError(null);
    setCancelLoading(true);

    try {
      await cancelBooking(bookingId, token);
      await refreshMyBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setCancelError("Could not cancel booking. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const validateBooking = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!formData.date) {
      errors.date = "Date is required.";
    } else if (formData.date < today) {
      errors.date = "Please choose today or a future date.";
    }

    if (!formData.time) {
      errors.time = "Time is required.";
    }

    return errors;
  };

  const clearBookingAlert = () => {
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated.form;
      return updated;
    });
    dispatch(clearBookingMessage());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    if (!token) {
      setFieldErrors({ form: "Please log in before booking a table." });
      return;
    }

    const errors = validateBooking();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const resultAction = await dispatch(
      createBookingThunk({
        bookingData: {
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          message: formData.message,
        } as BookingInput,
        token,
      }),
    );

    if (createBookingThunk.fulfilled.match(resultAction)) {
      await refreshMyBookings();
      setFormData(defaultFormData);
    }
  };

  const availableTimeSlots = getTimeSlotsForDate(formData.date, today).filter(
    (slot) => !bookedSlots.includes(slot),
  );

  return {
    today,
    formData,
    fieldErrors,
    bookedSlots,
    loadingSlots,
    userBookings,
    loadingBookings,
    cancelError,
    cancelLoading,
    existingBookingForSelectedDate,
    hasReachedBookingLimit,
    availableTimeSlots,
    loading,
    success,
    error,
    message,
    handleTimeSlotSelect,
    handleInputChange,
    handleCancelBooking,
    handleSubmit,
    clearBookingAlert,
  };
};

export default useReservation;
