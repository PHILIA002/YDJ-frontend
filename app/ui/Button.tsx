"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-gray-600 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition-all font-semibold shadow-md cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
