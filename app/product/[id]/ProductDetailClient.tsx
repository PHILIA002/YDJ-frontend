"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductDetailClient({ product }: { product: any }) {
  const [count, setCount] = useState(1);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-[600px]">
      <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>

      <Image
        src={`/images/${product.thumbnailUrl || "default.jpg"}`}
        alt={product.productName}
        width={500}
        height={400}
        className="rounded-lg mb-4 object-cover"
        onError={(e) => (e.currentTarget.src = "/images/default.jpg")}
      />

      <p className="text-gray-700 mb-3">{product.description || "설명 없음"}</p>

      <div className="mb-6">
        <p className="text-gray-500 line-through">
          {product.consumerPrice?.toLocaleString()}원
        </p>
        <p className="text-2xl font-bold text-red-500">
          {product.sellPrice?.toLocaleString()}원
        </p>
        <p className="text-gray-600 mt-1">재고: {product.stock}개</p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setCount((prev) => Math.max(1, prev - 1))}
          className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-lg font-semibold">{count}</span>
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700">
        장바구니 담기
      </button>
    </div>
  );
}
