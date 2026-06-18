import { useEffect, useState } from "react";
import { MapPin, Pencil, X, Check } from "lucide-react";

import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import type { UserType } from "../../types";

type AddressDetails = {
  address: string;
  city: string;
  pinCode: string;
};

type ProfileAddressSectionProps = {
  user: UserType | null;
};

const emptyAddress: AddressDetails = {
  address: "",
  city: "",
  pinCode: "",
};

const getInitialAddress = (user: UserType | null): AddressDetails => ({
  address: user?.profile?.address ?? "",
  city: user?.profile?.city ?? "",
  pinCode: user?.profile?.pinCode ?? "",
});

const ProfileAddressSection = ({
  user,
}: ProfileAddressSectionProps) => {
  const {
    mutate: saveProfile,
    isPending,
    error,
    reset,
  } = useUpdateProfile();

  const [savedAddress, setSavedAddress] = useState<AddressDetails>(() =>
    getInitialAddress(user)
  );

  const [draftAddress, setDraftAddress] =
    useState<AddressDetails>(emptyAddress);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setSavedAddress(getInitialAddress(user));
  }, [user]);

  const hasSavedAddress =
    savedAddress.address.trim() ||
    savedAddress.city.trim() ||
    savedAddress.pinCode.trim();

  const startEditing = () => {
    reset();
    setDraftAddress(savedAddress);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset();
    setDraftAddress(savedAddress);
    setIsEditing(false);
  };

  const handleSave = () => {
    const profileData = {
      address: draftAddress.address.trim(),
      city: draftAddress.city.trim(),
      pinCode: draftAddress.pinCode.trim(),
    };

    saveProfile(profileData, {
      onSuccess: () => {
        setSavedAddress(profileData);
        setIsEditing(false);
      },
    });
  };

  const updateDraftField = (
    field: keyof AddressDetails,
    value: string
  ) => {
    setDraftAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-[#f5f2ff] text-[#633df1]">
            <MapPin size={20} strokeWidth={2.4} />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#633df1]">
              Delivery Details
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Your Address
            </h2>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111111] transition-colors hover:border-[#825cff]"
          >
            <Pencil size={16} strokeWidth={2.4} />
            {hasSavedAddress ? "Edit Address" : "Add Address"}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error.message}
        </div>
      )}

      {isEditing ? (
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Address</span>

            <input
              value={draftAddress.address}
              onChange={(event) =>
                updateDraftField("address", event.target.value)
              }
              placeholder="Street address"
              className="mt-2 h-12 w-full rounded-md border border-gray-200 px-4 text-base outline-none transition-colors focus:border-[#633df1] focus:ring-2 focus:ring-[#633df1]/20"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">City</span>

              <input
                value={draftAddress.city}
                onChange={(event) =>
                  updateDraftField("city", event.target.value)
                }
                placeholder="City"
                className="mt-2 h-12 w-full rounded-md border border-gray-200 px-4 text-base outline-none transition-colors focus:border-[#633df1] focus:ring-2 focus:ring-[#633df1]/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Pin Code</span>

              <input
                value={draftAddress.pinCode}
                onChange={(event) =>
                  updateDraftField("pinCode", event.target.value)
                }
                placeholder="Pin code"
                className="mt-2 h-12 w-full rounded-md border border-gray-200 px-4 text-base outline-none transition-colors focus:border-[#633df1] focus:ring-2 focus:ring-[#633df1]/20"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-2 h-28 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#633df1] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={16} strokeWidth={2.4} />
              {isPending ? "Saving..." : "Save Address"}
            </button>

            <button
              type="button"
              onClick={cancelEditing}
              disabled={isPending}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111111] transition-colors hover:border-[#825cff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} strokeWidth={2.4} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5 md:col-span-1">
            <p className="text-sm font-medium text-gray-500">Address</p>

            <p className="mt-2 text-base font-bold leading-6">
              {savedAddress.address.trim() || "Not added"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5">
            <p className="text-sm font-medium text-gray-500">City</p>

            <p className="mt-2 text-base font-bold">
              {savedAddress.city.trim() || "Not added"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5">
            <p className="text-sm font-medium text-gray-500">Pin Code</p>

            <p className="mt-2 text-base font-bold">
              {savedAddress.pinCode.trim() || "Not added"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileAddressSection;

