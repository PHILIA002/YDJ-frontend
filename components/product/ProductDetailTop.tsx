"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function ProductDetailTop({ product }: any) {
  const [count, setCount] = useState(1);

  const mainImg = product.mainImg;
  const subImages: string[] = product.subImages || [];
  const allImages = [mainImg, ...subImages];

  const [currentImg, setCurrentImg] = useState(mainImg);

  return (
    <div className="bg-white p-8 rounded-xl shadow flex gap-10">

      {/* --------------------------- */}
      {/* 이미지 전체 영역     */}
      {/* --------------------------- */}
      <div className="flex flex-1 gap-6">

        {/* 썸네일 리스트 */}
        <div className="flex flex-col gap-3">
          {allImages.map((img, i) => (
            <img
              key={i}
              src={img}
              className={`w-20 h-20 rounded-lg object-cover cursor-pointer border 
              ${currentImg === img ? "border-blue-500" : "border-gray-300"}`}
              onClick={() => setCurrentImg(img)}
            />
          ))}
        </div>

        {/* 메인 이미지 */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={currentImg}
            className="w-[420px] rounded-xl object-contain"
          />
        </div>

      </div>

      {/* --------------------------- */}
      {/* BUY BOX            */}
      {/* --------------------------- */}
      <div className="w-[360px] sticky top-24 h-fit bg-white border rounded-xl p-6 shadow-sm flex flex-col gap-6">

        <h1 className="text-2xl font-bold">{product.productName}</h1>

        <div>
          <p className="text-gray-400 line-through text-sm">
            {product.consumerPrice?.toLocaleString()}원
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {product.sellPrice?.toLocaleString()}원
          </p>
          <p className="text-gray-600 mt-1 text-sm">재고: {product.stock}개</p>
        </div>

        {/* 수량 조절 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount(v => Math.max(1, v - 1))}
            className="p-2 bg-gray-200 rounded"
          >
            <Minus />
          </button>
          <span className="text-lg font-semibold">{count}</span>
          <button
            onClick={() => setCount(v => v + 1)}
            className="p-2 bg-gray-200 rounded"
          >
            <Plus />
          </button>
        </div>

        {/* 장바구니 버튼 */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          장바구니 담기
        </button>

      </div>

    </div>
  );
}
