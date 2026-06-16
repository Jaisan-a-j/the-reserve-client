import { useEffect, useRef, useState } from "react";
import { type LucideIcon } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

type AboutStatProps = {
  icon: LucideIcon;
  count: string; 
  title: string;
};

const AboutData = ({ icon: Icon, count, title }: AboutStatProps) => {
  const containerRef = useRef(null);
  
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const targetNumber = parseInt(count, 10) || 0;
  const motionValue = useMotionValue(0);
  
  const springValue = useSpring(motionValue, {
    stiffness: 30,
    damping: 15,
  });

  const [displayCount, setDisplayCount] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetNumber);
    }
  }, [isInView, motionValue, targetNumber]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayCount(Math.floor(latest).toString());
    });
  }, [springValue]);

  const digits = displayCount.split("");  

  return (
    <div ref={containerRef} className="text-center">
      <div className="flex justify-center">
        <Icon className="text-[#7c5dfa]" size={34} />
      </div>
      <div className="flex justify-center items-center items-baseline text-4xl font-bold text-[#7c5dfa] mt-4">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="relative overflow-hidden h-[1.1em] flex items-center justify-center"
            style={{ width: "0.6em" }}
          >
            <motion.span
              key={digit} 
              animate={{ y: "0%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="absolute"
            >
              {digit}
              
            </motion.span>
          </div>
        ))}
        +
      </div>
      <p className="text-gray-500 mt-2 text-lg">{title}</p>
    </div>
  );
};

export default AboutData;