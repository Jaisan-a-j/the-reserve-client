import {
  useEffect,
  useMemo,
  useRef,
  useState,
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
import {
  getCartItemsThunk,
  removeCartItemThunk,
  updateCartItemQuantityThunk,
} from "../features/cart/cartThunk";
import type { FoodItem } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alert from "../components/common/Alert";
import { formatCurrency } from "../utils/formatCurrency";
import {
  useBestSellers,
  useChefSpecials,
  useNewArrivals,
  useTrending,
} from "../hooks/useFoodCategories";
import { useFoodItems, useFoodPriceRange } from "../hooks/useFoodItems";

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
const menuCategories = ["All", "Best Sellers🔥", "Chef's Specials", "New Arrivals", "Trending"];
const BEST_SELLERS_CATEGORY = "Best Sellers🔥";
const CHEFS_SPECIALS_CATEGORY = "Chef's Specials";
const NEW_ARRIVALS_CATEGORY = "New Arrivals";
const TRENDING_CATEGORY = "Trending";
const ITEMS_PER_PAGE = 9;

type MenuFilters = {
  minPrice: number;
  maxPrice: number;
  cuisines: string[];
  dietary: string[];
  spice: string[];
};

const createDefaultFilters = (maxPrice: number): MenuFilters => ({
  minPrice: 0,
  maxPrice,
  cuisines: [],
  dietary: [],
  spice: [],
});

const categoryLoadingMessages: Record<string, string> = {
  [BEST_SELLERS_CATEGORY]: "Loading best sellers...",
  [CHEFS_SPECIALS_CATEGORY]: "Loading chef's specials...",
  [NEW_ARRIVALS_CATEGORY]: "Loading new arrivals...",
  [TRENDING_CATEGORY]: "Loading trending items...",
};

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
    items: cartItems,
    loading: cartLoading,
    error: cartError,
  } = useAppSelector((state) => state.cart);
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [updatingItemCounts, setUpdatingItemCounts] = useState<
    Record<string, number>
  >({});
  const [deletingItemIds, setDeletingItemIds] = useState<
    Record<string, boolean>
  >({});
  const [appliedFilters, setAppliedFilters] = useState<MenuFilters>(() =>
    createDefaultFilters(100),
  );
  const [draftFilters, setDraftFilters] = useState<MenuFilters>(() =>
    createDefaultFilters(100),
  );

  
  const [draftMinPriceInput, setDraftMinPriceInput] = useState("0");
  const [draftMaxPriceInput, setDraftMaxPriceInput] = useState("100");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [alertLogin, setAlertLogin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const isAllCategory = selectedCategory === "All";
  const isBestSellersCategory = selectedCategory === BEST_SELLERS_CATEGORY;
  const isChefsSpecialsCategory = selectedCategory === CHEFS_SPECIALS_CATEGORY;
  const isNewArrivalsCategory = selectedCategory === NEW_ARRIVALS_CATEGORY;
  const isTrendingCategory = selectedCategory === TRENDING_CATEGORY;
  const isCategoryQuery =
    isBestSellersCategory ||
    isChefsSpecialsCategory ||
    isNewArrivalsCategory ||
    isTrendingCategory;
  const {
    data: bestSellers = [],
    isLoading: bestSellersLoading,
    isError: bestSellersError,
    error: bestSellersErrorDetails,
  } = useBestSellers(isBestSellersCategory);
  const {
    data: chefSpecials = [],
    isLoading: chefSpecialsLoading,
    isError: chefSpecialsError,
    error: chefSpecialsErrorDetails,
  } = useChefSpecials(isChefsSpecialsCategory);
  const {
    data: newArrivals = [],
    isLoading: newArrivalsLoading,
    isError: newArrivalsError,
    error: newArrivalsErrorDetails,
  } = useNewArrivals(isNewArrivalsCategory);
  const {
    data: trending = [],
    isLoading: trendingLoading,
    isError: trendingError,
    error: trendingErrorDetails,
  } = useTrending(isTrendingCategory);

  const { data: priceRangeData } = useFoodPriceRange();
  const menuMaxPrice = priceRangeData?.maxPrice ?? 100;

  const hasInitializedPriceRange = useRef(false);

  useEffect(() => {
    if (!priceRangeData || hasInitializedPriceRange.current) return;

    hasInitializedPriceRange.current = true;
    const defaultFilters = createDefaultFilters(priceRangeData.maxPrice);
    setAppliedFilters(defaultFilters);
    setDraftFilters(defaultFilters);
    setDraftMinPriceInput(String(defaultFilters.minPrice));
    setDraftMaxPriceInput(String(defaultFilters.maxPrice));
  }, [priceRangeData]);

  const foodFilters = useMemo(
    () => ({
      minPrice: appliedFilters.minPrice,
      maxPrice: appliedFilters.maxPrice,
      cuisines: appliedFilters.cuisines,
      dietary: appliedFilters.dietary,
      spice: appliedFilters.spice,
    }),
    [appliedFilters],
  );

  const requestedPage = Number(searchParams.get("page") ?? 1);
  const currentPage = Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1);

  const {
    data: foodItemsData,
    isLoading: foodItemsLoading,
    isError: foodItemsError,
    error: foodItemsErrorDetails,
  } = useFoodItems(currentPage, foodFilters, isAllCategory, ITEMS_PER_PAGE);

  useEffect(() => {
    if (token) {
      dispatch(getCartItemsThunk());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const timers = cartSyncTimers.current;

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const categoryMenuItems = useMemo(() => {
    if (isAllCategory) return [];
    if (isBestSellersCategory) return bestSellers;
    if (isChefsSpecialsCategory) return chefSpecials;
    if (isNewArrivalsCategory) return newArrivals;
    if (isTrendingCategory) return trending;
    return [];
  }, [
    isAllCategory,
    isBestSellersCategory,
    bestSellers,
    isChefsSpecialsCategory,
    chefSpecials,
    isNewArrivalsCategory,
    newArrivals,
    isTrendingCategory,
    trending,
  ]);

  const filteredCategoryMenu = useMemo(() => {
    return categoryMenuItems.filter((item) => {
      const matchesPrice =
        item.price >= appliedFilters.minPrice &&
        item.price <= appliedFilters.maxPrice;
      const matchesCuisine =
        appliedFilters.cuisines.length === 0 ||
        appliedFilters.cuisines.includes(item.category);
      const matchesDietary =
        appliedFilters.dietary.length === 0 ||
        appliedFilters.dietary.every((diet) => item.dietary.includes(diet));
      const matchesSpice =
        appliedFilters.spice.length === 0 ||
        appliedFilters.spice.includes(item.spice);

      return matchesPrice && matchesCuisine && matchesDietary && matchesSpice;
    });
  }, [categoryMenuItems, appliedFilters]);

  const totalPages = isAllCategory
    ? (foodItemsData?.pagination.totalPages ?? 1)
    : Math.max(1, Math.ceil(filteredCategoryMenu.length / ITEMS_PER_PAGE));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMenu = isAllCategory
    ? (foodItemsData?.data ?? [])
    : filteredCategoryMenu.slice(
        (safeCurrentPage - 1) * ITEMS_PER_PAGE,
        safeCurrentPage * ITEMS_PER_PAGE,
      );

  const isMenuLoading = isAllCategory
    ? foodItemsLoading
    : isBestSellersCategory
      ? bestSellersLoading
      : isChefsSpecialsCategory
        ? chefSpecialsLoading
        : isNewArrivalsCategory
          ? newArrivalsLoading
          : isTrendingCategory
            ? trendingLoading
            : false;

  const menuError = isAllCategory
    ? foodItemsError
      ? (foodItemsErrorDetails?.message ?? "Unable to load menu items.")
      : null
    : isBestSellersCategory && bestSellersError
      ? (bestSellersErrorDetails?.message ?? "Unable to load best sellers.")
      : isChefsSpecialsCategory && chefSpecialsError
        ? (chefSpecialsErrorDetails?.message ??
          "Unable to load chef's specials.")
        : isNewArrivalsCategory && newArrivalsError
          ? (newArrivalsErrorDetails?.message ?? "Unable to load new arrivals.")
          : isTrendingCategory && trendingError
            ? (trendingErrorDetails?.message ?? "Unable to load trending items.")
            : null;

  const isMenuLoaded = isAllCategory
    ? !foodItemsLoading && !foodItemsError
    : isCategoryQuery
      ? !isMenuLoading && !menuError
      : true;

  const hasNoResults = isAllCategory
    ? (foodItemsData?.pagination.total ?? 0) === 0
    : filteredCategoryMenu.length === 0;

  const categoryLoadingMessage =
    selectedCategory === "All"
      ? "Loading menu items..."
      : (categoryLoadingMessages[selectedCategory] ?? "Loading menu items...");

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

  useEffect(() => {
    if (!isAllCategory || !foodItemsData) return;
    if (currentPage <= foodItemsData.pagination.totalPages) return;

    const nextParams = new URLSearchParams(searchParams);
    const nextPage = foodItemsData.pagination.totalPages;

    if (nextPage === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(nextPage));
    }

    setSearchParams(nextParams);
  }, [isAllCategory, foodItemsData, currentPage, searchParams, setSearchParams]);

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

  const isItemDeleting = (foodId: string) => deletingItemIds[foodId] ?? false;

  const startDeletingItem = (foodId: string) => {
    setDeletingItemIds((prev) => ({
      ...prev,
      [foodId]: true,
    }));
  };

  const stopDeletingItem = (foodId: string) => {
    setDeletingItemIds((prev) => {
      const next = { ...prev };
      delete next[foodId];
      return next;
    });
  };

  const normalizePriceFilters = (filters: MenuFilters): MenuFilters => {
    const minPrice = Math.max(0, Math.min(filters.minPrice, menuMaxPrice));
    const maxPrice = Math.max(minPrice, Math.min(filters.maxPrice, menuMaxPrice));

    return {
      ...filters,
      minPrice,
      maxPrice,
    };
  };

  const toggleDraftFilter = (
    value: string,
    key: "cuisines" | "dietary" | "spice",
  ) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const handleApplyFilters = () => {
    const parsedMinPrice =
      draftMinPriceInput.trim() === "" ? 0 : Number(draftMinPriceInput);
    const parsedMaxPrice =
      draftMaxPriceInput.trim() === "" ? menuMaxPrice : Number(draftMaxPriceInput);

    const normalizedFilters = normalizePriceFilters({
      ...draftFilters,
      minPrice: Number.isNaN(parsedMinPrice) ? 0 : parsedMinPrice,
      maxPrice: Number.isNaN(parsedMaxPrice) ? menuMaxPrice : parsedMaxPrice,
    });    

    setDraftFilters(normalizedFilters);
    setAppliedFilters(normalizedFilters);
    setDraftMinPriceInput(String(normalizedFilters.minPrice));
    setDraftMaxPriceInput(String(normalizedFilters.maxPrice));
    resetPage();
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = createDefaultFilters(menuMaxPrice);
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setDraftMinPriceInput(String(defaultFilters.minPrice));
    setDraftMaxPriceInput(String(defaultFilters.maxPrice));
    resetPage();
    setIsFilterOpen(false);
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
    startDeletingItem(foodId);
    dispatch(removeCartItemThunk(foodId)).finally(() =>
      stopDeletingItem(foodId),
    );
  };

  const filterContent = (
    <>
      <h1 className="mb-5 text-2xl font-bold tracking-tight xl:block">
        Filter Your Taste
      </h1>

      <FilterSection title="Price Range">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">
              Min Price ($)
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={draftMinPriceInput}
              onChange={(event) => setDraftMinPriceInput(event.target.value)}
              className="h-11 w-full rounded-md border border-gray-200 px-3 text-base text-[#111111] outline-none transition-colors focus:border-[#633df1] focus:ring-2 focus:ring-[#633df1]/20"
              aria-label="Minimum price"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">
              Max Price ($)
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={draftMaxPriceInput}
              onChange={(event) => setDraftMaxPriceInput(event.target.value)}
              className="h-11 w-full rounded-md border border-gray-200 px-3 text-base text-[#111111] outline-none transition-colors focus:border-[#633df1] focus:ring-2 focus:ring-[#633df1]/20"
              aria-label="Maximum price"
            />
          </label>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Available range: {formatCurrency(0).replace(".00", "")} –{" "}
          {formatCurrency(menuMaxPrice).replace(".00", "")}
        </p>
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
                checked={draftFilters.cuisines.includes(cuisine)}
                onChange={() => toggleDraftFilter(cuisine, "cuisines")}
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
                checked={draftFilters.dietary.includes(diet)}
                onChange={() => toggleDraftFilter(diet, "dietary")}
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
                checked={draftFilters.spice.includes(spice)}
                onChange={() => toggleDraftFilter(spice, "spice")}
                className="h-4 w-4 rounded border-gray-300 accent-[#7248ff]"
              />
              {spice}
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  );

  const filterActions = (
    <div className="flex w-full flex-col gap-4 xl:flex-row xl:gap-3">
      <button
        type="button"
        onClick={handleApplyFilters}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#633df1] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc] xl:h-11 xl:flex-1 xl:rounded-md xl:px-4 xl:text-sm"
      >
        Apply Filters
      </button>
      <button
        type="button"
        onClick={handleClearFilters}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-base font-semibold text-[#111111] transition-colors hover:border-[#825cff] xl:h-11 xl:flex-1 xl:rounded-md xl:px-4 xl:text-sm"
      >
        Clear Filters
      </button>
    </div>
  );

  const filterPanel = (
    <>
      {filterContent}
      <div className="mt-6 border-t border-gray-200 pt-5">{filterActions}</div>
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
        className={`fixed bottom-0 left-0 top-16 z-60 flex w-full max-w-sm flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 xl:hidden ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#111111]">Filters</h2>
          <button
            type="button"
            onClick={() => setIsFilterOpen(false)}
            aria-label="Close filters"
            className="grid h-10 w-10 place-items-center rounded-md border border-gray-200 text-[#111111] transition-colors hover:border-[#825cff]"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{filterContent}</div>
        <div className="border-t border-gray-200 bg-white px-4 py-5 pb-6">
          {filterActions}
        </div>
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

          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
            {menuCategories.map((category) => {
              const isActive = category === selectedCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    resetPage();
                    setSelectedCategory(category);
                  }}
                  className={`shrink-0 rounded-md border bg-white px-4 py-2 text-sm font-semibold transition-colors sm:px-5 sm:py-2.5 sm:text-base ${
                    isActive
                      ? "border-[#633df1] text-[#633df1]"
                      : "border-gray-200 text-[#111111]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {!isMenuLoading &&
              !menuError &&
              paginatedMenu.map((item) => (
              <article
                key={item._id}
                onClick={() => navigate(`/buy-online/${item._id}`)}
                className=" rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-[#825cff] flex h-full flex-col"
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
                      className="cursor-pointer inline-flex h-10 min-w-[142px] items-center justify-center gap-2 rounded-md bg-[#633df1] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc]"
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

            {isMenuLoading && (
              <div className="col-span-full rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
                {categoryLoadingMessage}
              </div>
            )}

            {menuError && (
              <div className="col-span-full rounded-lg border border-red-200 bg-white p-8 text-center text-red-600">
                {menuError}
              </div>
            )}

            {isMenuLoaded &&
              !isMenuLoading &&
              !menuError &&
              hasNoResults && (
                <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                  {selectedCategory === "All" || isCategoryQuery
                    ? "No dishes match your current filters."
                    : `No items available in ${selectedCategory} yet.`}
                </div>
              )}
          </div>

          {totalPages > 1 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => updatePage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
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
                    aria-current={page === safeCurrentPage ? "page" : undefined}
                    className={`grid h-10 w-10 place-items-center rounded-md border text-sm font-semibold transition-colors ${
                      page === safeCurrentPage
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
                onClick={() => updatePage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
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

          {user && cartError && (
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
                          disabled={
                            isItemUpdating(item.food._id) ||
                            isItemDeleting(item.food._id)
                          }
                          onClick={() => removeItem(item.food._id)}
                          aria-label={`Remove ${item.food.title}`}
                          className="grid h-10 w-10 place-items-center rounded-md border border-gray-200 text-[#111111] transition-colors hover:border-[#825cff] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isItemDeleting(item.food._id) ? (
                            <span
                              className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#633df1]"
                              aria-label="Removing item"
                            />
                          ) : (
                            <Trash2 size={18} strokeWidth={2.3} />
                          )}
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
