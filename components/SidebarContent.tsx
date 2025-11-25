"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryTree from "@/components/category/categoryTree";

interface SidebarContentProps {
  user: any;
  onClose: () => void;
}

export default function SidebarContent({ user, onClose }: SidebarContentProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [categoryTree, setCategoryTree] = useState<any>(null);

  useEffect(() => {
    async function loadTree() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/tree`);
      const data = await res.json();
      setCategoryTree(data.tree);
    }
    loadTree();
  }, []);


  return (
    <div className="w-full h-full flex flex-col">

      {/* 사이드바 사용자 */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">

        <div className="text-base font-semibold flex items-center gap-4">
          {user ? (
            <Link href="/mypage" onClick={onClose} className="hover:text-blue-500">
              {user.name}님
            </Link>
          ) : (
            <>
              <Link href="/login" onClick={onClose} className="flex items-center gap-1 text-gray-700 hover:text-black">
                <LogIn size={20} strokeWidth={1.75} />
                로그인
              </Link>

              <Link href="/signup" onClick={onClose} className="flex items-center gap-1 text-gray-700 hover:text-black">
                <UserPlus size={20} strokeWidth={1.75} />
                회원가입
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-5">
          <Link href="/wishlist" onClick={onClose}>
            <Heart size={22} strokeWidth={1.75} className="text-gray-600 hover:text-black" />
          </Link>

          <Link href="/cart" onClick={onClose}>
            <ShoppingCart size={22} strokeWidth={1.75} className="text-gray-600 hover:text-black" />
          </Link>
        </div>
      </div>

      {/* 검색 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-lg px-3">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="카테고리를 검색하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full px-2 py-2 outline-none text-sm"
          />
        </div>
      </div>

      {/* 카테고리 트리 (compact 모드) */}
      <div className="flex-1 overflow-y-auto py-2">
        <CategoryTree
          data={categoryTree}
          mode="compact"
          onSelect={(leafId) => {
            router.push(`/category/${leafId}`);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
