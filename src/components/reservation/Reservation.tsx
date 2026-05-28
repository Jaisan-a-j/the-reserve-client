import { MessageCircle } from "lucide-react";
import {
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";
import FormInput from "./FormInput";
import { formFields } from "../../constants/forms";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { createBookingThunk } from "../../features/booking/bookingThunk";
import { clearBookingMessage } from "../../features/booking/bookingSlice";
import {
  getBookedTimeSlots,
  getMyBookings,
  cancelBooking,
} from "../../services/bookingService";
import ContactCard from "./ContactCard";
import type { FormFieldMeta } from "../../types";
import Button from "../common/Button";

type UserBooking = {
  _id: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  status: string;
};

const Reservation = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { loading, success, error, message } = useAppSelector(
    (state) => state.booking,
  );
  const [formData, setFormData] = useState<Record<string, string>>({
    message: "",
    phone: "",
    date: "",
    time: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

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
      if (formData.date) {
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
      }
    };

    fetchBookedSlots();
  }, [formData.date]);

  const today = new Date().toISOString().split("T")[0];

  const existingBookingForSelectedDate = userBookings.find(
    (booking) => booking.date === formData.date,
  );

  const hasReachedBookingLimit = userBookings.length >= 2;

  const handleTimeSlotSelect = (time: string) => {
    if (bookedSlots.includes(time)) {
      return;
    }

    if (existingBookingForSelectedDate) {
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
    let nextValue = value;

    if (name === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }

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

    try {
      await cancelBooking(bookingId, token);
      await refreshMyBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setCancelError("Could not cancel booking. Please try again.");
    }
  };

  const timeSlots = [
    "09:00 AM",
    "11:00 AM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
    "07:00 PM",
  ];

  const getAvailableTimeSlots = () => {
    let availableSlots = timeSlots;

    if (formData.date === today) {
      const currentHour = new Date().getHours();

      availableSlots = timeSlots.filter((slot) => {
        const [time, period] = slot.split(" ");
        let hour = parseInt(time.split(":")[0]);

        if (period === "PM" && hour !== 12) {
          hour += 12;
        } else if (period === "AM" && hour === 12) {
          hour = 0;
        }

        return hour > currentHour;
      });
    }

    return availableSlots.filter((slot) => !bookedSlots.includes(slot));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    if (!token) {
      setFieldErrors({
        form: "Please log in before booking a table.",
      });
      return;
    }

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
        },
        token,
      }),
    );

    if (createBookingThunk.fulfilled.match(resultAction)) {
      await refreshMyBookings();
      setFormData({
        message: "",
        phone: "",
        date: "",
        time: "",
      });
    }
  };

  return (
    <section
      id="reservation"
      className="w-full px-6 py-14 md:py-24 bg-[#f8f7fb]"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#2b2d42] leading-tight">
          Get in Touch to Reserve Your Table
        </h2>
        <p className="mt-4 text-gray-600 text-base md:text-lg leading-7">
          Whether you're planning a casual dinner or a special celebration,
          we're here to make your experience seamless.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h3 className="text-2xl font-bold tracking-tight text-[#2b2d42]">
            Reserve Your Table
          </h3>
          {hasReachedBookingLimit ? (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-700">
                  You already have two active bookings. You cannot reserve more
                  until you cancel one of your existing bookings.
                </p>
              </div>
              {cancelError && (
                <div className="text-sm text-red-600">{cancelError}</div>
              )}
              {loadingBookings ? (
                <p className="text-sm text-gray-600">
                  Loading your bookings...
                </p>
              ) : (
                <div className="grid gap-4">
                  {userBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Date:</span>{" "}
                        {booking.date}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Time:</span>{" "}
                        {booking.time}
                      </p>
                      {booking.message && (
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Message:</span>{" "}
                          {booking.message}
                        </p>
                      )}
                      <div className="mt-4">
                        <Button
                          content="Cancel Booking"
                          type="button"
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {fieldErrors.form && (
                <div className="md:col-span-2 text-sm text-red-600">
                  {fieldErrors.form}
                </div>
              )}
              {error && (
                <div className="md:col-span-2 text-sm text-red-600">
                  {error}
                </div>
              )}
              {success && message && (
                <div className="md:col-span-2 text-sm text-green-600">
                  {message}
                </div>
              )}
              {formFields
                .filter((field) => field.name !== "time")
                .map((field: FormFieldMeta) => (
                  <FormInput
                    key={field.label}
                    {...field}
                    min={field.name === "date" ? today : field.min}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    error={fieldErrors[field.name]}
                  />
                ))}

              {formData.date && existingBookingForSelectedDate ? (
                <div className="md:col-span-2 rounded-2xl border border-yellow-300 bg-yellow-50 p-6">
                  <p className="text-sm font-medium text-yellow-900 mb-3">
                    You already have a booking on {formData.date}.
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Booked time:</span>{" "}
                    {existingBookingForSelectedDate.time}
                  </p>
                  {existingBookingForSelectedDate.message && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Message:</span>{" "}
                      {existingBookingForSelectedDate.message}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-gray-600">
                    Please select a different date to reserve another slot.
                  </p>
                </div>
              ) : formData.date ? (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#2b2d42] mb-4">
                    Select Available Time Slot{" "}
                    {loadingSlots && (
                      <span className="text-sm text-gray-500">
                        (Loading...)
                      </span>
                    )}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {getAvailableTimeSlots().length > 0 ? (
                      getAvailableTimeSlots().map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleTimeSlotSelect(slot)}
                          disabled={bookedSlots.includes(slot)}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            formData.time === slot
                              ? "bg-[#7c5dfa] text-white shadow-md"
                              : bookedSlots.includes(slot)
                                ? "bg-red-100 text-red-600 cursor-not-allowed opacity-50"
                                : "bg-green-100 text-[#059669] hover:bg-green-200"
                          }`}
                        >
                          {slot}
                        </button>
                      ))
                    ) : timeSlots.length > bookedSlots.length ? (
                      <p className="text-gray-600 col-span-3">
                        No available slots for this date.
                      </p>
                    ) : (
                      <p className="text-gray-600 col-span-3">
                        All slots booked for this date.
                      </p>
                    )}
                  </div>
                  {fieldErrors.time && (
                    <p className="text-red-600 text-xs mt-2">
                      {fieldErrors.time}
                    </p>
                  )}
                </div>
              ) : null}

              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#2b2d42] mb-2"
                >
                  Message
                </label>
                <div className="flex items-start border border-gray-300 rounded-xl px-4 py-4 focus-within:border-purple-500 transition-colors">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full outline-none text-sm text-gray-700 resize-none placeholder:text-gray-400"
                  />
                  <MessageCircle className="text-gray-500 mt-1" size={20} />
                </div>
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  content={loading ? "Booking..." : "Book a Reservation"}
                  disabled={loading}
                />
              </div>
            </form>
          )}{" "}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <address className="flex flex-col gap-6 not-italic">
            <ContactCard title="Email/Phone">
              <div className="mt-5 space-y-2">
                <p className="text-gray-600 text-base font-medium">
                  johndoe@gmail.com
                </p>
                <p className="text-gray-600 text-base">+148 589 2001 2466</p>
              </div>
            </ContactCard>

            <ContactCard title="Our Location">
              <p className="mt-5 text-gray-600 text-base leading-8">
                Office 149,
                <br />
                450 South Brand Brooklyn
                <br />
                San Diego County,
                <br />
                CA 91905, USA
              </p>
            </ContactCard>
          </address>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-[#2b2d42] font-medium text-lg">
              Opening Hours
              <br className="md:hidden" />
              <span className="text-purple-600 font-bold ml-1 md:ml-2">
                9AM - 9PM
              </span>
              <br />
              Everyday
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
