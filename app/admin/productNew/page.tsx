"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import ImageUpload from "../../ui/ImageUpload";

interface Product {
  productName: string;
  description?: string;
  mainImg?: string;
  consumerPrice?: number;
  sellPrice: number;
  stock: number;
}

export default function ProductCreatePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [product, setProduct] = useState<Product>({
    productName: "",
    description: "",
    mainImg: "",
    consumerPrice: 0,
    sellPrice: 0,
    stock: 0,
  });

  const handleChange = (field: keyof Product, value: any) => {
    setProduct({ ...product, [field]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("저장 실패");

      alert("상품이 등록되었습니다.");
      router.push("/admin/productList");
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 pb-4 border-b border-gray-200">
          상품 등록
        </h1>

        <div className="grid md:grid-cols-2 gap-10 mt-6">
          {/* 왼쪽: 이미지 업로드 */}
          <ImageUpload
            image={product.mainImg}
            onChange={(value) => handleChange("mainImg", value)}
          />

          {/* 오른쪽: 상품 정보 */}
          <div className="flex flex-col gap-6">
            <Input
              label="상품명"
              value={product.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              placeholder="상품명을 입력하세요"
            />
            <Textarea
              label="상품 설명"
              value={product.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="상품 설명을 입력하세요"
              rows={6}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="소비자가"
                type="number"
                value={product.consumerPrice || 0}
                onChange={(e) => handleChange("consumerPrice", Number(e.target.value))}
              />
              <Input
                label="판매가"
                type="number"
                value={product.sellPrice}
                onChange={(e) => handleChange("sellPrice", Number(e.target.value))}
              />
              <Input
                label="재고"
                type="number"
                value={product.stock}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
              />
            </div>

            {/* 저장 버튼: 이미지 영역 아래까지 확장 */}
            <Button className="w-full mt-4 md:mt-6 col-span-2" onClick={handleSave}>
              상품 등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
