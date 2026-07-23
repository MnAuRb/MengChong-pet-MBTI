"use client";

import Link from "next/link";
import { usePetContext } from "@/contexts/PetContext";
import ResultCard from "@/components/result/ResultCard";
import TrackPageView from "@/components/TrackPageView";
import { track } from "@/lib/analytics";

export default function ResultPage() {
  const { resultType, petInfo } = usePetContext();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex flex-col px-6 py-8 gap-6">
        <TrackPageView event="page_view_result" />

        {/* 可滚动结果卡片 */}
        <ResultCard />

        {/* 操作按钮 */}
        {resultType && (
          <div className="flex flex-col gap-3 pb-8">
            <Link
              href="/share"
              onClick={() =>
                track("click_share", {
                  pet_type: petInfo?.type,
                  mbti_type: resultType,
                })
              }
              className="bg-warm hover:bg-warm-600 text-white font-bold
                         py-4 px-8 rounded-button w-full text-center text-lg
                         transition-colors shadow-lg shadow-warm/25"
            >
              📤 生成分享海报
            </Link>

            <Link
              href="/"
              onClick={() => track("click_retest")}
              className="bg-white hover:bg-warm-light text-warm font-bold
                         py-3 px-8 rounded-button w-full text-center
                         border-2 border-warm transition-colors"
            >
              🔄 再测一次
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
