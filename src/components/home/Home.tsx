import home from "../../assets/home.jpeg";
import { useAppSelector } from "../../hooks/reduxHooks";
import { motion } from "framer-motion";
import TypingText from "./TypingText";

const Main = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section
      id="home"
      className="w-full px-6 pt-36 pb-16 bg-[#f8f7fb] overflow-hidden scroll-mt-20"
    >
      <div className="flex flex-col items-center justify-center sm:mt-[55px]">
        <div className="flex justify-center">
          <div className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
            <span>Serving Food Lovers Since 2016</span>
            <span>❤️</span>
          </div>
        </div>

        <div className="mt-8 text-center xl:w-[60%]">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl xl:text-5xl font-bold tracking-tight text-[#2b2d42] leading-tight"
          >
            Savor Every Bite. <TypingText text="Savor Every Moment." />
          </motion.h1>

          <p className="mt-6 text-gray-600 text-lg leading-8">
            Welcome <span className="text-3xl font-bold">{user?.fullName}</span>{" "}
            to a dining experience where flavor, freshness, and hospitality come
            together. Whether it's your first visit or your hundredth, every
            plate is made to impress.
          </p>
        </div>

        <a
          href="#buyonline"
          className="bg-linear-to-r mt-8 from-purple-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-300"
        >
          Experience the Flavor →
        </a>
      </div>

      <div className="mt-16 xl:mt-28">
        <img
          src={home}
          alt="Restaurant Food"
          className="w-full h-[420px] object-cover rounded-[2rem]"
        />
      </div>
    </section>
  );
};

export default Main;
