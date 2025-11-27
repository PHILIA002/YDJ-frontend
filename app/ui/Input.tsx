"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      <label className="block text-gray-700 mb-2 font-semibold">{label}</label>
      <input
        {...props}
        className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${className}`}
      />
    </div>
  );
}
