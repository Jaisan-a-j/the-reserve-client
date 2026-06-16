import { useAppSelector } from "../../hooks/reduxHooks";
import { motion } from "framer-motion";
import RotatingText from "./RotatingText";

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

        <div className="relative mt-8 text-center xl:w-[60%]">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none"
          />

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative text-3xl xl:text-6xl font-bold tracking-tight text-[#2b2d42] leading-tight"
          >
            Savor Every Bite. <RotatingText />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
            className="mt-6 text-gray-600 text-lg leading-8"
          >
            Welcome <span className="text-3xl font-bold">{user?.fullName}</span>{" "}
            to a dining experience where flavor, freshness, and hospitality come
            together. Whether it's your first visit or your hundredth, every
            plate is made to impress.
          </motion.p>
        </div>

        <motion.a
          href="#buyonline"
          animate={{
            y: [0, -7, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-linear-to-r mt-8 from-purple-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md"
        >
          Experience the Flavor →
        </motion.a>
      </div>

      <div className="mt-16 xl:mt-28">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 xl:mt-28"
        >
          <img
            src="https://res.cloudinary.com/drooxwpmj/image/upload/v1781102051/home_cwj3lz.jpg"
            alt="Restaurant Food"
            className="w-full h-[420px] object-cover rounded-[2rem]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Main;
