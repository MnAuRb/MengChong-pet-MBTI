"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePetContext } from "@/contexts/PetContext";
import PetInfoForm from "@/components/test/PetInfoForm";
import QuestionCard from "@/components/test/QuestionCard";
import { questions } from "@/data/questions";
import { track } from "@/lib/analytics";
import type { Pole, Answer } from "@/types";

type Step = "info" | "quiz";

export default function TestPage() {
  const router = useRouter();
  const { setAnswers, petInfo } = usePetContext();
  const [step, setStep] = useState<Step>("info");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Answer[]>([]);
  const testStartedRef = useRef(false);
  const testCompletedRef = useRef(false);

  function handleInfoNext() {
    setStep("quiz");
  }

  useEffect(() => {
    if (step === "quiz" && !testStartedRef.current) {
      testStartedRef.current = true;
      track("test_started", { pet_type: petInfo?.type });
    }
  }, [step, petInfo?.type]);

  function handleAnswer(pole: Pole) {
    const answer: Answer = {
      questionId: questions[currentIndex].id,
      selectedPole: pole,
    };

    const nextAnswers = [...localAnswers, answer];
    setLocalAnswers(nextAnswers);

    if (currentIndex < questions.length - 1) {
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

  return (
    <div className="flex flex-col flex-1 px-6 py-8">
      {step === "info" && <PetInfoForm onNext={handleInfoNext} />}

      {step === "quiz" && (
        <QuestionCard
          question={questions[currentIndex]}
          currentIndex={currentIndex}
          totalCount={questions.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
