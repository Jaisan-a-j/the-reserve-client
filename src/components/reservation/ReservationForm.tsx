import { MessageCircle } from "lucide-react";
import type { FormFieldMeta, UserBooking } from "../../types";
import FormInput from "./FormInput";
import { formFields } from "../../constants/forms";
import Button from "../common/Button";
import SlotPicker from "./SlotPicker";

interface ReservationFormProps {
  today: string;
  formData: Record<string, string>;
  fieldErrors: Record<string, string>;
  existingBookingForSelectedDate: UserBooking | undefined;
  bookedSlots: string[];
  loadingSlots: boolean;
  availableTimeSlots: string[];
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleTimeSlotSelect: (slot: string) => void;
}

const ReservationForm = ({
  today,
  formData,
  fieldErrors,
  existingBookingForSelectedDate,
  bookedSlots,
  loadingSlots,
  availableTimeSlots,
  loading,
  handleInputChange,
  handleSubmit,
  handleTimeSlotSelect,
}: ReservationFormProps) => {
  return (
    <form
      className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit}
    >
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
        <SlotPicker
          availableSlots={availableTimeSlots}
          bookedSlots={bookedSlots}
          selectedSlot={formData.time}
          loading={loadingSlots}
          onSelect={handleTimeSlotSelect}
          error={fieldErrors.time}
        />
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
          disabled={loading || existingBookingForSelectedDate ? true : false}
        />
      </div>
    </form>
  );
};

export default ReservationForm;
