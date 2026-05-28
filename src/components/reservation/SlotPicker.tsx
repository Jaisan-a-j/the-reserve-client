interface SlotPickerProps {
  availableSlots: string[];
  bookedSlots: string[];
  selectedSlot: string;
  loading: boolean;
  onSelect: (slot: string) => void;
  error?: string;
}

const SlotPicker = ({
  availableSlots,
  bookedSlots,
  selectedSlot,
  loading,
  onSelect,
  error,
}: SlotPickerProps) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-[#2b2d42] mb-4">
        Select Available Time Slot{" "}
        {loading && <span className="text-sm text-gray-500">(Loading...)</span>}
      </label>
      <div className="grid grid-cols-3 gap-3">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelect(slot)}
                disabled={isBooked}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  selectedSlot === slot
                    ? "bg-[#7c5dfa] text-white shadow-md"
                    : isBooked
                      ? "bg-red-100 text-red-600 cursor-not-allowed opacity-50"
                      : "bg-green-100 text-[#059669] hover:bg-green-200"
                }`}
              >
                {slot}
              </button>
            );
          })
        ) : availableSlots.length === 0 ? (
          <p className="text-gray-600 col-span-3">
            No available slots for this date.
          </p>
        ) : null}
      </div>
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default SlotPicker;
