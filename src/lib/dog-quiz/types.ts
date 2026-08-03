/**
 * Core domain types for the Dog MBTI Assessment System.
 *
 * Based on Broseghini et al. (2023) C-BARQ Italian validation.
 * All types are traceable to the 13-factor C-BARQ structure.
 */

import type { Dimension, Pole } from "@/types";

// ─── C-BARQ Factors ────────────────────────────────────────────────────

/** The 12 validated C-BARQ factors used in our 25-item test + N_TYPE anchor */
export type CbarqFactor =
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F10"
  | "F11"
  | "F12"
  | "F13"
  | "N_TYPE";

/** Cronbach's alpha for each factor (from Table 2 of the paper) */
export const FACTOR_ALPHAS: Record<CbarqFactor, number> = {
  F1: 0.895,
  F2: 0.865,
  F3: 0.761,
  F4: 0.773,
  F5: 0.826,
  F6: 0.814,
  F7: 0.739,
  F8: 0.690,
  F10: 0.561,
  F11: 0.615,
  F12: 0.776,
  F13: 0.664,
  N_TYPE: 0.500, // Anchor item, conservative alpha
};

// ─── Questionnaire Item ─────────────────────────────────────────────────

/** A single C-BARQ item selected for the 25-item dog test */
export interface DogItem {
  /** C-BARQ original item number (1-100) */
  readonly id: number;
  /** C-BARQ factor this item belongs to */
  readonly cbarqFactor: CbarqFactor;
  /** Target MBTI dimension for mapping */
  readonly mbtiDimension: Dimension;
  /** Chinese behavioral description (pet-owner friendly) */
  readonly textZh: string;
  /** Factor loading from the Italian validation (Table 1), N_TYPE = 1.0 */
  readonly loading: number;
  /** Which MBTI pole this item's factor pushes toward */
  readonly pole: Pole;
  /** Scoring direction: '+' = higher answer → more of factor, '-' = reverse */
  readonly direction: "+" | "-";
}

// ─── User Responses ─────────────────────────────────────────────────────

/** Likert scale values for C-BARQ (0 = never, 4 = always) */
export type DogLikertScore = 0 | 1 | 2 | 3 | 4;

/** User's response to a single item */
export interface DogItemResponse {
  readonly itemId: number;
  readonly score: DogLikertScore;
}

// ─── Scoring ────────────────────────────────────────────────────────────

/** Computed score for one C-BARQ factor */
export interface DogFactorScore {
  readonly factor: CbarqFactor;
  /** Weighted-sum raw score: Σ(loading_i × adjustedScore_i) */
  readonly rawScore: number;
  /** z-score normalized against n=806 Italian reference population */
  readonly zScore: number;
}

// ─── MBTI Mapping ───────────────────────────────────────────────────────

/** Confidence level for a single MBTI dimension */
export type DimensionConfidence = "较模糊" | "较明确" | "非常明确";

/** One MBTI dimension result */
export interface MbtiDimensionResult {
  readonly zScore: number;
  readonly letter: string;
  readonly confidence: DimensionConfidence;
}

/** Full MBTI mapping output (4 dimensions) */
export interface DogMbtiMapping {
  readonly ei: MbtiDimensionResult;
  readonly sn: MbtiDimensionResult;
  readonly tf: MbtiDimensionResult;
  readonly jp: MbtiDimensionResult;
  readonly code: string;
}

// ─── Confidence ─────────────────────────────────────────────────────────

export type OverallConfidence = "低" | "中" | "较高" | "高";

export interface DogConfidenceIndicators {
  readonly overall: OverallConfidence;
  readonly consistency: "consistent" | "partial_conflict" | "severe_conflict";
  readonly hasAllSameAnswers: boolean;
}
