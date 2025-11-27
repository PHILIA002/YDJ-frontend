"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  // 카카오 주소 검색 스크립트 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSearchAddress = () => {
    if (!(window as any).daum?.Postcode) {
      alert("주소 검색 기능 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new (window as any).daum.Postcode({
      oncomplete: (data: any) => {
        setAddress(data.address);
      },
    }).open();
  };

  // 회원가입 요청
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pw !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: pw,
          name,
          phone,
          address,
          addressDetail,
        }),
      });

      const result = await response.text();
      alert(result);

      if (result.includes("성공")) {
        router.push("/login");
      }
    } catch (error) {
      console.error("회원가입 중 오류:", error);
      alert("서버 연결 오류! 백엔드 실행 여부 확인하세요.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5] px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-10 shadow-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
          회원가입
        </h2>

        {/* 이름 */}
        <InputBox
          label="이름"
          value={name}
          onChange={setName}
          placeholder="이름을 입력하세요"
        />

        {/* 전화번호 */}
        <InputBox
          label="전화번호"
          value={phone}
          onChange={setPhone}
          placeholder="010-1234-5678"
        />

        {/* 이메일 */}
        <InputBox
          label="이메일"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="example@email.com"
        />

        {/* 비밀번호 */}
        <InputBox
          label="비밀번호"
          value={pw}
          onChange={setPw}
          type="password"
          placeholder="비밀번호 입력"
        />

        {/* 비밀번호 확인 */}
        <InputBox
          label="비밀번호 확인"
          value={pwCheck}
          onChange={setPwCheck}
          type="password"
          placeholder="비밀번호 재입력"
        />

        {/* 주소 */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">주소</label>

          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              readOnly
              placeholder="주소"
              className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-black outline-none"
            />

            <button
              type="button"
              onClick={handleSearchAddress}
              className="px-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800"
            >
              검색
            </button>
          </div>

          <input
            type="text"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            placeholder="상세주소 입력"
            className="w-full mt-3 p-3 border border-gray-300 rounded-lg text-black outline-none"
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full p-3 mt-2 text-center border border-black text-black rounded-lg font-medium 
                     hover:bg-black hover:text-white transition cursor-pointer"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

//////////////////////////////////////////////
// 🔹 인풋 UI 컴포넌트 (반복 줄이기)
//////////////////////////////////////////////
function InputBox({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-gray-600 text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg text-black outline-none focus:ring-[1.5px] ring-black"
      />
    </div>
  );
}
