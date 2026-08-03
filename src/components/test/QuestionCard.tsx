"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePetContext } from "@/contexts/PetContext";
import type { Question, LikertValue, DogLikertValue } from "@/types";
import ProgressBar from "./ProgressBar";

const CAT_LIKERT_OPTIONS: { value: number; label: string; emoji: string }[] = [
  { value: 1, label: "完全不符合", emoji: "😤" },
  { value: 2, label: "不太符合", emoji: "🤔" },
  { value: 3, label: "有时符合", emoji: "😐" },
  { value: 4, label: "比较符合", emoji: "😊" },
  { value: 5, label: "完全符合", emoji: "💕" },
];

const DOG_LIKERT_OPTIONS: { value: number; label: string; emoji: string }[] = [
  { value: 0, label: "从不", emoji: "🚫" },
  { value: 1, label: "很少", emoji: "🤔" },
  { value: 2, label: "有时", emoji: "😐" },
  { value: 3, label: "经常", emoji: "😊" },
  { value: 4, label: "总是", emoji: "💕" },
];

interface Props {
  question: Question;
  currentIndex: number;
  totalCount: number;
  selectedValue?: number;
  onAnswer: (value: number) => void;
  onBack?: () => void;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalCount,
  selectedValue,
  onAnswer,
  onBack,
}: Props) {
  const { petInfo } = usePetContext();
  const options = petInfo?.type === "cat" ? CAT_LIKERT_OPTIONS : DOG_LIKERT_OPTIONS;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 进度条 */}
      <ProgressBar current={currentIndex + 1} total={totalCount} />

      {/* 题目 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* 题号 */}
          <span className="text-sm font-medium text-warm-400">
            第 {currentIndex + 1}/{totalCount} 题
          </span>

          {/* 问题陈述 */}
          <div className="bg-warm-light rounded-card px-5 py-4">
            <p className="text-base font-medium text-warm-dark leading-relaxed">
              {question.text}
            </p>
          </div>

          {/* Likert 选项：猫 1-5 / 狗 0-4 */}
          <div className="flex flex-col gap-2.5">
            {options.map((opt) => {
              const isSelected = selectedValue === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => onAnswer(opt.value)}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-card
                    border-2 transition-all text-left min-h-[52px]
                    ${isSelected
                      ? "border-warm bg-warm-light shadow-sm"
                      : "border-warm-200 bg-white hover:border-warm hover:bg-warm-light/50"
                    }`}
                >
                  {/* 选中指示圆点 */}
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                      transition-colors
                      ${isSelected
                        ? "border-warm bg-warm"
                        : "border-warm-300 bg-white"
                      }`}
                  >
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </span>

                  {/* 标签文字 */}
                  <span className={`text-sm font-medium flex-1 ${isSelected ? "text-warm" : "text-warm-dark"}`}>
                    {opt.label}
                  </span>

                  {/* emoji */}
                  <span className="text-lg flex-shrink-0">{opt.emoji}</span>
                </motion.button>
              );
            })}
          </div>

          {/* 上一题按钮（第一题不显示） */}
          {onBack && currentIndex > 0 && (
            <button
              onClick={onBack}
              className="text-sm text-warm-500 hover:text-warm font-medium
                         py-3 text-center transition-colors self-center min-h-[44px]
                         flex items-center"
            >
              ← 返回上一题
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
