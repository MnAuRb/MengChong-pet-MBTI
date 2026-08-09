"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePetContext } from "@/contexts/PetContext";
import { dogResults } from "@/data/dog-results";
import { catResults } from "@/data/cat-results";
import { getBreedSlug, getBreedImagePath } from "@/lib/breed-image";
import { getMbtiGroup, MBTI_GROUP_COLORS } from "@/lib/mbti-group";
import type { MBTIResult } from "@/types";

const PET_EMOJIS: Record<string, string> = {
  cat: "🐱",
  dog: "🐕",
  other: "🐹",
};

export default function HeroCard() {
  const { petInfo, resultType } = usePetContext();
  const [imageError, setImageError] = useState(false);

  if (!resultType || !petInfo) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 bg-brand-surface rounded-xl shadow-card p-6">
        <p className="text-brand-muted text-sm">未找到结果，请先完成测试</p>
        <Link
          href="/"
          className="text-brand-text font-normal underline underline-offset-4 py-3 min-h-[44px] flex items-center"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const resultMap = petInfo.type === "cat" ? catResults : dogResults;
  const result = resultMap[resultType];
  if (!result) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 bg-brand-surface rounded-xl shadow-card p-6">
        <p className="text-brand-muted text-sm">结果数据异常</p>
        <Link
          href="/"
          className="text-brand-text font-normal underline underline-offset-4 py-3 min-h-[44px] flex items-center"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const group = getMbtiGroup(resultType);
  const g = MBTI_GROUP_COLORS[group];

  const breedSlug = getBreedSlug(petInfo.breed, petInfo.type);
  const imagePath = breedSlug
    ? getBreedImagePath(breedSlug, result.type, petInfo.type)
    : null;

  return (
    <div className="bg-brand-surface rounded-xl shadow-card overflow-hidden">
      {/* 品种形象图 */}
      <div
        className="relative w-full bg-brand-surface-alt overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        {imagePath && !imageError ? (
          <Image
            src={imagePath}
            alt={`${petInfo.breed} ${result.type} ${result.nickname}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-6xl">
              {PET_EMOJIS[petInfo.type] ?? PET_EMOJIS.other}
            </span>
            <p className="text-brand-muted text-sm">品种形象加载中</p>
          </div>
        )}
      </div>

      {/* 身份 + 金句 */}
      <div className="flex flex-col gap-4 p-5 lg:p-6">
        {/* 头部：名字 + MBTI 类型 + 昵称 */}
        <div className="border-b border-brand-border pb-4">
          <p className="text-brand-muted text-sm mb-1.5 font-normal">
            {petInfo.name}是……
          </p>
          <h1
            className={`text-[36px] leading-[1.15] tracking-[-0.01em] font-bold ${g.typeText}`}
          >
            {result.type}
          </h1>
          <p className="text-base font-normal text-brand-muted mt-1.5">
            {result.nickname}
          </p>
        </div>

        {/* 金句 */}
        <div className={`border-l-2 ${g.accentBorder} pl-4`}>
          <p className="text-base lg:text-lg font-normal text-brand-text italic leading-relaxed">
            &ldquo;{result.quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
