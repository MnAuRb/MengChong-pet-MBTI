/**
 * Weighted-sum factor scoring for dog C-BARQ items.
 *
 * Implements DiStefano et al. (2009) weighted sum method, adapted for
 * the C-BARQ 0-4 Likert scale (Broseghini et al. 2023).
 *
 * Formula:
 *   rawScore_f = Σ loading_i × adjustedScore_i
 *
 * Where:
 *   adjustedScore_i = answer_i        (direction = "+")
 *   adjustedScore_i = 4 - answer_i    (direction = "-", reversal for 0-4 scale)
 *
 * All calculations are deterministic — same input always produces same output.
 */

import type { DogItem, DogItemResponse, DogFactorScore, CbarqFactor } from "./types";
import { DOG_NORM_PARAMS } from "./norm-params";

/**
 * Calculate a single item's adjusted score (applying reversal if needed).
 *
 * For negative-direction items on 0-4 scale:
 *   adjusted = 4 - rawScore
 */
export function adjustedDogScore(item: DogItem, rawScore: number): number {
  if (item.direction === "-") {
    return 4 - rawScore;
  }
  return rawScore;
}

/**
 * Calculate the weighted-sum raw score for a set of items on a C-BARQ factor.
 *
 * rawScore_f = Σ loading_i × adjustedScore_i
 *
 * @param items — items belonging to this factor
 * @param responses — user's responses (must include all items)
 * @throws Error if responses don't match items
 */
export function calculateDogRawScore(
  items: readonly DogItem[],
  responses: readonly DogItemResponse[]
): number {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.score]));

  let sum = 0;
  const missingIds: number[] = [];

  for (const item of items) {
    const score = responseMap.get(item.id);
    if (score === undefined) {
      missingIds.push(item.id);
      continue;
    }
    const adjusted = adjustedDogScore(item, score);
    sum += item.loading * adjusted;
  }

  if (missingIds.length > 0) {
    throw new Error(
      `缺少${missingIds.length}道题目的回答（题目ID: ${missingIds.join(", ")}），请完成后再查看结果`
    );
  }

  return sum;
}

/**
 * Calculate raw scores for all C-BARQ factors present in the items.
 *
 * @param items — all 25 items
 * @param responses — user's 25 responses
 * @returns array of factor scores with rawScore and zScore
 * @throws Error if calculation fails for any factor
 */
export function calculateAllDogFactorScores(
  items: readonly DogItem[],
  responses: readonly DogItemResponse[]
): readonly DogFactorScore[] {
  // Group items by C-BARQ factor
  const factorItems = new Map<CbarqFactor, DogItem[]>();
  for (const item of items) {
    const list = factorItems.get(item.cbarqFactor);
    if (list) {
      list.push(item);
    } else {
      factorItems.set(item.cbarqFactor, [item]);
    }
  }

  const scores: DogFactorScore[] = [];

  for (const [factor, dimItems] of factorItems) {
    const rawScore = calculateDogRawScore(dimItems, responses);

    const norm = DOG_NORM_PARAMS[factor];
    if (!norm) {
      throw new Error(`缺少因子 ${factor} 的常模参数`);
    }

    const zScore = (rawScore - norm.mean) / norm.stdDev;

    scores.push({
      factor,
      rawScore,
      zScore,
    });
  }

  return scores;
}
