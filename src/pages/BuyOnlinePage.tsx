import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import beverages from "../assets/beverages.jpeg";
import signatureDishes from "../assets/signature-dishes.jpeg";
import smallBites from "../assets/small-bites.jpeg";
import Button from "../components/common/Button";

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
    description:
      "Mediterranean salad with halloumi, olives, and roasted vegetables.",
    price: 24,
    category: "Salads",
    dietary: ["Vegetarian"],
    spice: "Mild",
    image: beverages,
  },
  {
    id: 3,
    title: "Truffle Ricotta Gnocchi",
    description:
      "Truffle ricotta gnocchi with creamy sauce and cracked pepper.",
    price: 26,
    category: "Mains",
    dietary: ["Vegetarian"],
    spice: "Medium",
    image: smallBites,
  },
  {
    id: 4,
    title: "Truffle Ricotta Bowl",
    description: "Warm quinoa bowl with ricotta, greens, and shaved truffle.",
    price: 28,
    category: "Mains",
    dietary: ["Vegetarian"],
    spice: "Medium",
    image: signatureDishes,
  },
  {
    id: 5,
    title: "Berry Bliss Smoothie",
    description: "Fresh berries blended with coconut milk and chia seeds.",
    price: 10,
    category: "Beverages",
    dietary: ["Vegan", "Gluten-Free"],
    spice: "Mild",
    image: beverages,
  },
  {
    id: 6,
    title: "Chef's Veggie Platter",
    description: "Seasonal grilled vegetables with house hummus and warm pita.",
    price: 18,
    category: "Appetizers",
    dietary: ["Vegan"],
    spice: "Hot",
    image: smallBites,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const BuyOnlinePage = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(100);
    setSelectedCuisines([]);
    setSelectedDietary([]);
    setSelectedSpice([]);
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
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <section className="w-full min-h-screen bg-[#f8f7fb] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#7c5dfa] mb-3">
            Buy Online
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[#18181b]">
            Our Online Menu
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-7">
            Browse our chef-crafted dishes, add your favorites to the basket,
            and prepare to enjoy restaurant-quality food at home.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <aside className="xl:col-span-3 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#18181b] mb-4">
                Filter Your Taste
              </h2>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                    <span>Price Range</span>
                    <span>
                      {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full accent-[#7c5dfa]"
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#7c5dfa]"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#18181b] mb-3">
                    Cuisine Type
                  </h3>
                  <div className="space-y-3">
                    {cuisineOptions.map((cuisine) => (
                      <label
                        key={cuisine}
                        className="flex items-center gap-3 text-gray-700 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCuisines.includes(cuisine)}
                          onChange={() =>
                            toggleFilter(
                              cuisine,
                              setSelectedCuisines,
                              selectedCuisines,
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#7c5dfa] focus:ring-[#7c5dfa]"
                        />
                        {cuisine}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#18181b] mb-3">
                    Dietary
                  </h3>
                  <div className="space-y-3">
                    {dietaryOptions.map((diet) => (
                      <label
                        key={diet}
                        className="flex items-center gap-3 text-gray-700 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDietary.includes(diet)}
                          onChange={() =>
                            toggleFilter(
                              diet,
                              setSelectedDietary,
                              selectedDietary,
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#7c5dfa] focus:ring-[#7c5dfa]"
                        />
                        {diet}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#18181b] mb-3">
                    Spice Level
                  </h3>
                  <div className="space-y-3">
                    {spiceOptions.map((spice) => (
                      <label
                        key={spice}
                        className="flex items-center gap-3 text-gray-700 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSpice.includes(spice)}
                          onChange={() =>
                            toggleFilter(spice, setSelectedSpice, selectedSpice)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#7c5dfa] focus:ring-[#7c5dfa]"
                        />
                        {spice}
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  content="Reset Filters"
                  onClick={resetFilters}
                  className="w-full bg-[#e0e7ff] text-[#3730a3] hover:bg-[#c7d2fe]"
                />
              </div>
            </div>
          </aside>

          <main className="xl:col-span-6 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#7c5dfa]">
                    Our Online Menu
                  </p>
                  <h2 className="text-xl font-semibold text-[#18181b]">
                    Delicious choices for every craving
                  </h2>
                </div>
                <span className="text-sm text-gray-500">
                  {filteredMenu.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredMenu.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="text-base font-semibold text-[#111827]">
                          {item.title}
                        </h3>
                        <span className="text-sm font-semibold text-[#7c5dfa]">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs text-[#4338ca]">
                          {item.category}
                        </span>
                        <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs text-gray-600">
                          {item.spice}
                        </span>
                      </div>
                      <Button
                        content="Add to Cart"
                        onClick={() => addToCart(item)}
                        className="w-full bg-[#7c5dfa] hover:bg-[#6a4ee0]"
                      />
                    </div>
                  </article>
                ))}
                {filteredMenu.length === 0 && (
                  <div className="col-span-full rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                    No dishes match your current filters.
                  </div>
                )}
              </div>
            </div>
          </main>

          <aside className="xl:col-span-3 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#7c5dfa]">
                    Your Basket
                  </p>
                  <p className="text-lg font-semibold text-[#18181b]">
                    {cartItems.length} items
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Your basket is empty. Add items from the menu to get
                    started.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-[#111827]">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-gray-700"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-[#7c5dfa] hover:text-[#5b42c8]"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-[#7c5dfa] hover:text-[#5b42c8]"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="font-semibold text-[#111827]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-gray-200 pt-5 mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax (5%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-[#111827]">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                content="Proceed to Checkout"
                onClick={() => undefined}
                disabled={cartItems.length === 0}
                className="w-full bg-[#7c5dfa] hover:bg-[#6a4ee0]"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default BuyOnlinePage;
