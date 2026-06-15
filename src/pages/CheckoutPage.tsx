import { useEffect, useMemo, useState } from "react";
import BackButton from "../components/common/BackButton";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  getCartItemsThunk,
  updateCartItemQuantityThunk,
} from "../features/cart/cartThunk";
import { clearCartItems } from "../features/cart/cartSlice";
import { createOrderThunk } from "../features/order/orderThunk";
import { formatCurrency } from "../utils/formatCurrency";
import { Link } from "react-router-dom";
import UserReview from "../components/checkout/UserReview";

type PlacedOrderSummary = {
  total: number;
  fulfillment: "delivery" | "pickup";
};

type CreateOrderResponse = {
  order?: {
    total?: number;
    fulfillment?: "delivery" | "pickup";
  };
};

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const {
    items: cartItems,
    loading,
    error,
  } = useAppSelector((state) => state.cart);
  const { loading: orderLoading, error: orderError } = useAppSelector(
    (state) => state.order,
  );
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [payment, setPayment] = useState<"card" | "counter">("card");
  const [orderPlaced, setOrderPlaced] = useState(true);
  const [placedOrderSummary, setPlacedOrderSummary] =
    useState<PlacedOrderSummary | null>(null);
  const [updatingItemCounts, setUpdatingItemCounts] = useState<
    Record<string, number>
  >({});
  const [formValues, setFormValues] = useState(() => ({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  }));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (token && cartItems.length === 0) {
      dispatch(getCartItemsThunk());
    }
  }, [cartItems.length, dispatch, token]);

  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormValues((prev) => ({
      ...prev,
      fullName: prev.fullName || user.fullName || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0),
    [cartItems],
  );
  const serviceFee = subtotal > 0 ? 4.99 : 0;
  const deliveryFee = fulfillment === "delivery" && subtotal > 0 ? 6.5 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + serviceFee + deliveryFee + tax;

  const isItemUpdating = (foodId: string) =>
    (updatingItemCounts[foodId] ?? 0) > 0;

  const startUpdatingItem = (foodId: string) => {
    setUpdatingItemCounts((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] ?? 0) + 1,
    }));
  };

  const stopUpdatingItem = (foodId: string) => {
    setUpdatingItemCounts((prev) => {
      const currentCount = prev[foodId] ?? 0;
      return {
        ...prev,
        [foodId]: currentCount - 1,
      };
    });
  };

  const updateQuantity = (foodId: string, quantity: number, delta: number) => {
    const nextQuantity = Math.max(1, quantity + delta);
    startUpdatingItem(foodId);
    dispatch(
      updateCartItemQuantityThunk({ foodId, quantity: nextQuantity }),
    ).finally(() => stopUpdatingItem(foodId));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formValues.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!formValues.email.trim()) {
      errors.email = "Email is required";
    }
    if (!formValues.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formValues.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    if (fulfillment === "delivery") {
      if (!formValues.address.trim()) {
        errors.address = "Address is required";
      }
      if (!formValues.city.trim()) {
        errors.city = "City is required";
      }
      if (!formValues.zipcode.trim()) {
        errors.zipcode = "ZIP code is required";
      }
    }

    if (payment === "card") {
      if (!formValues.cardNumber.trim()) {
        errors.cardNumber = "Card number is required";
      } else if (
        !/^\d{13,19}$/.test(formValues.cardNumber.replace(/\s/g, ""))
      ) {
        errors.cardNumber = "Card number must be 13-19 digits";
      }
      if (!formValues.cardExpiry.trim()) {
        errors.cardExpiry = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formValues.cardExpiry)) {
        errors.cardExpiry = "Expiry date must be in MM/YY format";
      } else {
        const [month] = formValues.cardExpiry.split("/");
        const monthNum = parseInt(month, 10);
        if (monthNum < 1 || monthNum > 12) {
          errors.cardExpiry = "Month must be between 01 and 12";
        }
      }
      if (!formValues.cardCvc.trim()) {
        errors.cardCvc = "CVC is required";
      } else if (!/^\d{3,4}$/.test(formValues.cardCvc)) {
        errors.cardCvc = "CVC must be 3 or 4 digits";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setFormErrors((prev) => ({
        ...prev,
        form: "Please login to place your order.",
      }));
      return;
    }

    try {
      const response = (await dispatch(
        createOrderThunk({
          contact: {
            fullName: formValues.fullName.trim(),
            email: formValues.email.trim(),
            phone: formValues.phone.trim(),
          },
          fulfillment,
          deliveryAddress:
            fulfillment === "delivery"
              ? {
                  address: formValues.address.trim(),
                  city: formValues.city.trim(),
                  zipCode: formValues.zipcode.trim(),
                }
              : undefined,
          paymentMethod: payment,
        }),
      ).unwrap()) as CreateOrderResponse;

      setPlacedOrderSummary({
        total: response.order?.total ?? total,
        fulfillment: response.order?.fulfillment ?? fulfillment,
      });
      dispatch(clearCartItems());
      setOrderPlaced(true);
    } catch {
      setFormErrors((prev) => ({
        ...prev,
        form: "Unable to place your order. Please try again.",
      }));
    }
  };

  const handleSubmitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();   
  };

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (orderPlaced) {
    const confirmedTotal = placedOrderSummary?.total ?? total;
    const confirmedFulfillment = placedOrderSummary?.fulfillment ?? fulfillment;

    return (
      <main className="min-h-screen bg-[#fbfbfd] px-4 pb-12 pt-28 text-[#111111] sm:px-6 lg:px-10">
        <section className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#effaf3] text-[#16813a]">
            <BadgeCheck size={34} strokeWidth={2.4} />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Order confirmed
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
            Thank you, your order is confirmed. We have sent a confirmation
            email with your summary. The Reserve kitchen is now crafting your
            meal, and we will update you as it progresses.
          </p>
          <div className="mt-8 grid gap-3 rounded-lg border border-gray-200 bg-[#fbfbfd] p-5 text-left sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Order total</p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(confirmedTotal)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Method</p>
              <p className="mt-1 text-lg font-bold capitalize">
                {confirmedFulfillment}
              </p>
            </div>
            <div>
              {confirmedFulfillment === "delivery" ? (
                <>
                  <p className="text-sm font-medium text-gray-500">ETA</p>
                  <p className="mt-1 text-lg font-bold">35-45 min</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-500">Ready in</p>
                  <p className="mt-1 text-lg font-bold">20-25 min</p>
                </>
              )}
            </div>
          </div>
          <BackButton
            to="/buy-online"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#633df1] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc] border-transparent"
          >
            <ShoppingBag size={19} strokeWidth={2.4} />
            Back to menu
          </BackButton>
          <UserReview
            reviewRating={reviewRating}
            onRatingChange={setReviewRating}
            reviewText={reviewText}
            onReviewTextChange={setReviewText}
            onSubmit={handleSubmitReview}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd] px-4 pb-12 pt-24 text-[#111111] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <BackButton to="/buy-online">
          <ArrowLeft size={18} strokeWidth={2.4} />
          Back to menu
        </BackButton>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#633df1]">
                    Final checkout
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    Complete your order
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
                    Confirm your dining details, choose payment, and place your
                    order with The Reserve.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-md border border-[#c9f0d4] bg-[#f2fbf5] px-4 py-3 text-sm font-semibold text-[#16813a]">
                  <ShieldCheck size={18} strokeWidth={2.4} />
                  Secure checkout
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={`rounded-lg border p-5 text-left transition-colors ${
                    fulfillment === "delivery"
                      ? "border-[#633df1] bg-[#f5f2ff]"
                      : "border-gray-200 bg-white hover:border-[#825cff]"
                  }`}
                >
                  <Truck
                    className="text-[#633df1]"
                    size={24}
                    strokeWidth={2.3}
                  />
                  <span className="mt-4 block text-lg font-bold">Delivery</span>
                  <span className="mt-1 block text-sm leading-6 text-gray-600">
                    Arrives in 35-45 minutes with careful packaging.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={`rounded-lg border p-5 text-left transition-colors ${
                    fulfillment === "pickup"
                      ? "border-[#633df1] bg-[#f5f2ff]"
                      : "border-gray-200 bg-white hover:border-[#825cff]"
                  }`}
                >
                  <ShoppingBag
                    className="text-[#633df1]"
                    size={24}
                    strokeWidth={2.3}
                  />
                  <span className="mt-4 block text-lg font-bold">Pickup</span>
                  <span className="mt-1 block text-sm leading-6 text-gray-600">
                    Ready at the counter in 20-25 minutes.
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-[#f5f2ff] text-[#633df1]">
                    <UserRound size={20} strokeWidth={2.4} />
                  </div>
                  <h2 className="text-xl font-bold">Contact details</h2>
                </div>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold">Full name</span>
                    <input
                      value={formValues.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`mt-2 h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                        formErrors.fullName
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Your name"
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.fullName}
                      </p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold">Email</span>
                    <input
                      value={formValues.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      type="email"
                      className={`mt-2 h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                        formErrors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="you@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold">Phone</span>
                    <input
                      type="tel"
                      value={formValues.phone}
                      onChange={(e) => {
                        const phoneValue = e.target.value.replace(/\D/g, "");
                        handleInputChange("phone", phoneValue);
                      }}
                      className={`mt-2 h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                        formErrors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="+1 555 012 3456"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </label>
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-[#f5f2ff] text-[#633df1]">
                    <MapPin size={20} strokeWidth={2.4} />
                  </div>
                  <h2 className="text-xl font-bold">
                    {fulfillment === "delivery" ? "Delivery address" : "Pickup"}
                  </h2>
                </div>
                {fulfillment === "delivery" ? (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-semibold">Address</span>
                      <input
                        value={formValues.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className={`mt-2 h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                          formErrors.address
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Street address"
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.address}
                        </p>
                      )}
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-semibold">City</span>
                        <input
                          value={formValues.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          className={`mt-2 h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                            formErrors.city
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200"
                          }`}
                          placeholder="City"
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.city}
                          </p>
                        )}
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold">ZIP code</span>
                        <input
                          value={formValues.zipcode}
                          onChange={(e) =>
                            handleInputChange("zipcode", e.target.value)
                          }
                          className={`mt-2 h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                            formErrors.zipcode
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200"
                          }`}
                          placeholder="ZIP"
                        />
                        {formErrors.zipcode && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.zipcode}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-[#fbfbfd] p-5">
                    <p className="text-base font-bold">The Reserve Counter</p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      24 Grand Avenue, Downtown. Bring your confirmation name
                      when you arrive.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#633df1]">
                      <Clock size={17} strokeWidth={2.4} />
                      Ready in 20-25 minutes
                    </div>
                  </div>
                )}
              </section>
            </div>

            <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-[#f5f2ff] text-[#633df1]">
                  <CreditCard size={20} strokeWidth={2.4} />
                </div>
                <h2 className="text-xl font-bold">Payment method</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPayment("card")}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    payment === "card"
                      ? "border-[#633df1] bg-[#f5f2ff]"
                      : "border-gray-200 bg-white hover:border-[#825cff]"
                  }`}
                >
                  <span className="font-bold">Credit or debit card</span>
                  <span className="mt-1 block text-sm text-gray-600">
                    Pay securely before the kitchen starts.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayment("counter")}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    payment === "counter"
                      ? "border-[#633df1] bg-[#f5f2ff]"
                      : "border-gray-200 bg-white hover:border-[#825cff]"
                  }`}
                >
                  <span className="font-bold">Pay at counter</span>
                  <span className="mt-1 block text-sm text-gray-600">
                    Confirm now and pay when you receive the order.
                  </span>
                </button>
              </div>
              {payment === "card" && (
                <div className="mt-5 space-y-4">
                  <div>
                    <input
                      value={formValues.cardNumber}
                      onChange={(e) => {
                        const cardValue = e.target.value.replace(/\D/g, "");
                        handleInputChange("cardNumber", cardValue);
                      }}
                      className={`h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                        formErrors.cardNumber
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Card number"
                      inputMode="numeric"
                      maxLength={19}
                    />
                    {formErrors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-[150px_130px]">
                    <div>
                      <input
                        value={formValues.cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          handleInputChange("cardExpiry", value);
                        }}
                        className={`h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                          formErrors.cardExpiry
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        maxLength={5}
                      />
                      {formErrors.cardExpiry && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.cardExpiry}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        value={formValues.cardCvc}
                        onChange={(e) => {
                          const cvcValue = e.target.value.replace(/\D/g, "");
                          handleInputChange("cardCvc", cvcValue);
                        }}
                        className={`h-12 w-full rounded-md border px-4 text-base outline-none transition-colors focus:border-[#633df1] ${
                          formErrors.cardCvc
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="CVC"
                        inputMode="numeric"
                        maxLength={4}
                      />
                      {formErrors.cardCvc && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.cardCvc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </section>
          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-[#f5f2ff] text-[#633df1]">
                <ReceiptText size={20} strokeWidth={2.4} />
              </div>
              <h2 className="text-xl font-bold">Order summary</h2>
            </div>

            {error && (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {(orderError || formErrors.form) && (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {orderError || formErrors.form}
              </div>
            )}

            <div className="mt-6 space-y-5">
              {loading && cartItems.length === 0 ? (
                <p className="text-base text-gray-500">Loading your cart...</p>
              ) : cartItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                  <ShoppingBag
                    className="mx-auto text-gray-400"
                    size={34}
                    strokeWidth={2.2}
                  />
                  <p className="mt-3 text-base font-semibold">
                    Your basket is empty
                  </p>
                  <Link
                    to="/buy-online"
                    className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-[#633df1] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5330dc]"
                  >
                    Add dishes
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-[64px_1fr] gap-4"
                  >
                    <img
                      src={item.food.image}
                      alt={item.food.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="truncate text-base font-semibold">
                          {item.food.title}
                        </h3>
                        <span className="shrink-0 text-sm font-bold">
                          {formatCurrency(item.food.price * item.quantity)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-500">
                          {formatCurrency(item.food.price)} each
                        </span>
                        <div className="flex h-9 items-center rounded-md border border-gray-200 bg-white px-2">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.food.title}`}
                            onClick={() =>
                              updateQuantity(item.food._id, item.quantity, -1)
                            }
                            className="grid h-7 w-7 place-items-center text-[#111111]"
                          >
                            <Minus size={15} strokeWidth={2.8} />
                          </button>

                          {isItemUpdating(item.food._id) ? (
                            <span
                              className="mx-auto inline-flex h-5 w-7 items-center justify-center"
                              aria-label="Updating quantity"
                            >
                              <span className="block h-3 w-3 rounded-full border-2 border-gray-200 border-t-[#633df1] border-r-[#633df1] animate-spin" />
                            </span>
                          ) : (
                            <span className="w-7 text-center text-sm font-bold">
                              {item.quantity}
                            </span>
                          )}
                          <button
                            type="button"
                            aria-label={`Increase ${item.food.title}`}
                            onClick={() =>
                              updateQuantity(item.food._id, item.quantity, 1)
                            }
                            className="grid h-7 w-7 place-items-center text-[#111111]"
                          >
                            <Plus size={15} strokeWidth={2.8} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-7 border-t border-gray-200 pt-5">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-semibold">
                    {formatCurrency(serviceFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5 text-2xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0 || orderLoading}
              onClick={handlePlaceOrder}
              className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-md bg-[#633df1] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {orderLoading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white/40 border-r-white border-t-white animate-spin" />
              ) : (
                <BadgeCheck size={20} strokeWidth={2.4} />
              )}
              {orderLoading ? "Placing order..." : "Place final order"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
