"use client";

import { usePetContext } from "@/contexts/PetContext";
import { dogResults } from "@/data/dog-results";
import { catResults } from "@/data/cat-results";
import { getMbtiGroup, MBTI_GROUP_COLORS } from "@/lib/mbti-group";

export default function AdviceCard() {
  const { petInfo, resultType } = usePetContext();

  if (!resultType || !petInfo) return null;

  const resultMap = petInfo.type === "cat" ? catResults : dogResults;
  const result = resultMap[resultType];
  if (!result) return null;

  const group = getMbtiGroup(resultType);
  const g = MBTI_GROUP_COLORS[group];

  return (
    <div className="bg-brand-surface rounded-xl shadow-card p-5 lg:p-6">
      <h3 className="text-lg font-semibold leading-[1.4] text-brand-text mb-3">
        给主人的建议
      </h3>
      <p
        className={`text-sm text-brand-text leading-relaxed font-normal rounded-lg px-4 py-3 border border-brand-border`}
        style={{ backgroundColor: `${g.primaryHex}10` }}
      >
        {result.advice}
      </p>
    </div>
  );
}
