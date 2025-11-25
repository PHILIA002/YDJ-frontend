"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";

interface Product {
  productId: number;
  productName: string;
  thumbnail: string;
  price: number;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 찜 목록 불러오기
  const loadWishlist = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/like/my", {
        method: "GET",
        credentials: "include", // 세션 쿠키 전송 필수
      });

      if (!res.ok) {
        throw new Error("찜 목록 불러오기 실패");
      }

      const data = await res.json();
      setWishlist(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // 찜 삭제(토글)
  const removeItem = async (productId: number) => {
    await fetch(`http://localhost:8080/api/like/toggle/${productId}`, {
      method: "POST",
      credentials: "include",
    });

    loadWishlist(); // 새로고침
  };

  if (loading) {
    return <p className="text-center py-10">로딩 중...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">찜한 상품</h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            찜한 상품이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2"
              >
                <Link href={`/product/${item.productId}`}>
                  <img
                    src={item.thumbnail || "/images/default_main.png"}
                    alt={item.productName}
                    className="w-full h-40 object-contain rounded-lg"
                  />
                </Link>

                <p className="text-gray-800 font-medium text-center">
                  {item.productName}
                </p>

                <p className="text-black font-bold">
                  {item.price.toLocaleString()}원
                </p>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm mt-2"
                >
                  <Trash2 size={14} /> 삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
