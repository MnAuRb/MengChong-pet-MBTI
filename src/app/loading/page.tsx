"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePetContext } from "@/contexts/PetContext";
import type { CalculateRequest, CalculateResponse, Answer } from "@/types";

const EMOJIS = ["🐱", "🐕", "🐹", "🐰", "🐻", "🦊", "🐼", "🐨"];
const MIN_DISPLAY_MS = 2500; // 最少展示 2.5 秒

export default function LoadingPage() {
  const router = useRouter();
  const { petInfo, answers, setResultType, setDimensionScores } =
    usePetContext();
  const calledRef = useRef(false);
  const mountTimeRef = useRef(0);

  // 每次进入页面重置
  useEffect(() => {
    calledRef.current = false;
    mountTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    async function calculate() {
      const startTime = mountTimeRef.current;

      try {
        let finalAnswers: Answer[] = answers;
        if (!finalAnswers || finalAnswers.length === 0) {
          const stored = sessionStorage.getItem("mbti_answers");
          if (stored) {
            finalAnswers = JSON.parse(stored) as Answer[];
          }
        }

        if (!finalAnswers || finalAnswers.length === 0) {
          throw new Error("答题数据不完整，请重新测试");
        }

        const expectedCount = petInfo?.type === "cat" ? 25 : 20;
        if (finalAnswers.length !== expectedCount) {
          throw new Error(
            `答题数据不完整（需要${expectedCount}题，收到${finalAnswers.length}题），请重新测试`
          );
        }

        const body: CalculateRequest = {
          answers: finalAnswers,
          petType: petInfo?.type,
        };
        const res = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error("计算失败");
        }

        const data = (await res.json()) as CalculateResponse;

        // 确保动画至少展示 2.5 秒
        const elapsed = Date.now() - startTime;
        const remaining = MIN_DISPLAY_MS - elapsed;
        if (remaining > 0) {
          await new Promise((r) => setTimeout(r, remaining));
        }

        setResultType(data.type);
        setDimensionScores(data.scores);
        sessionStorage.removeItem("mbti_answers");
        router.push("/result");
      } catch {
        sessionStorage.removeItem("mbti_answers");
        setTimeout(() => router.push("/"), 3000);
      }
    }

    // 立即开始计算，但用 Promise 保证最短展示时间
    calculate();
  }, [answers, router, setResultType, setDimensionScores, petInfo?.type]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 gap-8">
      <div className="relative w-24 h-24">
        {EMOJIS.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              x: [0, (i - 3.5) * 40, (i - 3.5) * 80],
              y: [0, -30, -60],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-warm-dark">
          正在分析你的毛孩子...
        </h2>
        <motion.div
          className="flex gap-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <span className="w-2 h-2 rounded-full bg-warm" />
          <span className="w-2 h-2 rounded-full bg-warm" />
          <span className="w-2 h-2 rounded-full bg-warm" />
        </motion.div>
      </motion.div>

      <p className="text-sm text-warm-400 text-center max-w-xs">
        性格分析、行为特征识别、专属人格匹配……
      </p>
    </div>
  );
}
