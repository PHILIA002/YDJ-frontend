"use client";

import { useUser } from "./UserContext";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // ★ 세션 쿠키 항상 포함

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useUser();

  /** 관리자면 즉시 차단 (장바구니 기능 전부 비활성화) */
  const isAdmin = user?.role === "ADMIN";

  /** -------------------------
   *  장바구니 조회
   --------------------------*/
  function loadCart() {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .get("http://localhost:8080/api/cart")
      .then((res) => {
        setCart(res.data.items || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setCart([]);
          return;
        }
        console.error("장바구니 조회 실패:", err);
      });
  }

  /** -------------------------
   *  장바구니 담기
   --------------------------*/
  function addToCart(productId: number, optionId: number | null, quantity: number) {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .post("http://localhost:8080/api/cart", { productId, optionId, quantity })
      .then(() => loadCart())
      .catch((err) => console.error("장바구니 담기 실패:", err));
  }

  /** -------------------------
   *  수량 변경
   --------------------------*/
  function updateQuantity(cartId: number, quantity: number) {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .put("http://localhost:8080/api/cart/quantity", { cartId, quantity })
      .then(() => loadCart())
      .catch((err) => console.error("수량 변경 실패:", err));
  }

  /** -------------------------
   *  옵션 변경
   --------------------------*/
  function changeOption(cartId: number, newOptionId: number) {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .put("http://localhost:8080/api/cart/option", { cartId, newOptionId })
      .then(() => loadCart())
      .catch((err) => console.error("옵션 변경 실패:", err));
  }

  /** -------------------------
   *  항목 삭제
   --------------------------*/
  function deleteItem(cartId: number) {
    if (isAdmin) return; // 🔥 관리자 차단

    axios
      .delete(`http://localhost:8080/api/cart/${cartId}`)
      .then(() => loadCart())
      .catch((err) => console.error("장바구니 삭제 실패:", err));
  }

  /** 로그인하면 장바구니 자동 로드 */
  useEffect(() => {
    if (!user) return;
    if (isAdmin) return; 

    loadCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loadCart,
        addToCart,
        updateQuantity,
        changeOption,
        deleteItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
