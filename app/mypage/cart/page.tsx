"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, deleteItem, updateQuantity, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="py-10 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 장바구니 목록 */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">장바구니</h1>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm cursor-pointer"
              >
                <Trash2 size={16} />
                전체삭제
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-10 text-lg">
              장바구니가 비어있습니다.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-xl transition"
              >
                <Link href={`/product/${item.productId}`}>
                  <div className="w-full sm:w-28 h-28 flex items-center justify-center">
                    <img
                      src={item.thumbnail || "/images/default_main.png"}
                      alt={item.productName}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </Link>

                <div className="flex-1 flex flex-col justify-between h-full w-full">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-gray-800 truncate">
                      {item.productName}
                    </p>

                    {item.option && (
                      <p className="text-gray-500 text-sm mt-1 truncate">
                        옵션: [{item.option.optionTitle}] {item.option.optionValue}
                      </p>
                    )}

                    {item.soldOut && (
                      <p className="text-red-500 text-sm font-semibold mt-1">
                        품절된 상품입니다
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* 수량 조절 */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartId, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-6 text-center text-gray-800 font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.cartId, item.quantity + 1)
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-bold whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>

                      <button
                        onClick={() => deleteItem(item.cartId)}
                        className="flex items-center gap-1 px-3 py-1 text-red-500 rounded-lg hover:bg-red-100 transition text-sm cursor-pointer"
                      >
                        <Trash2 size={14} /> 삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 결제 요약 */}
        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6 h-fit sticky top-10">
            <h2 className="text-xl font-bold text-gray-900 mb-2">결제 정보</h2>

            <div className="flex flex-col gap-3 text-gray-700">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span className="text-gray-800 font-bold">무료</span>
              </div>
              <div className="flex justify-between pt-3 border-t font-bold text-lg">
                <span>총 결제 금액</span>
                <span className="text-gray-700">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/order/checkout")}
<<<<<<< HEAD
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition cursor-pointer"
=======
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition cursor-pointer"
>>>>>>> 6126007 (전체페이지 ui및 디자인 수정, ui/... 파일들로 스타일 통일, signup에서 join으로 폴더 이름 변경)
            >
              {totalPrice.toLocaleString()}원 결제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
