import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { updateCartItemQuantityThunk } from "../features/cart/cartThunk";
import { useFoodDetails } from "../hooks/useFoodDetails";
import type { FoodItem } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import BackButton from "../components/common/BackButton";
import FoodDetailsPanel from "../components/food/FoodDetailsPanel";
import FoodInfoCard from "../components/common/FoodInfoCard";
import Alert from "../components/common/Alert";

const FoodDetailPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [alertLogin, setAlertLogin] = useState(false);
  const { item, currentQuantity, foodLoading, foodError, cartLoading } =
    useFoodDetails();

  const addToCart = (selectedItem: FoodItem) => {
    if (!user) {
      setAlertLogin(true);
      return;
    }
    const nextQuantity = currentQuantity ? currentQuantity + 1 : 1;
    dispatch(
      updateCartItemQuantityThunk({
        foodId: selectedItem._id,
        quantity: nextQuantity,
      }),
    );
  };

  if (foodLoading && !item) {
    return (
      <main className="min-h-screen bg-[#fbfbfd] px-4 pb-12 pt-24 text-[#111111] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-600">
            Loading food details...
          </p>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#fbfbfd] px-4 pb-12 pt-24 text-[#111111] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-600">
            {foodError || "Dish not found."}
          </p>
          <BackButton
            to="/buy-online"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-[#633df1] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc] border-transparent"
          >
            Back to menu
          </BackButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd] px-4 pb-12 pt-24 text-[#111111] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <BackButton to="/buy-online">
          <ArrowLeft size={18} strokeWidth={2.4} />
          Back to menu
        </BackButton>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <img
              src={item.image}
              alt={item.title}
              className="h-[420px] w-full rounded-t-xl object-cover"
            />
            <div className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#633df1]">
                    {item.category}
                  </p>
                  <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    {item.title}
                  </h1>
                </div>
                <p className="text-3xl font-bold text-[#633df1]">
                  {formatCurrency(item.price)}
                </p>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600">
                {item.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <FoodInfoCard title="Spice level">
                  <p className="text-lg font-bold">{item.spice}</p>
                </FoodInfoCard>
                <FoodInfoCard title="Dietary">
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#111111]">
                    {item.dietary.length > 0 ? (
                      item.dietary.map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1"
                        >
                          {label}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </FoodInfoCard>
                <FoodInfoCard title="Chef's note">
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    A Reserve favorite made fresh to order with premium
                    ingredients and care.
                  </p>{" "}
                </FoodInfoCard>
              </div>
            </div>
          </section>

          <FoodDetailsPanel
            item={item}
            currentQuantity={currentQuantity ?? 0}
            cartLoading={cartLoading}
            addToCart={addToCart}
          />
        </div>
      </div>
      <Alert
        isOpen={alertLogin}
        message="Please login to Add to Cart"
        onClose={() => {
          setAlertLogin(false);
        }}
      />
    </main>
  );
};

export default FoodDetailPage;
