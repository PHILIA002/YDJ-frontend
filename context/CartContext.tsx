"use client";

import { useUser } from "./UserContext";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

interface CartItem {
  cartId: number;
  productId: number;
  productName: string;
  thumbnail: string;
  quantity: number;
  price: number;
  stock: number;
  soldOut: boolean;
  option?: {
    optionId: number;
    optionType: string;
    optionTitle: string | null;
    optionValue: string | null;
  } | null;
}

interface CartContextType {
  cart: CartItem[];
  loadCart: () => void;
  addToCart: (productId: number, optionId: number | null, quantity: number) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  changeOption: (cartId: number, newOptionId: number) => void;
  deleteItem: (cartId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useUser();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  /** 서버에서 장바구니 불러오기 */
  const loadCart = () => {
    if (!user || !user.id || isAdmin) {
      setCart([]);
      return;
    }

    axios
      .get("http://localhost:8080/api/cart")
      .then((res) => {
        const items = res.data.items || [];
        setCart(items);
        localStorage.setItem("cart", JSON.stringify(items)); // state 기준 localStorage 덮어쓰기
      })
      .catch((err) => {
        console.error("장바구니 불러오기 실패:", err);
        setCart([]);
        localStorage.removeItem("cart");
      });
  };

  /** 장바구니에 추가 */
  const addToCart = async (productId: number, optionId: number | null, quantity: number) => {
    if (!user || isAdmin) return;

    try {
      const res = await axios.post("http://localhost:8080/api/cart", { productId, optionId, quantity });
      if (res.data?.items) {
        setCart(res.data.items); // 서버에서 바로 받은 데이터로 상태 갱신
        localStorage.setItem("cart", JSON.stringify(res.data.items));
      } else {
        loadCart(); // 서버가 items를 안보낼 경우 fallback
      }
    } catch (err) {
      console.error("장바구니 담기 실패:", err);
    }
  };

  /** 수량 변경 */
  const updateQuantity = (cartId: number, quantity: number) => {
    if (!user || isAdmin) return;

    axios
      .put("http://localhost:8080/api/cart/quantity", { cartId, quantity })
      .then(() => loadCart())
      .catch((err) => console.error("수량 변경 실패:", err));
  };

  /** 옵션 변경 */
  const changeOption = (cartId: number, newOptionId: number) => {
    if (!user || isAdmin) return;

    axios
      .put("http://localhost:8080/api/cart/option", { cartId, newOptionId })
      .then(() => loadCart())
      .catch((err) => console.error("옵션 변경 실패:", err));
  };

  /** 항목 삭제 */
  const deleteItem = (cartId: number) => {
    if (!user || isAdmin) return;

    axios
      .delete(`http://localhost:8080/api/cart/${cartId}`)
      .then(() => loadCart())
      .catch((err) => console.error("아이템 삭제 실패:", err));
  };

  /** 장바구니 비우기 */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    // 서버에도 비우기 요청
    if (user && !isAdmin) {
      axios
        .delete("http://localhost:8080/api/cart")
        .catch((err) => console.error("장바구니 전체 삭제 실패:", err));
    }
  };

  /** 로그인/로그아웃 또는 role 변경 감지 */
  useEffect(() => {
    if (!user || !user.id || isAdmin) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }
    loadCart();
  }, [user?.id, isAdmin]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loadCart,
        addToCart,
        updateQuantity,
        changeOption,
        deleteItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
