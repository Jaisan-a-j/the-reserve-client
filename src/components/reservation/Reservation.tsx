import { MessageCircle } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import FormInput from "./FormInput";
import { formFields } from "../../constants/forms";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { createBookingThunk } from "../../features/booking/bookingThunk";
import { clearBookingMessage } from "../../features/booking/bookingSlice";
import ContactCard from "./ContactCard";
import type { FormFieldMeta } from "../../types";
import Button from "../common/Button";

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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (success) {
      timer = setTimeout(() => {
        dispatch(clearBookingMessage());
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [success, dispatch]);

  const today = new Date().toISOString().split("T")[0];

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

    await dispatch(
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
    setFormData({
      message: "",
      phone: "",
      date: "",
      time: "",
    });
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
            Book a Table
          </h3>

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
              <div className="md:col-span-2 text-sm text-red-600">{error}</div>
            )}
            {success && message && (
              <div className="md:col-span-2 text-sm text-green-600">
                {message}
              </div>
            )}
            {formFields.map((field: FormFieldMeta) => (
              <FormInput
                key={field.label}
                {...field}
                min={field.name === "date" ? today : field.min}
                value={formData[field.name]}
                onChange={handleInputChange}
                error={fieldErrors[field.name]}
              />
            ))}

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
                9AM - 11PM
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
