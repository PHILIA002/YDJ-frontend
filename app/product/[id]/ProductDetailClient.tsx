"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function ProductDetailClient({
  product,
  user = null,
}: {
  product: any;
  user?: { name: string } | null;
}) {
  const [count, setCount] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  // ❤️ 좋아요 상태 불러오기
  useEffect(() => {
    const likedItems = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    setLiked(likedItems.includes(product.productId));
  }, [product.productId]);

  // ❤️ 좋아요 토글
  const handleLike = () => {
    const likedItems = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    let updatedLikes;
    if (likedItems.includes(product.productId)) {
      updatedLikes = likedItems.filter((id: number) => id !== product.productId);
      setLiked(false);
    } else {
      updatedLikes = [...likedItems, product.productId];
      setLiked(true);
    }
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
  };

  // 🛒 장바구니 담기
  const handleAddToCart = () => {
    if (!user) {
      const goLogin = window.confirm(
        "장바구니를 사용하려면 로그인해야 합니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      if (goLogin) window.location.href = "/login";
      return;
    }

    if (!selectedOption) {
      alert("옵션을 선택해주세요!");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item: any) =>
        item.productId === product.productId && item.option === selectedOption
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].count += count;
    } else {
      existingCart.push({
        productId: product.productId,
        productName: product.productName,
        price: product.sellPrice,
        thumbnailUrl: product.thumbnailUrl,
        option: selectedOption,
        color: selectedColor,
        count,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("🛒 장바구니에 담겼습니다!");
  };

  // 🖼 이미지 높이 동기화
  useEffect(() => {
    if (detailRef.current) {
      setImageHeight(detailRef.current.clientHeight);
    }
  }, [product, count, selectedOption, liked, selectedColor]);

  const colors: string[] = product.colors || [];

  return (
    <div className="max-w-6xl h-full my-auto bg-white p-8 rounded-xl shadow">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* 왼쪽 이미지 */}
        <div className="flex justify-center" style={{ height: imageHeight ? `${imageHeight}px` : "auto" }}>
          <div className="w-full h-full flex justify-center items-center">
            <Image
              src={`/images/${product.thumbnailUrl || "default_main.png"}`}
              alt={product.productName}
              width={450}
              height={450}
              className="rounded-lg object-contain h-full"
            />
          </div>

          {/* 색상 옵션 */}
          {colors.length > 0 && (
            <div className="flex justify-center gap-3 mt-6 absolute bottom-0">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-blue-600 scale-110"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 오른쪽 상세 정보 */}
        <div ref={detailRef} className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.productName}</h1>
          <p className="text-gray-700 mb-6">{product.description || "설명이 없습니다."}</p>

          <div className="mb-6">
            <p className="text-gray-400 text-sm line-through">{product.consumerPrice?.toLocaleString()}원</p>
            <p className="text-3xl font-bold text-blue-600">{product.sellPrice?.toLocaleString()}원</p>
            <p className="text-gray-600 mt-2 text-sm">재고: {product.stock}개</p>
          </div>

          {/* 옵션 선택 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">옵션 선택</label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="text-black w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">옵션을 선택하세요</option>
              {product.options?.length > 0 ? (
                product.options.map((opt: string, idx: number) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))
              ) : (
                <option disabled>옵션이 없습니다</option>
              )}
            </select>
          </div>

          {/* 수량 조절 */}
          <div className="flex justify-center items-center gap-5 mb-6">
            <button
              onClick={() => setCount((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500 text-white"
            >-</button>
            <span className="text-lg font-semibold text-gray-800">{count}</span>
            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500 text-white"
            >+</button>
          </div>

          {/* 좋아요 + 장바구니 버튼 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-all duration-300"
              aria-label="좋아요"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-7 h-7 transition-all duration-300 ease-in-out ${liked
                  ? "fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]"
                  : "fill-none stroke-gray-400 hover:stroke-rose-400"
                }`}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s-7.5-4.35-9.33-10.05C1.9 7.03 4.4 3.5 8.05 3.5c1.97 0 3.63 1.05 4.45 2.61C13.32 4.55 14.98 3.5 16.95 3.5c3.65 0 6.15 3.53 5.38 7.45C19.5 16.65 12 21 12 21z" />
              </svg>
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              장바구니 담기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
