/**
 * Confidence indicators for test results.
 *
 * Computes overall confidence, dimension-level confidence,
 * answer consistency checks, and extreme-answer detection.
 *
 * Reference: PRD §3.4, §3.5
 */

import type {
  CatItem,
  ItemResponse,
  ConfidenceIndicators,
  DimensionConfidence,
  OverallConfidence,
  TestVersion,
} from "./types";

/**
 * Compute dimension-level confidence based on z-score distance from midline.
 *
 * |z| < 0.3  → "较模糊" (fuzzy — near the boundary)
 * 0.3 ≤ |z| < 0.7 → "较明确" (fairly clear)
 * |z| ≥ 0.7  → "非常明确" (very clear)
 *
 * Reference: PRD §3.4
 */
export function computeDimensionConfidence(
  zScore: number
): DimensionConfidence {
  const absZ = Math.abs(zScore);
  if (absZ < 0.3) return "较模糊";
  if (absZ < 0.7) return "较明确";
  return "非常明确";
}

/**
 * Check if all responses have the same score (all-1 or all-5).
 *
 * This pattern suggests the user may not have carefully answered each item.
 */
export function detectAllSameAnswers(
  responses: readonly ItemResponse[]
): boolean {
  if (responses.length === 0) return false;
  const firstScore = responses[0]!.score;
  return responses.every((r) => r.score === firstScore);
}

/**
 * Check response consistency within a dimension.
 *
 * A logically contradictory pattern is when both positive and negative
 * items for the same dimension both get high scores (or both get low scores).
 *
 * For example: "Insecure" (positive, scored 5) + "Trusting" (negative, scored 5)
 * → logically inconsistent because the adjusted scores would be [5, 1],
 * suggesting the user didn't read carefully or misunderstood the items.
 *
 * Returns severity level:
 *   'consistent'        — no significant contradiction
 *   'partial_conflict'  — some contradiction detected (1 dimension)
 *   'severe_conflict'   — ≥2 dimensions have contradictions
 */
export function checkConsistency(
  items: readonly CatItem[],
  responses: readonly ItemResponse[]
): "consistent" | "partial_conflict" | "severe_conflict" {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.score]));

  // Group items by dimension
  const dimensionItems = new Map<string, CatItem[]>();
  for (const item of items) {
    const list = dimensionItems.get(item.dimension);
    if (list) {
      list.push(item);
    } else {
      dimensionItems.set(item.dimension, [item]);
    }
  }

  let conflictedDimensions = 0;

  for (const [, dimItems] of dimensionItems) {
    const positiveItems = dimItems.filter((i) => i.direction === "+");
    const negativeItems = dimItems.filter((i) => i.direction === "-");

    // Need at least one of each to check consistency
    if (positiveItems.length === 0 || negativeItems.length === 0) continue;

    // Calculate mean adjusted score for positive and negative items
    const posScores = positiveItems
      .map((i) => responseMap.get(i.id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);
    const negScores = negativeItems
      .map((i) => responseMap.get(i.id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);

    if (posScores.length === 0 || negScores.length === 0) continue;

    const posMean = posScores.reduce((a, b) => a + b, 0) / posScores.length;
    const negMean = negScores.reduce((a, b) => a + b, 0) / negScores.length;

    // Contradiction: both positive and negative items rated similarly
    if ((posMean >= 4 && negMean >= 4) || (posMean <= 2 && negMean <= 2)) {
      conflictedDimensions++;
    }
  }

  if (conflictedDimensions >= 2) return "severe_conflict";
  if (conflictedDimensions >= 1) return "partial_conflict";
  return "consistent";
}

/**
 * Baseline confidence reference by test version.
 *
 * Based on Spearman-Brown prophecy from paper's Cronbach's α.
 * Quick: ~60-70%, Standard: ~75-85%, Professional: ~85-95%
 */
export function versionBaselineConfidence(version: TestVersion): number {
  switch (version) {
    case "quick":
      return 0.65;
    case "standard":
      return 0.8;
    case "professional":
      return 0.9;
  }
}

/**
 * Compute overall confidence level.
 *
 * Factors:
 * - Base confidence from version (Quick/Standard/Professional)
 * - Downgraded if consistency issues detected
 * - Marked as "低" if all same answers
 */
export function computeOverallConfidence(
  version: TestVersion,
  consistency: "consistent" | "partial_conflict" | "severe_conflict",
  hasAllSame: boolean
): OverallConfidence {
  // All-same answers is the strongest signal of unreliable data
  if (hasAllSame) return "低";

  const base = versionBaselineConfidence(version);

  // Downgrade for consistency issues
  let adjusted = base;
  if (consistency === "severe_conflict") {
    adjusted -= 0.3;
  } else if (consistency === "partial_conflict") {
    adjusted -= 0.15;
  }

  if (adjusted < 0.5) return "低";
  if (adjusted < 0.7) return "中";
  if (adjusted < 0.85) return "较高";
  return "高";
}

/**
 * Build full confidence indicators for a test result.
 */
export function buildConfidenceIndicators(
  version: TestVersion,
  items: readonly CatItem[],
  responses: readonly ItemResponse[]
): ConfidenceIndicators {
  const consistency = checkConsistency(items, responses);
  const hasAllSame = detectAllSameAnswers(responses);
  const overall = computeOverallConfidence(version, consistency, hasAllSame);

  return {
    overall,
    consistency,
    hasAllSameAnswers: hasAllSame,
  };
}
