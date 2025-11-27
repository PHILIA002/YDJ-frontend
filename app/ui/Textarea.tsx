"use client";
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-gray-700 mb-2 font-semibold">{label}</label>
      <textarea
        {...props}
        className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${className}`}
      />
    </div>
  );
}
