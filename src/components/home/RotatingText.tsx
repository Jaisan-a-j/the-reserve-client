import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["Moment.", "Memory.", "Experience.", "Celebration."];

const RotatingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block text-[#7c5dfa]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.4 }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
