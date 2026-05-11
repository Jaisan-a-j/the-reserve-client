import { categoryData } from "../../constants/food";
import type { CategoryTypes } from "../../types";

const Categories = () => {
  return (
    <section className="px-6 py-12 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[#1e293b] mb-4">
          Crafting Moments, Serving You
        </h2>
        <p className="text-gray-500 leading-relaxed text-sm">
          From unforgettable flavors to seamless service, we're here to make
          every meal feel special. Whether you dine in, take out, or order
          online we've got your cravings covered.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {categoryData.map((category: CategoryTypes) => (
          <div
            key={category.id}
            className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-full h-56 overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-[#1e293b] mb-3">
                {category.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {category.description}
              </p>

              <button className=" bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
