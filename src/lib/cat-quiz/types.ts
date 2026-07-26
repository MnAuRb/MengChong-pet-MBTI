/**
 * Core domain types for the Cat MBTI Assessment System.
 *
 * Adapted from cat_quiz for 萌宠MBTI project integration.
 * All types are traceable to Litchfield et al. (2017) "The Feline Five".
 *
 * Note: Result<T> pattern removed — this project uses throw/catch instead.
 */

// ─── Feline Five Dimensions ───────────────────────────────────────────

export type FelineFiveDimension =
  | "Neuroticism"
  | "Extraversion"
  | "Dominance"
  | "Impulsiveness"
  | "Agreeableness";

// ─── Questionnaire Item ───────────────────────────────────────────────

/** A single questionnaire item from the 48-item Feline Five battery */
export interface CatItem {
  /** Unique item identifier (1–48) */
  readonly id: number;
  /** Original English trait name (e.g. "Insecure") */
  readonly traitEn: string;
  /** Chinese trait name (e.g. "缺乏安全感") */
  readonly traitZh: string;
  /** Chinese behavioral definition from S1 Appendix */
  readonly definitionZh: string;
  /** Primary Feline Five dimension this item loads on */
  readonly dimension: FelineFiveDimension;
  /** Absolute factor loading from Table 3 (Varimax rotation) */
  readonly loading: number;
  /** Scoring direction: '+' = positive loading, '-' = negative loading */
  readonly direction: "+" | "-";
  /** Whether this item has a cross-loading ≥ .30 on another dimension */
  readonly isCrossLoading: boolean;
  /** Cross-loading dimension, if any */
  readonly crossLoadingDimension?: FelineFiveDimension;
  /** Cross-loading value, if any */
  readonly crossLoadingValue?: number;
  /** Included in Quick (10-item) version */
  readonly isQuick: boolean;
  /** Included in Standard (25-item) version */
  readonly isStandard: boolean;
}

// ─── User Responses ───────────────────────────────────────────────────

/** Likert scale values */
export type LikertScore = 1 | 2 | 3 | 4 | 5;

/** User's response to a single item */
export interface ItemResponse {
  readonly itemId: number;
  readonly score: LikertScore;
}

/** Test version identifiers */
export type TestVersion = "quick" | "standard" | "professional";

// ─── Scoring ──────────────────────────────────────────────────────────

/** Three-tier classification per PRD §3.2 */
export type Classification = "Low" | "Typical" | "High";

/** Computed score for one Feline Five dimension */
export interface CatDimensionScore {
  readonly dimension: FelineFiveDimension;
  /** Weighted-sum raw score (F_f) */
  readonly rawScore: number;
  /** z-score normalized against n=2,802 reference population */
  readonly zScore: number;
  /** Three-tier classification */
  readonly classification: Classification;
}

/** Norm parameters for one dimension (μ, σ from n=2,802) */
export interface NormParams {
  readonly mean: number;
  readonly stdDev: number;
}

// ─── MBTI Mapping ─────────────────────────────────────────────────────

/** MBTI dimension letters */
export type MbtiLetterEI = "E" | "I";
export type MbtiLetterSN = "S" | "N";
export type MbtiLetterTF = "T" | "F";
export type MbtiLetterJP = "J" | "P";

/** Standard 4-letter MBTI type code */
export type MbtiCode =
  `${MbtiLetterEI}${MbtiLetterSN}${MbtiLetterTF}${MbtiLetterJP}`;

/** Confidence level for a single MBTI dimension */
export type DimensionConfidence = "较模糊" | "较明确" | "非常明确";

/** One MBTI dimension result */
export interface MbtiDimensionResult {
  readonly zScore: number;
  readonly letter: string;
  readonly confidence: DimensionConfidence;
}

/** Full MBTI mapping output (4 dimensions) */
export interface MbtiMapping {
  readonly ei: MbtiDimensionResult;
  readonly sn: MbtiDimensionResult;
  readonly tf: MbtiDimensionResult;
  readonly jp: MbtiDimensionResult;
  readonly code: MbtiCode;
  readonly nameZh: string;
  readonly description: string;
}

// ─── Overall Confidence ───────────────────────────────────────────────

export type OverallConfidence = "低" | "中" | "较高" | "高";

export interface ConfidenceIndicators {
  readonly overall: OverallConfidence;
  readonly consistency: "consistent" | "partial_conflict" | "severe_conflict";
  readonly hasAllSameAnswers: boolean;
}

// ─── Feline Five dimension metadata ───────────────────────────────────

/** Per-dimension metadata from the paper */
export interface DimensionMeta {
  readonly name: FelineFiveDimension;
  readonly nameZh: string;
  readonly varianceExplainedBefore: number;
  readonly varianceExplainedAfter: number;
  readonly cronbachsAlpha: number;
  readonly itemCount: number;
}
