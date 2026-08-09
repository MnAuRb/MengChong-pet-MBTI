"use client";

import { motion } from "framer-motion";
import { usePetContext } from "@/contexts/PetContext";
import { FIRST_POLES, SECOND_POLES } from "@/lib/mbti-utils";
import { getMbtiGroup, MBTI_GROUP_COLORS } from "@/lib/mbti-group";
import type { Dimension, DimensionScore } from "@/types";

const DIMENSION_LABELS: Record<Dimension, string> = {
  EI: "外向 (E) vs 内向 (I)",
  SN: "感觉 (S) vs 直觉 (N)",
  TF: "思考 (T) vs 情感 (F)",
  JP: "判断 (J) vs 感知 (P)",
};

function confidencePercent(score: DimensionScore): number {
  return Math.round(score.confidence * 100);
}

export default function DimensionCard() {
  const { resultType, dimensionScores } = usePetContext();

  if (!resultType || !dimensionScores) return null;

  const group = getMbtiGroup(resultType);
  const g = MBTI_GROUP_COLORS[group];

  const scoreEntries = Object.entries(dimensionScores) as [
    Dimension,
    DimensionScore,
  ][];

  return (
    <div className="bg-brand-surface rounded-xl shadow-card p-5 lg:p-6">
      <h3 className="text-lg font-semibold leading-[1.4] text-brand-text mb-4">
        性格维度分析
      </h3>
      <div className="flex flex-col">
        {scoreEntries.map(([dim, score]) => (
          <div
            key={dim}
            className="flex flex-col gap-1.5 py-3 border-b border-brand-border last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-normal text-brand-text">
                {DIMENSION_LABELS[dim]}
              </span>
              <span className="text-sm text-brand-muted font-normal">
                {score.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs w-5 text-right font-normal ${
                  score.dominantPole === FIRST_POLES[dim]
                    ? "text-brand-text"
                    : "text-brand-muted"
                }`}
              >
                {FIRST_POLES[dim]}
              </span>
              <div className="flex-1 h-1.5 bg-brand-surface-alt rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercent(score)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: g.primaryHex,
                    opacity:
                      score.confidence >= 0.75
                        ? 1
                        : score.confidence >= 0.5
                          ? 0.7
                          : score.confidence >= 0.25
                            ? 0.4
                            : 0.2,
                  }}
                />
              </div>
              <span
                className={`text-xs w-5 font-normal ${
                  score.dominantPole === SECOND_POLES[dim]
                    ? "text-brand-text"
                    : "text-brand-muted"
                }`}
              >
                {SECOND_POLES[dim]}
              </span>
            </div>
            <span className="text-[10px] text-brand-muted self-end font-normal">
              置信度 {Math.round(score.confidence * 100)}% ·{" "}
              {score.preferenceStrength}偏好
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
