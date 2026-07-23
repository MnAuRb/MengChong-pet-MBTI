"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question, Pole } from "@/types";
import ProgressBar from "./ProgressBar";

interface Props {
  question: Question;
  currentIndex: number;
  totalCount: number;
  onAnswer: (pole: Pole) => void;
  onBack?: () => void;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalCount,
  onAnswer,
  onBack,
}: Props) {
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

          {/* 问题文字 */}
          <p className="text-lg font-medium text-warm-dark leading-relaxed">
            {question.text}
          </p>

          {/* 选项 */}
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <motion.button
                key={opt.pole}
                onClick={() => onAnswer(opt.pole)}
                whileTap={{ scale: 0.97 }}
                className="w-full text-left px-5 py-4 rounded-card border-2
                           border-warm-200 bg-white hover:border-warm hover:bg-warm-light
                           transition-colors text-base text-warm-dark leading-relaxed"
              >
                {opt.text}
              </motion.button>
            ))}
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
