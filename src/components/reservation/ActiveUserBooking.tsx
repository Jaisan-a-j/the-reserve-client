import type { UserBooking } from "../../types";

interface ActiveUserBookingProps {
  bookings: UserBooking[];
  onCancelClick: (id: string) => void;
}

const ActiveUserBooking = ({
  bookings,
  onCancelClick,
}: ActiveUserBookingProps) => {
  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold tracking-tight text-[#2b2d42]">
          Active Bookings
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-600">
              You have no active bookings.
            </p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      Date
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2d42]">
                      {booking.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      Time
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2d42]">
                      {booking.time}
                    </p>
                  </div>

                  <button
                    className="w-full sm:w-auto px-5 py-3 bg-red-600 text-white rounded-full font-semibold transition hover:bg-red-700"
                    onClick={() => onCancelClick(booking._id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveUserBooking;
