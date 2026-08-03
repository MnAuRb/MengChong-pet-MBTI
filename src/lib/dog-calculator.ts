/**
 * Dog MBTI Calculator — orchestrator for the C-BARQ → MBTI pipeline.
 *
 * Mirrors cat-calculator.ts in structure but uses the dog-quiz/ module.
 *
 * Pipeline:
 *   answers → getDogItems()
 *          → calculateAllDogFactorScores()    [weighted-sum + z-score]
 *          → mapDogScoresToMbti()            [α-weighted mapping]
 *          → dogMbtiToDimensionScores()      [convert to project format]
 *          → { type, scores }
 */

import type { CalculateResponse, Dimension, DimensionScore } from "@/types";
import { getDogItems } from "./dog-quiz/items";
import { calculateAllDogFactorScores } from "./dog-quiz/scoring";
import { mapDogScoresToMbti, dogMbtiToDimensionScores } from "./dog-quiz/mbti-mapper";
import type { DogItemResponse, DogLikertScore } from "./dog-quiz/types";

/**
 * Calculate dog MBTI from raw 0-4 Likert answers.
 *
 * @param answers — 25 answers with C-BARQ item IDs and 0-4 scores
 * @returns CalculateResponse with 4-letter type and dimension scores
 */
export function calculateDogMBTI(
  answers: { questionId: number; value: number }[]
): CalculateResponse {
  const items = getDogItems();

  if (answers.length !== items.length) {
    throw new Error(
      `需要 ${items.length} 道题答案，收到 ${answers.length} 道`
    );
  }

  // Convert to dog-quiz types (0-4 validated by API route)
  const responses: DogItemResponse[] = answers.map((a) => ({
    itemId: a.questionId,
    score: a.value as DogLikertScore,
  }));

  // Layer 1: Factor-level weighted-sum scoring + z-score calibration
  const factorScores = calculateAllDogFactorScores(items, responses);

  // Layer 2: α-weighted factor → MBTI dimension mapping
  const mapping = mapDogScoresToMbti(factorScores);

  // Convert to project's shared DimensionScore format
  const scores = dogMbtiToDimensionScores(mapping);

  return {
    type: mapping.code as CalculateResponse["type"],
    scores,
  };
}
