import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  ArrowRight,
  ChevronUp,
  Minus,
  Plus,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getFoodItemsThunk } from "../features/food/foodThunk";
import {
  getCartItemsThunk,
  removeCartItemThunk,
  updateCartItemQuantityThunk,
} from "../features/cart/cartThunk";
import type { FoodItem } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alert from "../components/common/Alert";
import { formatCurrency } from "../utils/formatCurrency";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
};

const cuisineOptions = [
  "Appetizers",
  "Salads",
  "Mains",
  "Desserts",
  "Beverages",
];
const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"];
const spiceOptions = ["Mild", "Medium", "Hot"];
const ITEMS_PER_PAGE = 9;

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className="border-t border-gray-200 py-5 first:border-t-0 first:pt-0">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-base font-semibold text-[#111111]">{title}</h3>
      <ChevronUp size={17} strokeWidth={2.5} className="text-[#111111]" />
    </div>
    {children}
  </div>
);

const BuyOnlinePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cartSyncTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );
  const {
    items: menuItems,
    loading: foodLoading,
    loaded: foodLoaded,
    error: foodError,
  } = useAppSelector((state) => state.food);
  const {
    items: cartItems,
    loading: cartLoading,
    error: cartError,
  } = useAppSelector((state) => state.cart);
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [updatingItemCounts, setUpdatingItemCounts] = useState<
    Record<string, number>
  >({});
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [alertLogin, setAlertLogin] = useState(false);

  useEffect(() => {
    dispatch(getFoodItemsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(getCartItemsThunk());
    }
  }, [dispatch, token]);

  const menuMaxPrice = useMemo(() => {
    if (menuItems.length === 0) return 100;
    return Math.max(...menuItems.map((item) => item.price), 100);
  }, [menuItems]);
  const activeMaxPrice = maxPrice ?? menuMaxPrice;

  useEffect(() => {
    const timers = cartSyncTimers.current;

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesPrice =
        item.price >= minPrice && item.price <= activeMaxPrice;
      const matchesCuisine =
        selectedCuisines.length === 0 ||
        selectedCuisines.includes(item.category);
      const matchesDietary =
        selectedDietary.length === 0 ||
        selectedDietary.every((diet) => item.dietary.includes(diet));
      const matchesSpice =
        selectedSpice.length === 0 || selectedSpice.includes(item.spice);

      return matchesPrice && matchesCuisine && matchesDietary && matchesSpice;
    });
  }, [
    menuItems,
    minPrice,
    activeMaxPrice,
    selectedCuisines,
    selectedDietary,
    selectedSpice,
  ]);

  const requestedPage = Number(searchParams.get("page") ?? 1);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMenu.length / ITEMS_PER_PAGE),
  );
  const currentPage = Math.min(
    Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1),
    totalPages,
  );
  const paginatedMenu = filteredMenu.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const updatePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    const nextParams = new URLSearchParams(searchParams);

    if (nextPage === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(nextPage));
    }

    setSearchParams(nextParams);
  };

  const resetPage = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

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

  const toggleFilter = (
    value: string,
    setState: Dispatch<SetStateAction<string[]>>,
    state: string[],
  ) => {
    resetPage();
    setState(
      state.includes(value)
        ? state.filter((item) => item !== value)
        : [...state, value],
    );
  };

  const addToCart = (item: FoodItem) => {
    if (!user) {
      setAlertLogin(true);
      return;
    }
    const currentQuantity =
      cartItems.find((cartItem) => cartItem.food._id === item._id)?.quantity ??
      0;
    const nextQuantity = currentQuantity + 1;

    startUpdatingItem(item._id);
    dispatch(
      updateCartItemQuantityThunk({ foodId: item._id, quantity: nextQuantity }),
    ).finally(() => stopUpdatingItem(item._id));
  };

  const updateQuantity = (foodId: string, quantity: number, delta: number) => {
    const nextQuantity = Math.max(1, quantity + delta);

    startUpdatingItem(foodId);
    dispatch(
      updateCartItemQuantityThunk({ foodId: foodId, quantity: nextQuantity }),
    ).finally(() => stopUpdatingItem(foodId));
  };

  const removeItem = (foodId: string) => {
    dispatch(removeCartItemThunk(foodId));
  };

  const minPricePercent = (minPrice / menuMaxPrice) * 100;
  const maxPricePercent = (activeMaxPrice / menuMaxPrice) * 100;

  const filterPanel = (
    <>
      <h1 className="mb-5 text-2xl font-bold tracking-tight">
        Filter Your Taste
      </h1>

      <FilterSection title="Price Range">
        <div className="relative h-8">
          <div className="absolute left-0 right-0 top-3 h-1 rounded-full bg-gray-200" />
          <div
            className="absolute top-3 h-1 rounded-full bg-[#7248ff]"
            style={{
              left: `${minPricePercent}%`,
              right: `${100 - maxPricePercent}%`,
            }}
          />
          <input
            aria-label="Minimum price"
            type="range"
            min={0}
            max={menuMaxPrice}
            value={minPrice}
            onChange={(event) => {
              const value = Math.min(
                Number(event.target.value),
                activeMaxPrice,
              );
              resetPage();
              setMinPrice(value);
            }}
            className="pointer-events-none absolute top-0 h-8 w-full appearance-none bg-transparent accent-[#7248ff] [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />
          <input
            aria-label="Maximum price"
            type="range"
            min={0}
            max={menuMaxPrice}
            value={activeMaxPrice}
            onChange={(event) => {
              const value = Math.max(Number(event.target.value), minPrice);
              resetPage();
              setMaxPrice(value);
            }}
            className="pointer-events-none absolute top-0 h-8 w-full appearance-none bg-transparent accent-[#7248ff] [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-base font-normal">
          <span>{formatCurrency(minPrice).replace(".00", "")}</span>
          <span>{formatCurrency(activeMaxPrice).replace(".00", "")}</span>
        </div>
      </FilterSection>

      <FilterSection title="Cuisine Type">
        <div className="space-y-2">
          {cuisineOptions.map((cuisine) => (
            <label
              key={cuisine}
              className="flex cursor-pointer items-center gap-2 text-base font-normal text-[#171717]"
            >
              <input
                type="checkbox"
                checked={selectedCuisines.includes(cuisine)}
                onChange={() =>
                  toggleFilter(cuisine, setSelectedCuisines, selectedCuisines)
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#7248ff]"
              />
              {cuisine}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Dietary">
        <div className="space-y-2">
          {dietaryOptions.map((diet) => (
            <label
              key={diet}
              className="flex cursor-pointer items-center gap-2 text-base font-normal text-[#171717]"
            >
              <input
                type="checkbox"
                checked={selectedDietary.includes(diet)}
                onChange={() =>
                  toggleFilter(diet, setSelectedDietary, selectedDietary)
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#7248ff]"
              />
              {diet}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Spice Level">
        <div className="space-y-2">
          {spiceOptions.map((spice) => (
            <label
              key={spice}
              className="flex cursor-pointer items-center gap-2 text-base font-normal text-[#171717]"
            >
              <input
                type="checkbox"
                checked={selectedSpice.includes(spice)}
                onChange={() =>
                  toggleFilter(spice, setSelectedSpice, selectedSpice)
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#7248ff]"
              />
              {spice}
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <main className="min-h-screen bg-[#fbfbfd] px-4 pb-7 pt-24 text-[#080808] sm:px-6 lg:px-10">
      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-60 bg-black/30 transition-opacity xl:hidden ${
          isFilterOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

      <aside
        className={`fixed bottom-0 left-0 top-16 z-60 w-full max-w-sm overflow-y-auto border-r border-gray-200 bg-white p-6 shadow-2xl transition-transform duration-300 xl:hidden ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="sr-only">Filter drawer</span>
          <button
            type="button"
            onClick={() => setIsFilterOpen(false)}
            aria-label="Close filters"
            className="ml-auto grid h-10 w-10 place-items-center rounded-md border border-gray-200 text-[#111111] transition-colors hover:border-[#825cff]"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>
        {filterPanel}
      </aside>

      <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-8 xl:grid-cols-[350px_minmax(0,1fr)_395px]">
        <aside className="hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:sticky xl:top-24 xl:block xl:h-fit">
          {filterPanel}
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Our Online Menu
            </h2>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Open filters"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-gray-200 bg-white text-[#633df1] shadow-sm transition-colors hover:border-[#825cff] xl:hidden"
            >
              <SlidersHorizontal size={21} strokeWidth={2.4} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {paginatedMenu.map((item) => (
              <article
                key={item._id}
                onClick={() => navigate(`/buy-online/${item._id}`)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-[#825cff] flex h-full flex-col"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-36 w-full rounded-md object-cover sm:h-40"
                />
                <div className="mt-4 flex flex-1 flex-col px-1">
                  <h3 className="text-base font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 min-h-[48px] text-sm font-normal leading-6 text-[#111111]">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="text-base font-semibold">
                      {formatCurrency(item.price)}
                    </span>
                    <button
                      type="button"
                      disabled={isItemUpdating(item._id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="inline-flex h-10 min-w-[142px] items-center justify-center gap-2 rounded-md bg-[#633df1] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc]"
                    >
                      {isItemUpdating(item._id) ? (
                        "Adding..."
                      ) : (
                        <>
                          Add to Cart
                          <ShoppingCart size={16} strokeWidth={2.4} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {foodLoading && (
              <div className="col-span-full rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
                Loading menu items...
              </div>
            )}

            {foodError && (
              <div className="col-span-full rounded-lg border border-red-200 bg-white p-8 text-center text-red-600">
                {foodError}
              </div>
            )}

            {foodLoaded &&
              !foodLoading &&
              !foodError &&
              filteredMenu.length === 0 && (
                <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                  No dishes match your current filters.
                </div>
              )}
          </div>

          {filteredMenu.length > ITEMS_PER_PAGE && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => updatePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111111] transition-colors hover:border-[#825cff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => updatePage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`grid h-10 w-10 place-items-center rounded-md border text-sm font-semibold transition-colors ${
                      page === currentPage
                        ? "border-[#633df1] bg-[#633df1] text-white"
                        : "border-gray-200 bg-white text-[#111111] hover:border-[#825cff]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => updatePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111111] transition-colors hover:border-[#825cff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>

        <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:sticky xl:top-24 xl:h-fit">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Your Basket ({cartItems.length})
          </h2>

          {cartError && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {cartError}
            </div>
          )}

          <div className="space-y-7">
            {cartLoading && cartItems.length === 0 ? (
              <p className="text-base font-normal text-gray-500">
                Loading cart items...
              </p>
            ) : cartItems.length === 0 ? (
              <p className="text-base font-normal text-gray-500">
                Your basket is empty.
              </p>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="grid grid-cols-[64px_1fr] gap-4">
                  <img
                    src={item.food.image}
                    alt={item.food.title}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">
                      {item.food.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-base font-normal">
                        {formatCurrency(item.food.price)}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 items-center rounded-md border border-[#825cff] bg-white px-3">
                          <button
                            type="button"
                            disabled={isItemUpdating(item.food._id)}
                            aria-label={`Decrease ${item.food.title}`}
                            onClick={() =>
                              updateQuantity(item.food._id, item.quantity, -1)
                            }
                            className="grid h-7 w-7 place-items-center text-[#111111]"
                          >
                            <Minus size={16} strokeWidth={2.8} />
                          </button>

                          <span className="w-7 text-center text-base font-semibold">
                            {isItemUpdating(item.food._id) ? (
                              <span
                                className="mx-auto inline-flex h-5 w-5 items-center justify-center"
                                aria-label="Updating quantity"
                              >
                                <span className="block h-3 w-3 rounded-full border-2 border-gray-200 border-t-[#633df1] border-r-[#633df1] animate-spin" />
                              </span>
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <button
                            type="button"
                            disabled={isItemUpdating(item.food._id)}
                            aria-label={`Increase ${item.food.title}`}
                            onClick={() =>
                              updateQuantity(item.food._id, item.quantity, 1)
                            }
                            className="grid h-7 w-7 place-items-center text-[#111111]"
                          >
                            <Plus size={16} strokeWidth={2.8} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.food._id)}
                          aria-label={`Remove ${item.food.title}`}
                          className="grid h-10 w-10 place-items-center rounded-md border border-gray-200 text-[#111111] transition-colors hover:border-[#825cff]"
                        >
                          <Trash2 size={18} strokeWidth={2.3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <div className="space-y-4 border-b border-gray-200 pb-6 text-base font-normal">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-2xl font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => navigate("/checkout")}
            className="mt-9 flex h-14 w-full items-center justify-center gap-4 rounded-md bg-[#633df1] px-6 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Proceed to Checkout
            <ArrowRight size={21} strokeWidth={2.5} />
          </button>
        </aside>
        <Alert
          isOpen={alertLogin}
          message="Please login to Add to Cart"
          onClose={() => {
            setAlertLogin(false);
          }}
        />
      </div>
    </main>
  );
};

export default BuyOnlinePage;
