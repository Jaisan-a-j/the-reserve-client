import {
  BadgeCheck,
  ReceiptText,
  Sparkles,
  PartyPopper,
  ChefHat,
} from "lucide-react";
import AboutData from "./AboutData";

const AboutUs = () => {
  return (
    <section id="aboutus" className="bg-[#f6f4f8] py-2 px-6 md:px-12">
      <div className="max-w-7xl mx-auto rounded-[40px] bg-white/60 backdrop-blur-sm border border-[#ebe5ff] p-6 md:p-10 lg:p-14 shadow-sm">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[#7c5dfa] mb-6">
              <ChefHat size={22} />
              <span className="font-semibold">About Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#1f2a56]">
              Passion for Food,
              <br />
              Made with
              <span className="text-[#7c5dfa]"> Heart</span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              At The Reserve, we believe dining is more than just a meal.
              It is an experience crafted with passion, premium ingredients,
              and unforgettable hospitality. Every dish is prepared with
              precision to create moments worth sharing.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[32px]">
              <img
                src="https://res.cloudinary.com/drooxwpmj/image/upload/v1781102053/about-us_pae7ea.jpg"
                alt="Chef"
                className="w-full h-[500px] object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947"
                alt=""
                className="h-36 w-full rounded-2xl object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                alt=""
                className="h-36 w-full rounded-2xl object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1563805042-7684c019e1cb"
                alt=""
                className="h-36 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 bg-white rounded-[28px] border border-[#ebe5ff] shadow-sm p-6 md:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AboutData
              icon={BadgeCheck}
              count="7"
              title="Years of Experience"
            />

            <AboutData
              icon={ReceiptText}
              count="30"
              title="Dishes in Our Menu"
            />

            <AboutData
              icon={Sparkles}
              count="500"
              title="Customer Reviews"
            />

            <AboutData
              icon={PartyPopper}
              count="1000"
              title="Happy Customers"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;