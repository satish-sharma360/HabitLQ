import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M12 2v20" />
          <path d="M5 12h14" />
        </svg>
      </div>
      <span className="text-white font-semibold text-lg tracking-tight">
        HabitIQ
      </span>
    </div>
  );
};

export default Logo;