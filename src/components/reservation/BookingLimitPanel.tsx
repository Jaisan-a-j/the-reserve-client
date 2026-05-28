import type { UserBooking } from "../../types";
import Button from "../common/Button";

interface BookingLimitPanelProps {
  bookings: UserBooking[];
  loading: boolean;
  errorMessage: string | null;
  onCancel: (id: string) => void;
}

const BookingLimitPanel = ({
  bookings,
  loading,
  errorMessage,
  onCancel,
}: BookingLimitPanelProps) => {
  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-700">
          You already have two active bookings. You cannot reserve more until
          you cancel one of your existing bookings.
        </p>
      </div>
      {errorMessage && (
        <div className="text-sm text-red-600">{errorMessage}</div>
      )}
      {loading ? (
        <p className="text-sm text-gray-600">Loading your bookings...</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            >
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Date:</span> {booking.date}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Time:</span> {booking.time}
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
                  onClick={() => onCancel(booking._id)}
                  className="bg-red-600 text-white hover:bg-red-700"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingLimitPanel;
