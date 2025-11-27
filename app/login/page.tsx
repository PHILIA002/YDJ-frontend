"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import axios from "@/context/axiosConfig";

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  const { refreshUser } = useUser();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !pw) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email: id.trim(), password: pw.trim() }
      );

      await refreshUser();

      const me = response.data;

      if (me.role === "ADMIN") router.push("/admin/list");
      else router.push("/");

    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("존재하지 않는 사용자입니다.");
        return;
      }
      if (error.response?.status === 401) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      alert("서버 오류 또는 네트워크 오류");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* 제목 */}


        {/* 로그인 카드 */}
        <form
          onSubmit={handleLogin}
          className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white"
        >
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
            로그인
          </h1>
          
          {/* 아이디 */}
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디(이메일)"
            className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 mb-4 focus:ring-2 focus:ring-black outline-none"
          />

          {/* 비밀번호 */}
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 mb-6 focus:ring-2 focus:ring-black outline-none"
          />

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition cursor-pointer"
          >
            로그인
          </button>

          {/* 하단 링크 */}
          <div className="flex justify-between items-center mt-5 text-sm text-gray-500">
            <button
              type="button"
              onClick={() => router.push("#")}
              className="hover:text-black cursor-pointer"
            >
              비밀번호 찾기
            </button>
            <button
              type="button"
              onClick={() => router.push("/join")}
              className="hover:text-black cursor-pointer"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
