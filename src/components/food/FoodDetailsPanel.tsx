import { ShoppingCart, Star, Truck } from "lucide-react";
import type { FoodItem } from "../../types";

type FoodDetailsPanelProps = {
  item: FoodItem;
  currentQuantity: number;
  cartLoading: boolean;
  addToCart: (selectedItem: FoodItem) => void;
};

const FoodDetailsPanel = ({
  item,
  currentQuantity,
  cartLoading,
  addToCart,
}: FoodDetailsPanelProps) => (
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
        <span className="font-semibold text-[#111111]">{currentQuantity}</span>
      </p>
    )}

    <div className="mt-10 rounded-2xl border border-gray-200 bg-[#f8f7ff] p-5 text-sm text-gray-600">
      <div className="mb-3 flex items-center gap-2 text-[#111111]">
        <Star size={18} strokeWidth={2.4} />
        <span className="font-semibold">Why choose this dish?</span>
      </div>
      <p>
        A carefully crafted recipe with fresh ingredients, bold flavors, and
        balanced presentation — perfect for sharing or enjoying solo.
      </p>
    </div>
  </aside>
);

export default FoodDetailsPanel;
