"use client";

import { useEffect, useState } from "react";
import ProductDetailTop from "@/app/product/components/ProductDetailTop";
import ProductDetailBottom from "@/app/product/components/ProductDetailBottom";


export default function ProductDetailClient({ productId }: { productId: number }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${productId}/detail`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [productId]);

  if (!product)
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <p className="text-gray-700 mb-3">상품 불러오는 중...</p>
        <img
          src="/images/signature_w.png"
          alt="Loading"
          className="inline-block w-8 h-8 md:w-20 md:h-20 animate-spin-slow"
        />
      </div>
    );

  return (
    <div className="w-full">
      <ProductDetailTop product={product} />
      <ProductDetailBottom product={product} />
    </div>
  );
}
