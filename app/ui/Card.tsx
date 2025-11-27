"use client";
import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3 border border-gray-200">
      {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
      {children}
    </div>
  );
}
