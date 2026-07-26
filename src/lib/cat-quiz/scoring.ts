/**
 * Weighted-sum factor scoring algorithm.
 *
 * Implements DiStefano et al. (2009) weighted sum method.
 * Factor loadings from Litchfield et al. (2017) Table 3 (Varimax rotation).
 *
 * Formula (PRD §3.1):
 *   F_f = Σ |w_i| × r'_i
 *
 * Where:
 *   w_i  = factor loading for item i on dimension f
 *   r'_i = adjusted score:
 *          if w_i > 0 (positive item): r'_i = r_i
 *          if w_i < 0 (negative item): r'_i = 6 - r_i (5-point scale reversal)
 *
 * Adapted for 萌宠MBTI: Result<T> pattern replaced with throw/catch to match
 * the existing project's error handling convention.
 */

import type {
  CatItem,
  ItemResponse,
  CatDimensionScore,
  FelineFiveDimension,
} from "./types";
import { NORM_PARAMS } from "./norm-params";

/**
 * Calculate a single item's adjusted score (applying reversal if needed).
 *
 * For negative-loading items (direction === '-') on 5-point Likert:
 *   r'_i = 6 - r_i
 *
 * For positive-loading items (direction === '+'):
 *   r'_i = r_i  (no change)
 */
export function adjustedScore(item: CatItem, rawScore: number): number {
  if (item.direction === "-") {
    return 6 - rawScore;
  }
  return rawScore;
}

/**
 * Calculate the weighted-sum raw score for a set of items on a dimension.
 *
 * F_f = Σ loading_i × adjustedScore_i
 *
 * Uses absolute factor loadings as weights — all loadings are stored
 * as positive values in the item bank. Direction is handled via
 * adjustedScore().
 *
 * @throws Error if responses don't match items
 */
export function calculateRawScore(
  items: readonly CatItem[],
  responses: readonly ItemResponse[]
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
    const adjusted = adjustedScore(item, score);
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
 * Calculate the raw score with mean imputation for missing items.
 *
 * Fills missing items with the mean of the dimension's answered items,
 * then computes the weighted sum.
 *
 * @throws Error if no answers for a dimension at all
 */
export function calculateRawScoreWithImputation(
  items: readonly CatItem[],
  responses: readonly ItemResponse[]
): number {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.score]));
  const answeredScores: number[] = [];

  for (const item of items) {
    const score = responseMap.get(item.id);
    if (score !== undefined) {
      answeredScores.push(adjustedScore(item, score));
    }
  }

  if (answeredScores.length === 0) {
    throw new Error(
      `维度缺少所有回答（题目ID: ${items.map((i) => i.id).join(", ")}），无法计算得分`
    );
  }

  const meanAdjusted =
    answeredScores.reduce((sum, s) => sum + s, 0) / answeredScores.length;

  let sum = 0;
  for (const item of items) {
    const score = responseMap.get(item.id);
    const adjusted =
      score !== undefined ? adjustedScore(item, score) : meanAdjusted;
    sum += item.loading * adjusted;
  }

  return sum;
}

/**
 * Calculate raw scores for all 5 Feline Five dimensions.
 *
 * @param items — all items for this test version
 * @param responses — user's responses
 * @param useImputation — if true, fill missing with dimension mean
 * @throws Error if calculation fails for any dimension
 */
export function calculateAllDimensionScores(
  items: readonly CatItem[],
  responses: readonly ItemResponse[],
  useImputation: boolean
): readonly CatDimensionScore[] {
  const calcFn = useImputation
    ? calculateRawScoreWithImputation
    : calculateRawScore;

  // Group items by dimension
  const dimensionItems = new Map<FelineFiveDimension, CatItem[]>();
  for (const item of items) {
    const list = dimensionItems.get(item.dimension);
    if (list) {
      list.push(item);
    } else {
      dimensionItems.set(item.dimension, [item]);
    }
  }

  const scores: CatDimensionScore[] = [];

  for (const [dimension, dimItems] of dimensionItems) {
    const rawScore = calcFn(dimItems, responses);

    const norm = NORM_PARAMS[dimension];
    const zScore = (rawScore - norm.mean) / norm.stdDev;
    const classification = classifyZScore(zScore);

    scores.push({
      dimension,
      rawScore,
      zScore,
      classification,
    });
  }

  return scores;
}

/**
 * Three-tier classification per PRD §3.2:
 *   Low:    z < -0.5
 *   Typical: -0.5 ≤ z ≤ +0.5
 *   High:   z > +0.5
 */
export function classifyZScore(
  zScore: number
): "Low" | "Typical" | "High" {
  if (zScore < -0.5) return "Low";
  if (zScore > 0.5) return "High";
  return "Typical";
}
