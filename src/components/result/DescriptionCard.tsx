"use client";

import { usePetContext } from "@/contexts/PetContext";
import { dogResults } from "@/data/dog-results";
import { catResults } from "@/data/cat-results";

export default function DescriptionCard() {
  const { petInfo, resultType } = usePetContext();

  if (!resultType || !petInfo) return null;

  const resultMap = petInfo.type === "cat" ? catResults : dogResults;
  const result = resultMap[resultType];
  if (!result) return null;

  return (
    <div className="bg-brand-surface rounded-xl shadow-card p-5 lg:p-6">
      <h3 className="text-lg font-semibold leading-[1.4] text-brand-text mb-3">
        人格解读
      </h3>
      <p className="text-sm text-brand-text leading-relaxed font-normal">
        {result.description}
      </p>
    </div>
  );
}
