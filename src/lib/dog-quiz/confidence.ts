/**
 * Confidence indicators for dog MBTI test results.
 *
 * Mirrors the cat-quiz confidence system:
 *   - Dimension-level confidence based on |z| distance
 *   - All-same-answer detection
 *   - Consistency check within each MBTI dimension
 *   - Overall confidence from base rate + downgrades
 */

import type { DogItem, DogItemResponse, DogConfidenceIndicators, OverallConfidence } from "./types";
import type { Dimension } from "@/types";

/**
 * Check if all responses have the same score (all-0 or all-4).
 *
 * This pattern suggests the user may not have carefully answered each item.
 */
export function detectAllSameDogAnswers(
  responses: readonly DogItemResponse[]
): boolean {
  if (responses.length === 0) return false;
  const firstScore = responses[0]!.score;
  return responses.every((r) => r.score === firstScore);
}

/**
 * Check response consistency within each MBTI dimension.
 *
 * For each dimension, items pushing toward opposite poles should have
 * meaningfully different scores. If a user rates both E-direction and
 * I-direction items highly, or both lowly, the responses are contradictory.
 *
 * Returns:
 *   'consistent'        — no significant contradiction
 *   'partial_conflict'  — some contradiction detected (1 dimension)
 *   'severe_conflict'   — ≥2 dimensions have contradictions
 */
export function checkDogConsistency(
  items: readonly DogItem[],
  responses: readonly DogItemResponse[]
): "consistent" | "partial_conflict" | "severe_conflict" {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.score]));

  // Group items by MBTI dimension, then by pole direction
  const dimPoles = new Map<string, { pos: number[]; neg: number[] }>();

  for (const item of items) {
    if (!dimPoles.has(item.mbtiDimension)) {
      dimPoles.set(item.mbtiDimension, { pos: [], neg: [] });
    }
    const entry = dimPoles.get(item.mbtiDimension)!;

    const firstPoles: Record<string, string> = {
      EI: "E", SN: "N", TF: "F", JP: "P",
    };

    const score = responseMap.get(item.id);
    if (score === undefined) continue;

    if (item.pole === firstPoles[item.mbtiDimension]) {
      entry.pos.push(score);
    } else {
      entry.neg.push(score);
    }
  }

  let conflictedDimensions = 0;

  for (const [, poles] of dimPoles) {
    if (poles.pos.length === 0 || poles.neg.length === 0) continue;

    const posMean =
      poles.pos.reduce((a, b) => a + b, 0) / poles.pos.length;
    const negMean =
      poles.neg.reduce((a, b) => a + b, 0) / poles.neg.length;

    // Contradiction: both positive and negative pole items rated similarly
    // Both high (≥3) or both low (≤1) on 0-4 scale
    if ((posMean >= 3 && negMean >= 3) || (posMean <= 1 && negMean <= 1)) {
      conflictedDimensions++;
    }
  }

  if (conflictedDimensions >= 2) return "severe_conflict";
  if (conflictedDimensions >= 1) return "partial_conflict";
  return "consistent";
}

/** Baseline confidence for 25-item version based on C-BARQ mean alpha */
const BASELINE_CONFIDENCE = 0.78;

/**
 * Compute overall confidence level.
 *
 * Factors:
 * - Base confidence from test version (25 items → 0.78)
 * - Downgraded if consistency issues detected
 * - Marked as "低" if all same answers
 */
export function computeOverallDogConfidence(
  consistency: "consistent" | "partial_conflict" | "severe_conflict",
  hasAllSame: boolean
): OverallConfidence {
  if (hasAllSame) return "低";

  let adjusted = BASELINE_CONFIDENCE;
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
 * Build full confidence indicators for a dog test result.
 */
export function buildDogConfidenceIndicators(
  items: readonly DogItem[],
  responses: readonly DogItemResponse[]
): DogConfidenceIndicators {
  const consistency = checkDogConsistency(items, responses);
  const hasAllSame = detectAllSameDogAnswers(responses);
  const overall = computeOverallDogConfidence(consistency, hasAllSame);

  return {
    overall,
    consistency,
    hasAllSameAnswers: hasAllSame,
  };
}
