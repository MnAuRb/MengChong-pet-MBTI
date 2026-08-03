/**
 * MBTI Mapping — C-BARQ factor scores → Dog MBTI 4 dimensions.
 *
 * Dual-layer architecture:
 *   Layer 1 (scientific): 12 C-BARQ factor z-scores
 *   Layer 2 (user-facing): 4 MBTI dichotomies → 16 dog personality types
 *
 * Formula per dimension:
 *   z_dim = (Σα_pos × z_pos - Σα_neg × z_neg) / Σall_α
 *
 * Where pos factors push toward E/N/F/P, neg factors push toward I/S/T/J.
 * Weight = Cronbach's α (higher reliability = higher contribution).
 *
 * Reference: Broseghini et al. (2023), PRD §4.1–4.5
 */

import type { Dimension, MBTIType, DimensionScore, PreferenceLevel } from "@/types";
import type {
  CbarqFactor,
  DogFactorScore,
  MbtiDimensionResult,
  DogMbtiMapping,
  DimensionConfidence,
} from "./types";
import { FACTOR_ALPHAS } from "./types";
import { getPoleLabel } from "@/lib/mbti-utils";

// ─── Dimension Configuration ────────────────────────────────────────────

/**
 * Each MBTI dimension is defined by:
 *   pos: C-BARQ factors pushing toward the FIRST pole (E, N, F, P)
 *   neg: C-BARQ factors pushing toward the SECOND pole (I, S, T, J)
 *
 * Each factor appears exactly once — no cross-dimensional loading.
 * To adjust a factor's mapping, modify this config.
 */
const MBTI_DIMENSION_CONFIG: Record<
  Dimension,
  { pos: CbarqFactor[]; neg: CbarqFactor[] }
> = {
  EI: {
    pos: ["F6"], // Dog-directed aggression = social confidence → E
    neg: ["F1", "F2"], // Stranger + dog fear/aggression = social avoidance → I
  },
  SN: {
    pos: ["F8", "N_TYPE"], // Trainability + strange behavior = abstract/N type
    neg: ["F5", "F10"], // Chasing + non-social fear = concrete/S type
  },
  TF: {
    pos: ["F7", "F13"], // Attachment + touch sensitivity = emotional/F type
    neg: ["F3"], // Owner-directed aggression = rational/resource-focused → T
  },
  JP: {
    pos: ["F11"], // Excitability = spontaneous → P
    neg: ["F4", "F12"], // Separation anxiety + elimination = routine-dependent → J
  },
};

// ─── First/Second poles ─────────────────────────────────────────────────

const FIRST_POLES: Record<Dimension, string> = {
  EI: "E",
  SN: "N",
  TF: "F",
  JP: "P",
};

const SECOND_POLES: Record<Dimension, string> = {
  EI: "I",
  SN: "S",
  TF: "T",
  JP: "J",
};

// ─── Confidence thresholds ──────────────────────────────────────────────

/** |z| < 0.3 → fuzzy, 0.3 ≤ |z| < 0.7 → clear, |z| ≥ 0.7 → very clear */
function computeDimensionConfidence(zScore: number): DimensionConfidence {
  const absZ = Math.abs(zScore);
  if (absZ < 0.3) return "较模糊";
  if (absZ < 0.7) return "较明确";
  return "非常明确";
}

// ─── Core computation ───────────────────────────────────────────────────

/**
 * Compute a single MBTI dimension z-score from its constituent C-BARQ factors.
 */
export function computeMbtiDimensionZ(
  dimension: Dimension,
  factorScores: Map<CbarqFactor, DogFactorScore>
): number {
  const config = MBTI_DIMENSION_CONFIG[dimension];
  if (!config) {
    throw new Error(`未知的 MBTI 维度: ${dimension}`);
  }

  let posSum = 0,
    negSum = 0,
    posWeight = 0,
    negWeight = 0;

  for (const f of config.pos) {
    const score = factorScores.get(f);
    if (!score) continue;
    const w = FACTOR_ALPHAS[f];
    posSum += w * score.zScore;
    posWeight += w;
  }

  for (const f of config.neg) {
    const score = factorScores.get(f);
    if (!score) continue;
    const w = FACTOR_ALPHAS[f];
    negSum += w * score.zScore;
    negWeight += w;
  }

  const totalWeight = posWeight + negWeight;
  if (totalWeight === 0) return 0;
  return (posSum - negSum) / totalWeight;
}

/**
 * Map dog factor scores to a complete MBTI type.
 *
 * Returns 4 dimension results with z-scores, letters, and confidence levels,
 * plus the 4-letter type code.
 */
export function mapDogScoresToMbti(
  factorScores: readonly DogFactorScore[]
): DogMbtiMapping {
  const scoreMap = new Map(factorScores.map((fs) => [fs.factor, fs]));

  const dimensions: Dimension[] = ["EI", "SN", "TF", "JP"];
  const results: Record<Dimension, MbtiDimensionResult> = {} as Record<
    Dimension,
    MbtiDimensionResult
  >;
  const letters: string[] = [];

  for (const dim of dimensions) {
    const zScore = computeMbtiDimensionZ(dim, scoreMap);
    const letter =
      zScore > 0 ? FIRST_POLES[dim] : SECOND_POLES[dim];
    const confidence = computeDimensionConfidence(zScore);

    results[dim] = { zScore, letter, confidence };
    letters.push(letter);
  }

  return {
    ei: results.EI,
    sn: results.SN,
    tf: results.TF,
    jp: results.JP,
    code: letters.join(""),
  };
}

// ─── Conversion to project's DimensionScore format ──────────────────────

/**
 * Convert dog MBTI mapping to the project's shared DimensionScore array.
 *
 * This bridges the dog-quiz module to the existing ResultCard component,
 * which expects DimensionScore[] in the PetContext.
 */
export function dogMbtiToDimensionScores(
  mapping: DogMbtiMapping
): Record<Dimension, DimensionScore> {
  const build = (dim: Dimension, result: MbtiDimensionResult): DimensionScore => {
    const maxScore = 1; // z-scores are already normalized

    let preferenceStrength: PreferenceLevel;
    const absZ = Math.abs(result.zScore);
    if (absZ >= 0.75) preferenceStrength = "绝对";
    else if (absZ >= 0.50) preferenceStrength = "明确";
    else if (absZ >= 0.25) preferenceStrength = "中等";
    else preferenceStrength = "轻微";

    return {
      dimension: dim,
      rawScore: Math.round(result.zScore * 100) / 100,
      maxScore,
      normalizedScore: Math.round(result.zScore * 1000) / 1000,
      dominantPole: result.letter as DimensionScore["dominantPole"],
      confidence: Math.round(Math.abs(result.zScore) * 1000) / 1000,
      preferenceStrength,
      label: `${preferenceStrength}偏好${getPoleLabel(result.letter as DimensionScore["dominantPole"])}(${result.letter})`,
    };
  };

  return {
    EI: build("EI", mapping.ei),
    SN: build("SN", mapping.sn),
    TF: build("TF", mapping.tf),
    JP: build("JP", mapping.jp),
  };
}
