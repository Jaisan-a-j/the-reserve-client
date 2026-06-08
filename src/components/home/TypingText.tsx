import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  text: string;
};

const TypingText = ({ text }: Props) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      let currentIndex = 0;

      setDisplayText("");

      const type = () => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;

          timeoutId = setTimeout(type, 100);
        } else {
          timeoutId = setTimeout(startTyping, 2000);
        }
      };

      type();
    };

    startTyping();

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[#7c5dfa]"
    >
      {displayText}
      <span className="animate-pulse">|</span>
    </motion.span>
  );
};

export default TypingText;
