import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Truck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getFoodItemsThunk } from "../features/food/foodThunk";
import { updateCartItemQuantityThunk } from "../features/cart/cartThunk";
import type { FoodItem } from "../types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const FoodDetailPage = () => {
  const { foodId } = useParams<{ foodId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    items: menuItems,
    loading: foodLoading,
    error: foodError,
  } = useAppSelector((state) => state.food);
  const { items: cartItems, loading: cartLoading } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    if (menuItems.length === 0) {
      dispatch(getFoodItemsThunk());
    }
  }, [dispatch, menuItems.length]);

  const item = useMemo(
    () => menuItems.find((foodItem) => foodItem._id === foodId),
    [menuItems, foodId],
  );

  const currentQuantity =
    item &&
    (cartItems.find((cartItem) => cartItem.food._id === item._id)?.quantity ??
      0);

  const addToCart = (selectedItem: FoodItem) => {
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
          <button
            type="button"
            onClick={() => navigate("/buy-online")}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-[#633df1] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc]"
          >
            Back to menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd] px-4 pb-12 pt-24 text-[#111111] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <button
          type="button"
          onClick={() => navigate("/buy-online")}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111111] shadow-sm transition-colors hover:border-[#825cff]"
        >
          <ArrowLeft size={18} strokeWidth={2.4} />
          Back to menu
        </button>

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
                <div className="rounded-2xl border border-gray-200 bg-[#f8f7ff] p-5">
                  <p className="text-sm font-semibold text-gray-500">
                    Spice level
                  </p>
                  <p className="mt-3 text-lg font-bold">{item.spice}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-[#f8f7ff] p-5">
                  <p className="text-sm font-semibold text-gray-500">Dietary</p>
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
                </div>
                <div className="rounded-2xl border border-gray-200 bg-[#f8f7ff] p-5">
                  <p className="text-sm font-semibold text-gray-500">
                    Chef's note
                  </p>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    A Reserve favorite made fresh to order with premium
                    ingredients and care.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#dbeafe] bg-[#eff6ff] p-5">
              <Truck size={20} strokeWidth={2.4} className="text-[#2563eb]" />
              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  Ready for pickup or delivery
                </p>
                <p className="text-sm text-gray-600">
                  Choose your order preference once you checkout.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="font-medium">Category</span>
                <span className="text-gray-800">{item.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Spice</span>
                <span className="text-gray-800">{item.spice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Dietary</span>
                <span className="text-gray-800">
                  {item.dietary.join(" • ") || "None"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => addToCart(item)}
              className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#633df1] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc]"
            >
              {cartLoading ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart size={20} strokeWidth={2.4} />
                  {(currentQuantity ?? 0) > 0 ? "Add another" : "Add to Cart"}
                </>
              )}
            </button>

            {(currentQuantity ?? 0) > 0 && (
              <p className="mt-3 text-center text-sm text-gray-500">
                Already in cart:{" "}
                <span className="font-semibold text-[#111111]">
                  {currentQuantity}
                </span>
              </p>
            )}

            <div className="mt-10 rounded-2xl border border-gray-200 bg-[#f8f7ff] p-5 text-sm text-gray-600">
              <div className="mb-3 flex items-center gap-2 text-[#111111]">
                <Star size={18} strokeWidth={2.4} />
                <span className="font-semibold">Why choose this dish?</span>
              </div>
              <p>
                A carefully crafted recipe with fresh ingredients, bold flavors,
                and balanced presentation — perfect for sharing or enjoying
                solo.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default FoodDetailPage;
