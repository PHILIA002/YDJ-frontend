"use client";

import { useState } from "react";

interface CategoryTreeProps {
  data: any;
  onSelect?: (id: string) => void;
  mode?: "compact" | "admin";
}

export default function CategoryTree({
  data,
  onSelect,
  mode = "admin",
}: CategoryTreeProps) {

  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  // ⭐ data null 체크 (필수!)
  if (!data) {
    return (
      <div className="p-4 text-sm text-gray-500">
        카테고리를 불러오는 중...
      </div>
    );
  }

  const isCompact = mode === "compact";

  const style = {
    main: isCompact
      ? "px-4 py-2 font-semibold hover:bg-gray-100 text-sm"
      : "px-4 py-3 font-bold hover:bg-gray-100 text-base",

    sub: isCompact
      ? "px-5 py-1 text-sm hover:bg-gray-100"
      : "px-6 py-2 text-sm hover:bg-gray-100",

    leaf: isCompact
      ? "ml-6 px-5 py-1 text-sm text-gray-600 hover:text-black hover:bg-gray-100 block"
      : "ml-8 px-5 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer text-sm",
  };

  return (
    <div
      className={
        isCompact
          ? "w-full h-full overflow-y-auto"
          : "w-full bg-gray-50 rounded-xl p-4 h-[500px] overflow-y-auto shadow"
      }
    >
      {/* 🔥 data null이 아님이 확실한 이후 렌더링 시작 */}
      {Object.entries(data).map(([mainCode, mainData]: any) => (
        <div key={mainCode}>
          <button
            onClick={() =>
              setOpenMain(openMain === mainCode ? null : mainCode)
            }
            className={`${style.main} w-full text-left`}
          >
            {mainData.title}
          </button>

          {openMain === mainCode &&
            Object.entries(mainData.children).map(
              ([subCode, subData]: any) => (
                <div key={subCode} className="ml-2">
                  <button
                    onClick={() =>
                      setOpenSub(openSub === subCode ? null : subCode)
                    }
                    className={`${style.sub} w-full text-left`}
                  >
                    {subData.title}
                  </button>

                  {openSub === subCode &&
                    Object.entries(subData.children).map(
                      ([leafCode, leafName]: any) => (
                        <div
                          key={leafCode}
                          onClick={() => onSelect && onSelect(leafCode)}
                          className={style.leaf}
                        >
                          {leafName}
                        </div>
                      )
                    )}
                </div>
              )
            )}
        </div>
      ))}
    </div>
  );
}
