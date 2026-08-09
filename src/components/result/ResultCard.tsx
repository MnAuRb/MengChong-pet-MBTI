"use client";

import { motion } from "framer-motion";
import HeroCard from "./HeroCard";
import DimensionCard from "./DimensionCard";
import DescriptionCard from "./DescriptionCard";
import TraitsCard from "./TraitsCard";
import AdviceCard from "./AdviceCard";

export default function ResultCard() {
  return (
    <motion.div
      className="flex flex-col gap-4 w-full lg:grid lg:grid-cols-[40%_1fr] lg:gap-6 lg:items-start"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 左栏：形象卡片（桌面端 sticky） */}
      <div className="lg:sticky lg:top-6">
        <HeroCard />
      </div>

      {/* 右栏：维度 → 解读 → 特点 → 建议 */}
      <div className="flex flex-col gap-4">
        <DimensionCard />
        <DescriptionCard />
        <TraitsCard />
        <AdviceCard />
      </div>
    </motion.div>
  );
}
