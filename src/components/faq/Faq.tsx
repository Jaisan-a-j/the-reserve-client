import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { faqs } from "../../constants/faqs";

import "swiper/css";
import "swiper/css/navigation";

const Faq = () => {
  return (
    <section id="faqs" className="bg-[#f8f8fb] py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-[#2d3250]">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600 text-xl mt-6 max-w-3xl mx-auto">
            Levarage artificial intelligence algorithms to provide users with
            valuable insights
          </p>
        </div>

        <div className="mt-24 relative">
          <button className="faq-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-[#7c5dfa] flex items-center justify-center text-[#7c5dfa] hover:bg-[#7c5dfa] hover:text-white transition-all duration-300">
            <ArrowLeft size={26} />
          </button>

          <button className="faq-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-[#7c5dfa] flex items-center justify-center text-[#7c5dfa] hover:bg-[#7c5dfa] hover:text-white transition-all duration-300">
            <ArrowRight size={26} />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".faq-prev",
              nextEl: ".faq-next",
            }}
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },

              768: {
                slidesPerView: 2,
              },

              1024: {
                slidesPerView: 3,
              },
            }}
            className="px-20"
          >
            {faqs.map((faq) => (
              <SwiperSlide key={faq.id}>
                <div className="text-center px-6 min-h-[430px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-[42px] leading-snug font-bold text-[#3a3d4f]">
                      {faq.title}
                    </h3>

                    <p className="text-gray-500 text-[18px] leading-[42px] mt-8">
                      {faq.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Faq;
