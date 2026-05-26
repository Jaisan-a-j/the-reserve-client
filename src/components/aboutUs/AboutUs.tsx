import { BadgeCheck, ReceiptText, Sparkles, PartyPopper } from "lucide-react";
import aboutUs from "../../assets/about-us.jpeg";
import AboutData from "./AboutData";

const AboutUs = () => {
  return (
    <section id="aboutus" className="bg-[#f6f4f8] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#2b2b52]">
          About Us
        </h2>

        <p className="mt-6 text-gray-600 text-lg leading-8">
          Our achievement story stands as a powerful testament to teamwork and
          perseverance. United, we have faced challenges, celebrated victories,
          and woven a narrative of growth and success.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-24 relative">
        <img
          src={aboutUs}
          alt="Chef"
          className="w-full h-[650px] object-cover rounded-3xl"
        />

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 absolute left-1/2 -translate-x-1/2 -bottom-24 w-[90%]">
          <AboutData icon={BadgeCheck} count="7+" title="Years of Experience" />

          <AboutData
            icon={ReceiptText}
            count="30+"
            title="Dishes in Our Menu"
          />

          <AboutData icon={Sparkles} count="500+" title="Customer Reviews" />

          <AboutData icon={PartyPopper} count="10k+" title="Happy Customers" />
        </div>
      </div>

      <div className="h-32"></div>
    </section>
  );
};

export default AboutUs;
