"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PetInfo, Answer, MBTIType, Dimension, DimensionScore } from "@/types";

interface PetContextValue {
  petInfo: PetInfo | null;
  setPetInfo: (info: PetInfo) => void;
  answers: Answer[];
  setAnswers: (answers: Answer[]) => void;
  resultType: MBTIType | null;
  setResultType: (type: MBTIType) => void;
  dimensionScores: Record<Dimension, DimensionScore> | null;
  setDimensionScores: (scores: Record<Dimension, DimensionScore>) => void;
}

const PetContext = createContext<PetContextValue | null>(null);

export function PetProvider({ children }: { children: ReactNode }) {
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [resultType, setResultType] = useState<MBTIType | null>(null);
  const [dimensionScores, setDimensionScores] = useState<Record<
    Dimension,
    DimensionScore
  > | null>(null);

  return (
    <PetContext.Provider
      value={{
        petInfo,
        setPetInfo,
        answers,
        setAnswers,
        resultType,
        setResultType,
        dimensionScores,
        setDimensionScores,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePetContext(): PetContextValue {
  const ctx = useContext(PetContext);
  if (!ctx) {
    throw new Error("usePetContext must be used within a PetProvider");
  }
  return ctx;
}
