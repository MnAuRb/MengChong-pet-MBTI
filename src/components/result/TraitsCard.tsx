"use client";

import { motion } from "framer-motion";
import { usePetContext } from "@/contexts/PetContext";
import { dogResults } from "@/data/dog-results";
import { catResults } from "@/data/cat-results";
import { getMbtiGroup, MBTI_GROUP_COLORS } from "@/lib/mbti-group";

export default function TraitsCard() {
  const { petInfo, resultType } = usePetContext();

  if (!resultType || !petInfo) return null;

  const resultMap = petInfo.type === "cat" ? catResults : dogResults;
  const result = resultMap[resultType];
  if (!result) return null;

  const group = getMbtiGroup(resultType);
  const g = MBTI_GROUP_COLORS[group];

  return (
    <div className="bg-brand-surface rounded-xl shadow-card p-5 lg:p-6">
      <h3 className="text-lg font-semibold leading-[1.4] text-brand-text mb-4">
        行为特点
      </h3>
      <div className="flex flex-col gap-3">
        {result.traits.map((trait, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-start gap-3"
          >
            <span
              className={`w-1 h-5 mt-0.5 rounded-full flex-shrink-0`}
              style={{ backgroundColor: g.primaryHex }}
            />
            <span className="text-sm text-brand-text font-normal">{trait}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
