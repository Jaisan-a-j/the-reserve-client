interface BookingLimitPanelProps {
  errorMessage: string | null;
}

const BookingLimitPanel = ({ errorMessage }: BookingLimitPanelProps) => {
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
    </div>
  );
};

export default BookingLimitPanel;
