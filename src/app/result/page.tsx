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
      <div className="flex flex-col px-6 py-8 gap-6 lg:px-12 lg:py-10">
        <TrackPageView event="page_view_result" />

        <ResultCard />

        {/* 操作按钮 */}
        {resultType && (
          <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:gap-4 lg:max-w-xl lg:mx-auto lg:w-full">
            <Link
              href="/share"
              onClick={() =>
                track("click_share", {
                  pet_type: petInfo?.type,
                  mbti_type: resultType,
                })
              }
              className="rounded-full bg-brand-primary hover:bg-brand-text text-white
                         text-sm font-medium py-3.5 px-10 w-full sm:flex-1 text-center
                         transition-colors"
            >
              生成分享海报
            </Link>

            <Link
              href="/"
              onClick={() => track("click_retest")}
              className="rounded-full border-2 border-brand-primary text-brand-primary
                         hover:bg-brand-primary/25 hover:border-brand-text hover:text-brand-text
                         text-sm font-medium
                         py-3 px-8 w-full sm:flex-1 text-center
                         transition-colors"
            >
              再测一次
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
