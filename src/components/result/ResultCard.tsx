"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePetContext } from "@/contexts/PetContext";
import { results as dogResults } from "@/data/results";
import { catResults } from "@/data/cat-results";
import { FIRST_POLES, SECOND_POLES } from "@/lib/mbti-calculator";
import Link from "next/link";
import type { Dimension, DimensionScore } from "@/types";

const PET_EMOJIS: Record<string, string> = {
  cat: "🐱",
  dog: "🐕",
  other: "🐹",
};

const DIMENSION_LABELS: Record<Dimension, string> = {
  EI: "外向(E) vs 内向(I)",
  SN: "感觉(S) vs 直觉(N)",
  TF: "思考(T) vs 情感(F)",
  JP: "判断(J) vs 感知(P)",
};

/** 置信度对应颜色条宽度百分比 */
function confidencePercent(score: DimensionScore): number {
  return Math.round(score.confidence * 100);
}

/** 置信度对应颜色 */
function confidenceColor(score: DimensionScore): string {
  if (score.confidence >= 0.75) return "bg-warm";
  if (score.confidence >= 0.5) return "bg-warm/70";
  if (score.confidence >= 0.25) return "bg-warm/40";
  return "bg-warm/20";
}

export default function ResultCard() {
  const { petInfo, resultType, dimensionScores } = usePetContext();
  const [imageError, setImageError] = useState(false);

  if (!resultType || !petInfo) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-warm-400">未找到结果，请先完成测试</p>
        <Link
          href="/"
          className="text-warm font-medium underline py-3 min-h-[44px] flex items-center"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const resultMap =
    petInfo.type === "cat" ? catResults : dogResults;
  const result = resultMap[resultType];
  if (!result) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-warm-400">结果数据异常</p>
        <Link
          href="/"
          className="text-warm font-medium underline py-3 min-h-[44px] flex items-center"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const scoreEntries = dimensionScores
    ? (Object.entries(dimensionScores) as [Dimension, DimensionScore][])
    : [];

  return (
    <motion.div
      className="flex flex-col gap-5 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 人格形象图 */}
      <div
        className="relative w-full rounded-card shadow-sm overflow-hidden bg-warm-light"
        style={{ aspectRatio: "1 / 1" }}
      >
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-6xl">
              {PET_EMOJIS[petInfo.type] ?? PET_EMOJIS.other}
            </span>
            <p className="text-warm-400 text-sm">海报预览区</p>
          </div>
        ) : (
          <Image
            src={`/images/personalities/${result.type}.png`}
            alt={`${result.type} ${result.nickname}`}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 480px"
            priority
            unoptimized
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* 头部：名字 + 人格类型 */}
      <div className="text-center">
        <p className="text-warm-500 text-sm mb-1">{petInfo.name}是……</p>
        <div className="bg-warm-light rounded-2xl px-6 py-5 shadow-sm">
          <h1 className="text-3xl font-bold text-warm-dark tracking-wider">
            {result.type}
          </h1>
          <p className="text-lg font-bold text-warm mt-1">{result.nickname}</p>
        </div>
      </div>

      {/* 金句 */}
      <div className="bg-white rounded-card px-5 py-4 shadow-sm border border-warm-200">
        <p className="text-lg font-medium text-warm-dark italic text-center">
          💬 &ldquo;{result.quote}&rdquo;
        </p>
      </div>

      {/* 维度得分分析 */}
      {scoreEntries.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-warm-500">📊 性格维度分析</h3>
          <div className="bg-white rounded-card px-4 py-3 shadow-sm border border-warm-200 flex flex-col gap-3">
            {scoreEntries.map(([dim, score]) => (
              <div key={dim} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-warm-500 font-medium">
                    {DIMENSION_LABELS[dim]}
                  </span>
                  <span className="text-warm-400">
                    {score.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* 左侧 pole */}
                  <span
                    className={`text-xs w-5 text-right ${
                      score.dominantPole === FIRST_POLES[dim]
                        ? "font-bold text-warm"
                        : "text-warm-400"
                    }`}
                  >
                    {FIRST_POLES[dim]}
                  </span>
                  {/* 置信度条 */}
                  <div className="flex-1 h-2 bg-warm-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidencePercent(score)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${confidenceColor(score)}`}
                    />
                  </div>
                  {/* 右侧 pole */}
                  <span
                    className={`text-xs w-5 ${
                      score.dominantPole === SECOND_POLES[dim]
                        ? "font-bold text-warm"
                        : "text-warm-400"
                    }`}
                  >
                    {SECOND_POLES[dim]}
                  </span>
                </div>
                {/* 偏好强度标签 */}
                <span className="text-[10px] text-warm-400 self-end">
                  置信度 {Math.round(score.confidence * 100)}% · {score.preferenceStrength}偏好
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 人格解读 */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-warm-500">📖 人格解读</h3>
        <p className="text-sm text-warm-dark leading-relaxed">
          {result.description}
        </p>
      </div>

      {/* 行为特点 */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-warm-500">🎯 行为特点</h3>
        <ul className="flex flex-col gap-1.5">
          {result.traits.map((trait, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-2 text-sm text-warm-dark"
            >
              <span className="text-warm mt-0.5">•</span>
              <span>{trait}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* 给主人的建议 */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-warm-500">💡 给主人的建议</h3>
        <p className="text-sm text-warm-dark leading-relaxed bg-warm-light rounded-card px-4 py-3">
          {result.advice}
        </p>
      </div>
    </motion.div>
  );
}
