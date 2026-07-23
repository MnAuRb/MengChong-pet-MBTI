"use client";

import { motion } from "framer-motion";
import { usePetContext } from "@/contexts/PetContext";
import { results } from "@/data/results";
import Link from "next/link";

export default function ResultCard() {
  const { petInfo, resultType } = usePetContext();

  if (!resultType || !petInfo) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-warm-400">未找到结果，请先完成测试</p>
        <Link href="/" className="text-warm font-medium underline py-3 min-h-[44px] flex items-center">
          返回首页
        </Link>
      </div>
    );
  }

  const result = results[resultType];
  if (!result) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-warm-400">结果数据异常</p>
        <Link href="/" className="text-warm font-medium underline py-3 min-h-[44px] flex items-center">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-5 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3:4 图片占位框 */}
      <div
        className="relative w-full bg-warm-light rounded-card shadow-sm
                   flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: "3 / 4" }}
      >
        <div className="flex flex-col items-center gap-2 text-center p-6">
          <span className="text-6xl">
            {petInfo.type === "cat" ? "🐱" : petInfo.type === "dog" ? "🐕" : "🐹"}
          </span>
          <p className="text-warm-400 text-sm">
            海报预览区
          </p>
        </div>
      </div>

      {/* 头部：名字 + 人格类型 */}
      <div className="text-center">
        <p className="text-warm-500 text-sm mb-1">
          {petInfo.name}是……
        </p>
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
