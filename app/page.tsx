"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  productId: number;
  productName: string;
  consumerPrice: number;
  sellPrice: number;
  mainImg: string;
}

const banners = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg",
];

export default function Page() {
  const [showIntro, setShowIntro] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Hook 순서 유지
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Intro 화면
  const goHome = () => setShowIntro(false);

  const introLines = ["Your Daily", "Journey"];
  const renderLine = (line: string, lineIdx: number) =>
    line.split("").map((char, idx) => {
      if (lineIdx === 1 && char.toLowerCase() === "o") {
        return (
          <img
            key={idx}
            src="/images/signature_b.png"
            alt="O"
            className="inline-block w-16 h-16 md:w-20 md:h-20 mx-[2px] -mb-2 animate-spin-slow"
          />
        );
      }
      return (
        <span key={idx} className="inline-block mx-[1px]">
          {char}
        </span>
      );
    });

  if (showIntro) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-white">
        {introLines.map((line, idx) => (
          <h1
            key={idx}
            className="text-6xl md:text-8xl font-extrabold text-center leading-tight"
          >
            {renderLine(line, idx)}
          </h1>
        ))}
        <button
          onClick={goHome}
          className="mt-10 px-8 py-4 bg-blue-600 text-white rounded-full text-xl font-semibold"
        >
          Start Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        상품 불러오는 중...
      </div>
    );
  }

  // Home 화면
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-4xl relative overflow-hidden h-80 md:h-[400px]">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`배너 ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl mt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          상품 목록
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link
              key={p.productId}
              href={`/product/${p.productId}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer"
            >
              <img
                src={p.mainImg || "/images/default_main.png"}
                alt={p.productName}
                className="w-full h-40 object-contain mb-3"
              />
              <p className="text-gray-800 text-center text-sm font-medium mb-1 line-clamp-2 h-10">
                {p.productName}
              </p>
              <p className="text-gray-500 text-xs line-through">
                {p.consumerPrice.toLocaleString()}원
              </p>
              <p className="text-blue-600 font-bold mt-1">
                {p.sellPrice.toLocaleString()}원
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
