import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ children, target, active = true, type = "button", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!active || type === "submit") return;
    if (target) navigate(target);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={!active}
      className={`
        inline-flex items-center justify-center
        rounded-md text-sm font-medium
        transition-colors duration-200
        px-4 py-2
        bg-zinc-100 text-black
        hover:bg-zinc-200
        dark:bg-zinc-900 dark:text-white
        dark:hover:bg-zinc-800
        border border-zinc-200 dark:border-zinc-700
        disabled:opacity-50 disabled:pointer-events-none
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;