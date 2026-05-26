import React from "react";

const FullScreenLoader = ({ text = "Please wait..." }: { text?: string }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-t-transparent border-[#7c5dfa] animate-spin" />
        <span className="text-gray-700 font-medium">{text}</span>
      </div>
    </div>
  );
};

export default FullScreenLoader;
