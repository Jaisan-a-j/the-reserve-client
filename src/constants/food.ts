import beverages from "../assets/beverages.jpeg";
import signatureDishes from "../assets/signature-dishes.jpeg";
import smallBites from "../assets/small-bites.jpeg";
import type { CategoryTypes } from "../types";
export const categoryData: CategoryTypes[] = [
  {
    id: 1,
    title: "Signature Dishes",
    description:
      "Experience our chef's hand-crafted masterpieces, where tradition meets contemporary culinary innovation.",
    image: beverages,
  },
  {
    id: 2,
    title: "Small Bites",
    description:
      "Perfectly portioned starters and savory delights designed for sharing or a light, flavorful snack.",
    image: signatureDishes,
  },
  {
    id: 3,
    title: "Beverages & Desserts",
    description:
      "End on a high note with our artisanal sweets and a curated selection of refreshing house-made drinks.",
    image: smallBites,
  },
];
