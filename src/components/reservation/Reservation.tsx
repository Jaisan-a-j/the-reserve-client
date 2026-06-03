import { useState } from "react";
import BookingLimitPanel from "./BookingLimitPanel";
import ReservationForm from "./ReservationForm";
import useReservation from "./useReservation";
import ContactCard from "./ContactCard";
import ActiveUserBooking from "./ActiveUserBooking";
import Modal from "../common/Modal";
import Alert from "../common/Alert";

const Reservation = () => {
  const {
    today,
    formData,
    fieldErrors,
    bookedSlots,
    loadingSlots,
    userBookings,
    cancelError,
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
  } = useReservation();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingCancelBookingId, setPendingCancelBookingId] = useState<
    string | null
  >(null);

  const alertData =
    fieldErrors.form !== undefined && fieldErrors.form !== ""
      ? { type: "error" as const, message: fieldErrors.form }
      : error
        ? { type: "error" as const, message: error }
        : success && message
          ? { type: "success" as const, message }
          : null;

  const openCancelConfirmation = (bookingId: string) => {
    setPendingCancelBookingId(bookingId);
    setIsConfirmOpen(true);
  };

  const closeCancelConfirmation = () => {
    setPendingCancelBookingId(null);
    setIsConfirmOpen(false);
  };

  const confirmCancelBooking = async () => {
    if (!pendingCancelBookingId) {
      return;
    }

    await handleCancelBooking(pendingCancelBookingId);
    closeCancelConfirmation();
  };

  return (
    <section
      id="reservation"
      className="w-full px-6 py-14 md:py-24 bg-[#f8f7fb]"
    >
      <Alert
        isOpen={!!alertData}
        type={alertData?.type ?? "success"}
        message={alertData?.message ?? ""}
        onClose={clearBookingAlert}
      />

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
            <BookingLimitPanel errorMessage={cancelError} />
          ) : (
            <ReservationForm
              today={today}
              formData={formData}
              fieldErrors={fieldErrors}
              existingBookingForSelectedDate={existingBookingForSelectedDate}
              bookedSlots={bookedSlots}
              loadingSlots={loadingSlots}
              availableTimeSlots={availableTimeSlots}
              loading={loading}
              success={success}
              error={error}
              message={message}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleTimeSlotSelect={handleTimeSlotSelect}
            />
          )}
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

      <ActiveUserBooking
        bookings={userBookings}
        onCancelClick={openCancelConfirmation}
      />

      <Modal
        isOpen={isConfirmOpen}
        title="Confirm Cancellation"
        message="Are you sure you want to delete this booking?"
        confirmLabel="Yes, delete"
        cancelLabel="Keep booking"
        onConfirm={confirmCancelBooking}
        onClose={closeCancelConfirmation}
      />
    </section>
  );
};

export default Reservation;
