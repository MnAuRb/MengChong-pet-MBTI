/**
 * MBTI Mapping — Dual-layer architecture.
 *
 * Layer 1 (scientific): 5 Feline Five continuous scores + z-scores
 * Layer 2 (user-facing): 4 MBTI dichotomies → 16 cat personality types
 *
 * All mapping is deterministic — same scores produce same type every time.
 *
 * Adapted for 萌宠MBTI: Result<T> pattern replaced with throw/catch.
 *
 * Reference: PRD §4.1–4.5
 */

import type {
  CatDimensionScore,
  MbtiMapping,
  MbtiDimensionResult,
  MbtiCode,
  MbtiLetterEI,
  MbtiLetterSN,
  MbtiLetterTF,
  MbtiLetterJP,
} from "./types";
import { computeDimensionConfidence } from "./confidence";
import { getCatType } from "./cat-types";

/**
 * Compute the 4 MBTI dimension results from Feline Five dimension scores.
 *
 * Formulas (PRD §4.1):
 *   z_EI = z_Extraversion     (social energy component of Extraversion)
 *   z_SN = (z_Extraversion - z_Neuroticism) / 2
 *   z_TF = (z_Agreeableness - z_Dominance) / 2
 *   z_JP = -z_Impulsiveness
 *
 * Dichotomy rules (PRD §4.3):
 *   z > 0  → first letter (E / N / F / P)
 *   z ≤ 0  → second letter (I / S / T / J)
 *
 * @param dimensionScores — all 5 dimension scores from the scoring pipeline
 * @returns 4 MBTI dimension results with z-scores, letters, and confidence
 * @throws Error if any Feline Five dimension is missing
 */
export function computeMbtiDimensions(
  dimensionScores: readonly CatDimensionScore[]
): {
  ei: MbtiDimensionResult;
  sn: MbtiDimensionResult;
  tf: MbtiDimensionResult;
  jp: MbtiDimensionResult;
} {
  // Build a lookup by dimension name
  const scoreMap = new Map(
    dimensionScores.map((ds) => [ds.dimension, ds])
  );

  const neuroticism = scoreMap.get("Neuroticism");
  const extraversion = scoreMap.get("Extraversion");
  const dominance = scoreMap.get("Dominance");
  const impulsiveness = scoreMap.get("Impulsiveness");
  const agreeableness = scoreMap.get("Agreeableness");

  if (
    !neuroticism ||
    !extraversion ||
    !dominance ||
    !impulsiveness ||
    !agreeableness
  ) {
    throw new Error("性格维度数据不完整，请重新完成测试");
  }

  // E/I: z_EI = z_Extraversion
  const zEI = extraversion.zScore;
  const eiLetter: MbtiLetterEI = zEI > 0 ? "E" : "I";

  // S/N: z_SN = (z_Extraversion - z_Neuroticism) / 2
  const zSN = (extraversion.zScore - neuroticism.zScore) / 2;
  const snLetter: MbtiLetterSN = zSN > 0 ? "N" : "S";

  // T/F: z_TF = (z_Agreeableness - z_Dominance) / 2
  const zTF = (agreeableness.zScore - dominance.zScore) / 2;
  const tfLetter: MbtiLetterTF = zTF > 0 ? "F" : "T";

  // J/P: z_JP = -z_Impulsiveness
  const zJP = -impulsiveness.zScore;
  const jpLetter: MbtiLetterJP = zJP > 0 ? "P" : "J";

  return {
    ei: {
      zScore: zEI,
      letter: eiLetter,
      confidence: computeDimensionConfidence(zEI),
    },
    sn: {
      zScore: zSN,
      letter: snLetter,
      confidence: computeDimensionConfidence(zSN),
    },
    tf: {
      zScore: zTF,
      letter: tfLetter,
      confidence: computeDimensionConfidence(zTF),
    },
    jp: {
      zScore: zJP,
      letter: jpLetter,
      confidence: computeDimensionConfidence(zJP),
    },
  };
}

/**
 * Build a valid 4-letter MBTI type code from individual letters.
 */
export function buildMbtiCode(
  ei: MbtiLetterEI,
  sn: MbtiLetterSN,
  tf: MbtiLetterTF,
  jp: MbtiLetterJP
): MbtiCode {
  return `${ei}${sn}${tf}${jp}` as MbtiCode;
}

/**
 * Map Feline Five dimension scores to a complete MBTI mapping.
 *
 * Full pipeline:
 *   1. Compute 4 MBTI dimension z-scores and letters
 *   2. Build 4-letter code
 *   3. Look up Chinese name and description from cat types
 *
 * @param dimensionScores — all 5 dimension scores from scoring pipeline
 * @returns complete MbtiMapping with code, nameZh, description
 * @throws Error if mapping fails
 */
export function mapScoresToMbti(
  dimensionScores: readonly CatDimensionScore[]
): MbtiMapping {
  const { ei, sn, tf, jp } = computeMbtiDimensions(dimensionScores);

  const code = buildMbtiCode(
    ei.letter as MbtiLetterEI,
    sn.letter as MbtiLetterSN,
    tf.letter as MbtiLetterTF,
    jp.letter as MbtiLetterJP
  );

  const catType = getCatType(code);
  if (!catType) {
    throw new Error(`无法识别的性格类型: ${code}，请联系开发者`);
  }

  return {
    ei,
    sn,
    tf,
    jp,
    code,
    nameZh: catType.nameZh,
    description: catType.description,
  };
}
