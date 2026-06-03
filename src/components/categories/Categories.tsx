import { categoryData } from "../../constants/food";
import type { CategoryTypes } from "../../types";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <section id="buyonline" className="px-6 py-12 md:py-20 bg-white">
      <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-[#1e293b] mb-4">
          Crafting Moments, Serving You
        </h2>
        <p className="text-gray-500 leading-relaxed text-sm md:text-base">
          From unforgettable flavors to seamless service, we're here to make
          every meal feel special. Whether you dine in, take out, or order
          online we've got your cravings covered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {categoryData.map((category: CategoryTypes) => (
          <div
            key={category.id}
            className="flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
          >
            <div className="w-full h-64 overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#1e293b] mb-3">
                {category.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                {category.description}
              </p>
              <Button
                onClick={() => navigate("/buy-online")}
                content="Read More →"
                className="self-start"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
