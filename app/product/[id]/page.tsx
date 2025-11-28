import ProductDetailClient from "./ProductDetailClient";

/**
 * 상품 상세 페이지의 서버 컴포넌트 (Next.js route page)
 *
 * 기능:
 * - URL 파라미터(params)에서 상품 ID 추출
 * - 클라이언트 컴포넌트(ProductDetailClient)에 전달
 *
 * 특징:
 * - 서버 컴포넌트 → SEO 유리
 * - 실제 상세 로직은 클라이언트 쪽에서 처리 (이미지 Preload, Like 처리 등)
 */
export default function ProductPage({ params }: any) {
  const { id } = params;  // 동적 라우트 /product/[id]에서 전달됨

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-12">
      <ProductDetailClient productId={id} />
    </div>
  );
}

