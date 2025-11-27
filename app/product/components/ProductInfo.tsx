"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus, Minus, X } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { useCart } from "../../../context/CartContext";

export interface Option {
  optionId: number;
  value: string;
}

export interface SelectedOption extends Option {
  count: number;
}

export interface Product {
  subImages: string[] | undefined;
  productId: number;
  productName: string;
  mainImg?: string;
  consumerPrice?: number;
  sellPrice: number;
  stock: number;
  isOption?: number;
  options?: { optionId: number; optionValue: string }[];
  categoryPath: string;
  likeCount?: number;
  userLiked?: boolean;
}

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { user } = useUser();
  const { addToCart } = useCart();

  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** 좋아요 */
  const [isLiked, setIsLiked] = useState<boolean>(!!product.userLiked);
  const [likesCount, setLikesCount] = useState<number>(product.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!user) return router.push("/login"); // 로그인 체크
    if (likeLoading) return; // 중복 클릭 방지

    setLikeLoading(true);
    const prevLiked = isLiked;
    const prevCount = likesCount;

    try {
      const res = await fetch(`/api/products/${product.productId}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Like request failed');

      const data = await res.json();
      // 서버에서 liked(boolean)와 likes(number) 반환 가정
      setIsLiked(data.liked);
      setLikesCount(data.likes);
    } catch (err) {
      console.error(err);
      alert('좋아요 처리 실패');
      // 실패하면 이전 상태 복원
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setLikeLoading(false);
    }
  };

  /** 옵션 선택 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (opt: Option) => {
    if (selectedOptions.some((o) => o.optionId === opt.optionId)) {
      alert("이미 선택된 옵션입니다.");
      return;
    }
    setSelectedOptions((prev) => [...prev, { ...opt, count: 1 }]);
    setDropdownOpen(false);
  };

  /** 장바구니 */
  const handleAddToCart = async () => {
    if (!user) return router.push("/login");
    if (product.isOption && selectedOptions.length === 0) return alert("옵션을 선택해주세요!");

    if (product.isOption) {
      for (const opt of selectedOptions) {
        await addToCart(
          {
            productId: product.productId,
            productName: product.productName,
            sellPrice: product.sellPrice,
            stock: product.stock,
            mainImg: product.mainImg,
          },
          opt.optionId,
          opt.count
        );
      }
    } else {
      await addToCart(
        {
          productId: product.productId,
          productName: product.productName,
          sellPrice: product.sellPrice,
          stock: product.stock,
          mainImg: product.mainImg,
        },
        null,
        1
      );
    }

    if (window.confirm("장바구니에 담았습니다.\n장바구니 페이지로 이동할까요?")) {
      router.push("/mypage/cart");
    }
  };

  /** 구매하기 */
  const handleBuyNow = () => {
    if (!user) return router.push("/login");
    if (product.isOption && selectedOptions.length === 0) return alert("옵션을 선택해주세요!");
    const orderInfo = {
      productId: product.productId,
      productName: product.productName,
      mainImg: product.mainImg,
      sellPrice: product.sellPrice,
      options: selectedOptions,
    };
    sessionStorage.setItem("checkoutData", JSON.stringify(orderInfo));
    router.push("/order/checkout");
  };

  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">

      {/* 카테고리 */}
      {product.categoryPath && (
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
          {product.categoryPath.split(">").map((cat, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span className="text-gray-600">{cat.trim()}</span>
              {idx < product.categoryPath.split(">").length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* 상품명 */}
      <h1 className="text-3xl font-bold text-black">{product.productName}</h1>

      {/* 가격 */}
      <div className="mb-6 text-center md:text-left space-y-1">
        {product.consumerPrice && product.consumerPrice > product.sellPrice && (
          <span className="text-red-500 text-lg font-semibold">
            {Math.round(
              ((product.consumerPrice - product.sellPrice) / product.consumerPrice) * 100
            )}
            % 할인
          </span>
        )}
        {product.consumerPrice && (
          <p className="text-gray-400 text-sm line-through">
            {product.consumerPrice.toLocaleString()}원
          </p>
        )}
        <p className="text-3xl font-bold text-black">{product.sellPrice?.toLocaleString()}원</p>
        <p className="text-gray-600 text-sm">재고: {product.stock}개</p>
      </div>

      {/* 옵션 선택 */}
      {product.isOption && product.options?.length && (
        <div className="mb-6 relative w-full" ref={dropdownRef}>
          <label className="block text-gray-700 mb-2 font-medium">옵션 선택</label>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full border border-gray-300 rounded-lg p-2 text-left bg-white hover:ring-2 hover:ring-black transition cursor-pointer"
          >
            {selectedOptions.length === 0
              ? "옵션 선택"
              : selectedOptions.map((o) => o.value).join(", ")}
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {product.options.map((opt) => (
                <li
                  key={opt.optionId}
                  onClick={() => handleSelectOption({ optionId: opt.optionId, value: opt.optionValue })}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedOptions.some((o) => o.optionId === opt.optionId) ? "bg-gray-200" : ""
                    }`}
                >
                  {opt.optionValue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 선택 옵션 */}
      <div className="flex flex-col gap-4 mb-6 w-full">
        {selectedOptions.map((item) => (
          <div
            key={item.optionId}
            className="border p-4 rounded-xl shadow flex justify-between items-center w-full bg-white"
          >
            <div className="flex-1">
              <p className="font-medium text-black">{item.value}</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() =>
                    setSelectedOptions((prev) =>
                      prev.map((p) =>
                        p.optionId === item.optionId ? { ...p, count: Math.max(1, p.count - 1) } : p
                      )
                    )
                  }
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-black">{item.count}</span>
                <button
                  onClick={() =>
                    setSelectedOptions((prev) =>
                      prev.map((p) =>
                        p.optionId === item.optionId ? { ...p, count: p.count + 1 } : p
                      )
                    )
                  }
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedOptions((prev) => prev.filter((p) => p.optionId !== item.optionId))}
              className="text-gray-400 hover:text-black transition ml-4"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 p-2 border rounded-lg w-full md:w-auto transition cursor-pointer ${isLiked ? "bg-rose-50 border-rose-300" : "bg-white border-gray-300"} hover:ring-2 hover:ring-black`}
        >
          <Heart className={`w-7 h-7 ${isLiked ? "fill-rose-500 stroke-rose-500" : "stroke-gray-400"}`} />
          <span className={`text-base font-medium ${isLiked ? "text-rose-500" : "text-gray-500"}`}>
            {likesCount}
          </span>
        </button>

        <button
          onClick={handleAddToCart}
          className="flex-1 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition cursor-pointer"
        >
          장바구니
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition cursor-pointer"
        >
          구매하기
        </button>
      </div>
    </div>
  );
}
