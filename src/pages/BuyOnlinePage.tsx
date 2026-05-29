import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
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
import beverages from "../assets/beverages.jpeg";
import signatureDishes from "../assets/signature-dishes.jpeg";
import smallBites from "../assets/small-bites.jpeg";

type MenuItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  dietary: string[];
  spice: string;
  image: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

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

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Artisanal Salmon Bowl",
    description: "Pan-seared salmon with quinoa, edamame, and microgreens.",
    price: 26,
    category: "Mains",
    dietary: ["Gluten-Free"],
    spice: "Mild",
    image: signatureDishes,
  },
  {
    id: 2,
    title: "Mediterranean Halloumi Salad",
    description: "Mediterranean nism with salad, halloumi and maseroom.",
    price: 26,
    category: "Salads",
    dietary: ["Vegetarian"],
    spice: "Mild",
    image: beverages,
  },
  {
    id: 3,
    title: "Truffle Ricotta Gnocchi",
    description: "Truffle Ricotta gnochhi with connon-ceson, and microgreens.",
    price: 26,
    category: "Mains",
    dietary: ["Vegetarian"],
    spice: "Medium",
    image: smallBites,
  },
  {
    id: 4,
    title: "Truffle Ricotta Bowl",
    description: "Pan-seared salmon with quinoa, edamame, and microgreens.",
    price: 26,
    category: "Mains",
    dietary: ["Vegetarian"],
    spice: "Medium",
    image: smallBites,
  },
  {
    id: 5,
    title: "Mediterranean Halloumi Salad",
    description: "Pan-seared salmon with quinoa, edamame, and microgreens.",
    price: 26,
    category: "Salads",
    dietary: ["Vegetarian"],
    spice: "Mild",
    image: beverages,
  },
  {
    id: 6,
    title: "Berry Bliss Smoothie",
    description: "Pan-seared salmon with quinoa, edamame, and microgreens.",
    price: 10,
    category: "Beverages",
    dietary: ["Vegan", "Gluten-Free"],
    spice: "Mild",
    image: signatureDishes,
  },
  {
    id: 7,
    title: "Golden Ricotta Gnocchi",
    description: "Pillowy gnocchi with ricotta, basil, and warm herb butter.",
    price: 26,
    category: "Mains",
    dietary: ["Vegetarian"],
    spice: "Medium",
    image: smallBites,
  },
  {
    id: 8,
    title: "Garden Harvest Bowl",
    description: "Roasted vegetables, grains, chickpeas, and lemon tahini.",
    price: 22,
    category: "Salads",
    dietary: ["Vegan"],
    spice: "Mild",
    image: signatureDishes,
  },
  {
    id: 9,
    title: "Berry Yogurt Smoothie",
    description: "Blended berries, yogurt, mint, and a touch of honey.",
    price: 10,
    category: "Beverages",
    dietary: ["Vegetarian", "Gluten-Free"],
    spice: "Mild",
    image: beverages,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

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
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { ...menuItems[0], quantity: 1 },
    { ...menuItems[5], quantity: 2 },
    { ...menuItems[2], quantity: 1 },
  ]);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
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
  }, [minPrice, maxPrice, selectedCuisines, selectedDietary, selectedSpice]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const toggleFilter = (
    value: string,
    setState: Dispatch<SetStateAction<string[]>>,
    state: string[],
  ) => {
    setState(
      state.includes(value)
        ? state.filter((item) => item !== value)
        : [...state, value],
    );
  };

  const addToCart = (item: MenuItem) => {
    setCartItems((current) => {
      const found = current.find((cartItem) => cartItem.id === item.id);
      if (found) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const minPricePercent = minPrice;
  const maxPricePercent = maxPrice;

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
            max={100}
            value={minPrice}
            onChange={(event) => {
              const value = Math.min(Number(event.target.value), maxPrice);
              setMinPrice(value);
            }}
            className="pointer-events-none absolute top-0 h-8 w-full appearance-none bg-transparent accent-[#7248ff] [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />
          <input
            aria-label="Maximum price"
            type="range"
            min={0}
            max={100}
            value={maxPrice}
            onChange={(event) => {
              const value = Math.max(Number(event.target.value), minPrice);
              setMaxPrice(value);
            }}
            className="pointer-events-none absolute top-0 h-8 w-full appearance-none bg-transparent accent-[#7248ff] [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-base font-normal">
          <span>{formatCurrency(minPrice).replace(".00", "")}</span>
          <span>{formatCurrency(maxPrice).replace(".00", "")}</span>
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
            {filteredMenu.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-36 w-full rounded-md object-cover sm:h-40"
                />
                <div className="px-1 pt-4">
                  <h3 className="text-base font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 min-h-[48px] text-sm font-normal leading-6 text-[#111111]">
                    {item.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-base font-semibold">
                      {formatCurrency(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="inline-flex h-10 min-w-[142px] items-center justify-center gap-2 rounded-md bg-[#633df1] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc]"
                    >
                      Add to Cart
                      <ShoppingCart size={16} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredMenu.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                No dishes match your current filters.
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:sticky xl:top-24 xl:h-fit">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Your Basket ({cartItems.length})
          </h2>

          <div className="space-y-7">
            {cartItems.length === 0 ? (
              <p className="text-base font-normal text-gray-500">
                Your basket is empty.
              </p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[64px_1fr] gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">
                      {item.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-base font-normal">
                        {formatCurrency(item.price)}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 items-center rounded-md border border-[#825cff] bg-white px-3">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.title}`}
                            onClick={() => updateQuantity(item.id, -1)}
                            className="grid h-7 w-7 place-items-center text-[#111111]"
                          >
                            <Minus size={16} strokeWidth={2.8} />
                          </button>
                          <span className="w-7 text-center text-base font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.title}`}
                            onClick={() => updateQuantity(item.id, 1)}
                            className="grid h-7 w-7 place-items-center text-[#111111]"
                          >
                            <Plus size={16} strokeWidth={2.8} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
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
            className="mt-9 flex h-14 w-full items-center justify-center gap-4 rounded-md bg-[#633df1] px-6 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-[#5330dc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Proceed to Checkout
            <ArrowRight size={21} strokeWidth={2.5} />
          </button>
        </aside>
      </div>
    </main>
  );
};

export default BuyOnlinePage;
