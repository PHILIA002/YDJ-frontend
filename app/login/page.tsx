"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

export default function LoginPage() {
  console.log("[렌더링] LoginPage 컴포넌트 렌더링됨"); // ← 컴포넌트가 제대로 실행되는지

  const router = useRouter();
  const { setUser } = useUser();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[이벤트] handleLogin 실행됨"); // ← 버튼 클릭 시 실행 여부 확인

    if (!id || !pw) {
      alert("아이디와 비밀번호를 입력하세요.");
      console.log("[검증] 아이디 또는 비밀번호 없음");
      return;
    }

    try {
      console.log("[FETCH] 요청 준비됨", {
        email: id.trim(),
        password: pw.trim(),
      });

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include",
        body: JSON.stringify({
          email: id.trim(),
          password: pw.trim(),
        }),
      });

      console.log("[FETCH] 요청 보냄 → 응답 상태:", response.status); // ← fetch가 나갔는지, 응답 상태

      if (response.status === 404) {
        alert("존재하지 않는 사용자입니다.");
        return;
      }
      if (response.status === 401) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (!response.ok) {
        alert("서버 오류가 발생했습니다.");
        return;
      }

      const data = await response.json();
      console.log("[응답] 서버로부터 받은 유저 정보:", data);

      // localStorage에 저장
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      console.log("[로그인 완료] 유저 상태 저장됨 → Redirect 시작");

      if (data.role === "ADMIN") {
        router.push("/admin/list");
      } else {
        router.push("/");
      }

    } catch (error) {
      console.error("[ERROR] fetch 요청 중 오류 발생:", error);
      alert("서버 연결 오류 (백엔드 실행 여부 확인 필요)");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">로그인</h2>

        <input
          type="text"
          placeholder="아이디 (이메일)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="text-black p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-blue-500"
          required
          autoFocus
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="text-black p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-blue-500"
          required
        />

        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition cursor-pointer"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
