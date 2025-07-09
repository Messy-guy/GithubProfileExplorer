"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const Button = ({ children, onClick, className = "", disabled = false }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `bg-amber-50 text-gray-900 dark:bg-gray-800 dark:text-white
         rounded-2xl px-4 py-1 shadow-md
         active:scale-95 active:shadow-md
         transition-transform duration-110`,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
