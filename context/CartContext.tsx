"use client";

import { useUser } from "./UserContext";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import axios from "@/context/axiosConfig";

axios.defaults.withCredentials = true;

<<<<<<< HEAD
export interface CartItem {
=======
/** --------------------------------------
 * Debounce Utility (브라우저 환경 호환)
 * -------------------------------------- */
function debounce(callback: (...args: any[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

interface CartItem {
>>>>>>> main
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

export interface CartProduct {
  productId: number;
  productName: string;
  sellPrice: number;
  stock: number;
  mainImg?: string;
}

interface CartContextType {
  cart: CartItem[];
  initialLoading: boolean; 
  loadCart: () => void;
  addToCart: (product: CartProduct, optionId: number | null, quantity: number) => void;
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
  const [initialLoading, setInitialLoading] = useState(true);

<<<<<<< HEAD
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  /** 서버에서 장바구니 불러오기 */
  const loadCart = () => {
=======
  const API_URL = process.env.NEXT_PUBLIC_API_URL; 


  /** --------------------------------------
   * loadCart — 서버에서 장바구니 불러오기
   * 조건 적고 호출 최소화 (실무 패턴)
   * -------------------------------------- */
  const loadCart = useCallback(() => {
>>>>>>> main
    if (!user || !user.id || isAdmin) {
      setCart([]);
      setInitialLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/cart`)
<<<<<<< HEAD
      .then((res) => {
        const items = res.data.items || [];
        setCart(items);
        localStorage.setItem("cart", JSON.stringify(items));
      })
      .catch((err) => {
        console.error("장바구니 불러오기 실패:", err);
        setCart([]);
        localStorage.removeItem("cart");
      });
  };

  /** 장바구니에 추가 */
  const addToCart = async (product: CartProduct, optionId: number | null, quantity: number) => {
    if (!user || isAdmin) return;
=======
      .then((res) => setCart(res.data.items || []))
      .finally(() => {
        setInitialLoading(false);   // ← 페이지 첫 로딩만 종료
      });
  }, [user, isAdmin]);


  /** --------------------------------------
   * Debounced loadCart — 연타 대비 서버 요청 줄이기
   * -------------------------------------- */
  const debouncedLoadCart = useMemo(() => debounce(loadCart, 250), [loadCart]);

  /** --------------------------------------
   * Add to Cart
   * - 서버 요청 후 debouncedLoadCart만 호출
   * -------------------------------------- */
  function addToCart(productId: number, optionId: number | null, quantity: number) {
    if (isAdmin || !user) return;
>>>>>>> main

    setCart((prevCart) => {
      const index = prevCart.findIndex(
        (item) => item.productId === product.productId && item.option?.optionId === optionId
      );

      let newCart: CartItem[];
      if (index >= 0) {
        newCart = [...prevCart];
        newCart[index] = {
          ...newCart[index],
          quantity: newCart[index].quantity + quantity,
        };
      } else {
        newCart = [
          ...prevCart,
          {
            cartId: Date.now(), // 임시 ID
            productId: product.productId,
            productName: product.productName,
            thumbnail: product.mainImg || "",
            quantity,
            price: product.sellPrice,
            stock: product.stock,
            soldOut: product.stock === 0,
            option: optionId ? { optionId, optionType: "", optionTitle: null, optionValue: null } : null,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    // 서버 동기화
    try {
      await axios.post(`${API_URL}/api/cart`, { productId: product.productId, optionId, quantity });
      loadCart();
    } catch (err) {
      console.error("장바구니 담기 실패:", err);
    }
  };

  const updateQuantity = (cartId: number, quantity: number) => {
    if (!user || isAdmin) return;
    axios
<<<<<<< HEAD
      .put(`${API_URL}/api/cart/quantity`, { cartId, quantity })
      .then(() => loadCart())
      .catch((err) => console.error("수량 변경 실패:", err));
  };

  const changeOption = (cartId: number, newOptionId: number) => {
    if (!user || isAdmin) return;
    axios
      .put(`${API_URL}/api/cart/option`, { cartId, newOptionId })
      .then(() => loadCart())
      .catch((err) => console.error("옵션 변경 실패:", err));
  };
=======
      .post(`${API_URL}/api/cart`, { productId, optionId, quantity })
      .then(() => debouncedLoadCart())
      .catch((err) => console.error("장바구니 담기 실패:", err));
  }

  /** --------------------------------------
   * Update Quantity (optimis) UI + debounce)
   * -------------------------------------- */
  function updateQuantity(cartId: number, quantity: number) {
    if (isAdmin || !user) return;

    // UI 먼저 수정
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );

    // 서버 요청은 디바운스 적용
    axios
      .put(`${API_URL}/api/cart/quantity`, { cartId, quantity })
      .then(() => debouncedLoadCart());
  }

  /** --------------------------------------
   * Change Option (Optimistic UI + debounce)
   * -------------------------------------- */
  function changeOption(cartId: number, newOptionId: number) {
    if (isAdmin || !user) return;

    // // Optimistic UI 업데이트
    // setCart((prev) =>
    //   prev.map((item) => {
    //     if (item.cartId !== cartId) return item;

    //     return {
    //       ...item,
    //       option: item.option
    //         ? { ...item.option, optionId: newOptionId }
    //         : { optionId: newOptionId },
    //     };
    //   })
    // );

    // 서버 요청 (디바운스 적용)
    axios
      .put(`${API_URL}/api/cart/option`, { cartId, newOptionId })
      .then(() => debouncedLoadCart());
  }


  /** --------------------------------------
   * Delete Item
   * -------------------------------------- */
  function deleteItem(cartId: number) {
    if (isAdmin || !user) return;
>>>>>>> main

  const deleteItem = (cartId: number) => {
    if (!user || isAdmin) return;
    axios
      .delete(`${API_URL}/api/cart/${cartId}`)
<<<<<<< HEAD
      .then(() => loadCart())
      .catch((err) => console.error("아이템 삭제 실패:", err));
  };
=======
      .then(() => debouncedLoadCart());
  }
>>>>>>> main

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    if (user && !isAdmin) {
      axios.delete(`${API_URL}/api/cart`).catch((err) => console.error("장바구니 전체 삭제 실패:", err));
    }
  };

<<<<<<< HEAD
=======
  /** --------------------------------------
   * 로그인 상태 변화 감지하여 장바구니 로딩
   * -------------------------------------- */
>>>>>>> main
  useEffect(() => {
    if (!user || isAdmin) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }
    loadCart();
  }, [user, isAdmin, loadCart]);

  return (
    <CartContext.Provider
<<<<<<< HEAD
      value={{ cart, loadCart, addToCart, updateQuantity, changeOption, deleteItem, clearCart }}
=======
      value={{
        cart,
        initialLoading,  
        loadCart,
        addToCart,
        updateQuantity,
        changeOption,
        deleteItem,
        clearCart,
      }}
>>>>>>> main
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
