"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_name: string;
}

export default function Header() {
  const [keyword, setKeyword] = useState<string>("");
  const [user, setUser] = useState<User | null>(null); // 로그인 여부
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  // 검색 처리
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword) return;
    router.push(`/search?keyword=${keyword}`);
  };

  return (
    <header className="w-full h-16 bg-gray-900 text-white flex justify-between items-center px-6 shadow-md relative">
      {/* 로고 */}
      <div className="text-xl font-bold">
        <Link href="/">E-Commerce</Link>
      </div>

      {/* 검색 박스 */}
      <div className="flex-1 mx-4">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-2 rounded-full placeholder:text-gray-400 text-transparent text-center focus:outline-none"
          />
        </form>
      </div>

      {/* 사용자 메뉴 + 햄버거 */}
      <div className="flex items-center gap-4">
        {/* 데스크탑용 사용자 메뉴 */}
        <ul className="hidden md:flex gap-3 items-center">
          {user === null ? (
            <>
              <li>
                <Link href="/userLogin" className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">
                  로그인
                </Link>
              </li>
              <li>
                <Link href="/userJoin" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 transition">
                  회원가입
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="px-3 py-1">{user.user_name}님</li>
              <li>
                <Link href="/logout" className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">
                  로그아웃
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden relative">
          <button
            className="flex flex-col justify-between w-6 h-6 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block h-0.5 bg-white w-full transition-transform ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-white w-full transition-opacity ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-white w-full transition-transform ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>

          {/* 메뉴 슬라이드 */}
          <div
            className={`absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white rounded shadow-lg flex flex-col overflow-hidden origin-top transform transition-transform duration-300 ${
              menuOpen ? "scale-y-100" : "scale-y-0"
            }`}
          >
            <Link href="/category/1" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
              카테고리
            </Link>
            {user && (
              <>
                <Link href="/myPage?pageNum=1" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
                  마이페이지
                </Link>
                <Link href="/qnalist" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
                  문의사항
                </Link>
              </>
            )}
            <Link href="/ownerLogin" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
              사업주
            </Link>
            <Link href="/adminLogin" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
              관리자
            </Link>

            {/* 모바일용 로그인/회원가입 */}
            {user === null && (
              <>
                <Link href="/userLogin" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
                  로그인
                </Link>
                <Link href="/userJoin" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
                  회원가입
                </Link>
              </>
            )}
            {user !== null && (
              <Link href="/logout" className="px-4 py-2 hover:bg-gray-700" onClick={() => setMenuOpen(false)}>
                로그아웃
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
