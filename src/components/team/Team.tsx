import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { chefs } from "../../constants/chef";

const Team = () => {
  return (
    <section id="team" className="bg-[#f7f5f8] py-24 px-6">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#2b2b52]">
          Get to Know Our Amazing Team
        </h2>

        <p className="text-gray-600 text-xl mt-6 leading-8">
          Meet the Passionate Experts Behind Our Success and Learn More About
          Their Roles.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mt-20">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },

            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {chefs.map((chef) => (
            <SwiperSlide key={chef.id}>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-[#f4f2f5]">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-[320px] object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-3xl font-semibold text-[#2b2b52]">
                    {chef.name}
                  </h3>

                  <div className="w-full h-[1px] bg-gray-200 my-5"></div>

                  <h4 className="text-xl text-[#2b2b52] font-medium">
                    {chef.role}
                  </h4>

                  <p className="text-gray-600 text-lg leading-8 mt-3">
                    {chef.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Team;
