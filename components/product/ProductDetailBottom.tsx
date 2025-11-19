"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductDetailBottom({ product }: any) {
  const [activeTab, setActiveTab] = useState("info");

  const infoRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ScrollSpy
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-150px 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveTab(e.target.id);
      });
    }, options);

    [infoRef, sizeRef, recommendRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const subImages = product.subImages || [];

  return (
    <div className="mt-20">

      {/* ----------------------------- */}
      {/* 상단 NAV 탭 */}
      {/* ----------------------------- */}
      <div className="sticky top-20 bg-white z-20 border-b py-3">
        <div className="flex gap-10 text-lg font-semibold px-4">

          <button
            className={activeTab === "info" ? "text-blue-600" : "text-gray-500"}
            onClick={() => scrollToSection(infoRef)}
          >
            정보
          </button>

          <button
            className={activeTab === "size" ? "text-blue-600" : "text-gray-500"}
            onClick={() => scrollToSection(sizeRef)}
          >
            사이즈
          </button>

          <button
            className={activeTab === "recommend" ? "text-blue-600" : "text-gray-500"}
            onClick={() => scrollToSection(recommendRef)}
          >
            추천
          </button>

        </div>
      </div>

      {/* ----------------------------- */}
      {/* 1. 정보 섹션 */}
      {/* ----------------------------- */}
      <section id="info" ref={infoRef} className="py-12 space-y-10">

        <div className="prose prose-lg max-w-none">
          <h2 className="font-bold text-2xl">제품 상세 정보</h2>

          <p>
            클래식한 골프 무드와 빈티지 아카데미 감성을 결합한
            **크림&그린 투톤 크루넥 스웻셔츠**입니다. 부드러운 코튼 소재를 사용하여
            데일리 웨어로 착용하기 좋으며, 1960년대 컨셉의
            아치 로고 자수가 포인트입니다.
          </p>

          <ul>
            <li>부드러운 터치감의 코튼-폴리 혼방 원단</li>
            <li>넥·소매·밑단 립 짜임으로 안정감 있는 착용감</li>
            <li>1960’s 빈티지 스포티 무드의 로고 자수 장식</li>
            <li>남녀 모두 착용 가능한 레귤러 핏</li>
          </ul>
        </div>

        {/* subImages[0] */}
        {subImages[0] && (
          <img src={subImages[0]} className="rounded-xl w-full" />
        )}

        {/* 추가 상세 설명 */}
        <div className="prose prose-lg max-w-none">
          <h3 className="font-bold">스타일링 포인트</h3>
          <p>
            같은 톤의 **캡, 양말 등과 함께 셋업 코디**하면 더욱 자연스러운
            빈티지-스포티 무드를 완성할 수 있습니다.  
            가벼운 골프 라운딩 또는 일상 캐주얼룩 어디에나 활용 가능합니다.
          </p>
        </div>

        {/* subImages[1] */}
        {subImages[1] && (
          <img src={subImages[1]} className="rounded-xl w-full" />
        )}

      </section>

      {/* ----------------------------- */}
      {/* 2. 사이즈 섹션 */}
      {/* ----------------------------- */}
      <section id="size" ref={sizeRef} className="py-12 space-y-10">

        <div className="prose prose-lg max-w-none">
          <h2 className="font-bold text-2xl">사이즈 정보</h2>

          <p>
            전체적으로 여유 있게 떨어지는 **레귤러 핏**입니다.  
            아래 실측을 참고하여 평소 착용하는 사이즈 기준으로 선택하면 됩니다.
          </p>

          <table>
            <thead>
              <tr>
                <th>사이즈</th>
                <th>가슴단면</th>
                <th>어깨</th>
                <th>총기장</th>
                <th>소매길이</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>M</td>
                <td>56cm</td>
                <td>48cm</td>
                <td>69cm</td>
                <td>61cm</td>
              </tr>
              <tr>
                <td>L</td>
                <td>58cm</td>
                <td>50cm</td>
                <td>71cm</td>
                <td>62cm</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>60cm</td>
                <td>52cm</td>
                <td>73cm</td>
                <td>63cm</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* subImages[2] */}
        {subImages[2] && (
          <img src={subImages[2]} className="rounded-xl w-full" />
        )}

      </section>

      {/* ----------------------------- */}
      {/* 3. 추천 섹션 */}
      {/* ----------------------------- */}
      <section id="recommend" ref={recommendRef} className="py-12 space-y-10">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-bold text-2xl">추천 상품</h2>
          <p>비슷한 무드의 스포티 클래식 캐주얼 아이템들입니다.</p>
        </div>

        {/* 추천 섹션에 subImages[3] 넣기 */}
        {subImages[3] && (
          <img src={subImages[3]} className="rounded-xl w-full" />
        )}
      </section>

    </div>
  );
}
