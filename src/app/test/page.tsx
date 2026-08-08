"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePetContext } from "@/contexts/PetContext";
import PetInfoForm from "@/components/test/PetInfoForm";
import QuestionCard from "@/components/test/QuestionCard";
import { questions as dogQuestions, catQuestions } from "@/data/questions";
import { track } from "@/lib/analytics";
import type { Answer } from "@/types";

type Step = "info" | "quiz";

export default function TestPage() {
  const router = useRouter();
  const { setAnswers, petInfo } = usePetContext();
  const [step, setStep] = useState<Step>("info");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Answer[]>([]);
  const testStartedRef = useRef(false);
  const testCompletedRef = useRef(false);

  // 根据宠物类型选择题目：猫用25题，狗/其他用20题
  const quizQuestions =
    petInfo?.type === "cat" ? catQuestions : dogQuestions;
  const totalCount = quizQuestions.length;

  function handleInfoNext() {
    setStep("quiz");
  }

  useEffect(() => {
    if (step === "quiz" && !testStartedRef.current) {
      testStartedRef.current = true;
      track("test_started", { pet_type: petInfo?.type });
    }
  }, [step, petInfo?.type]);

  function handleAnswer(value: number) {
    const answer: Answer = {
      questionId: quizQuestions[currentIndex].id,
      value,
    };

    const nextAnswers = [...localAnswers, answer];
    setLocalAnswers(nextAnswers);

    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (!testCompletedRef.current) {
      testCompletedRef.current = true;
      // 存到 sessionStorage 作为桥梁，避免 context setState + router.push 竞态
      sessionStorage.setItem("mbti_answers", JSON.stringify(nextAnswers));
      setAnswers(nextAnswers);
      track("test_completed", { pet_type: petInfo?.type });
      router.push("/loading");
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setLocalAnswers(localAnswers.slice(0, -1));
      setCurrentIndex(currentIndex - 1);
    }
  }

  // 当前题目是否已有答案（回退时恢复选择状态）
  const currentAnswer = localAnswers.find(
    (a) => a.questionId === quizQuestions[currentIndex]?.id
  );

  return (
    <div className="flex flex-col flex-1 px-6 py-8 lg:items-center">
      {step === "info" && (
        <div className="w-full lg:max-w-xl">
          <PetInfoForm onNext={handleInfoNext} />
        </div>
      )}

      {step === "quiz" && (
        <div className="w-full lg:max-w-2xl">
          <QuestionCard
            question={quizQuestions[currentIndex]}
            currentIndex={currentIndex}
            totalCount={totalCount}
            selectedValue={currentAnswer?.value}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
}
