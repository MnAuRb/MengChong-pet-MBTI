/**
 * Cat MBTI Calculator — integration orchestrator.
 *
 * Bridges the cat_quiz Feline Five scoring pipeline to the project's
 * CalculateResponse format. The cat path uses:
 *   1. Weighted-sum factor scoring (Feline Five 5-dimension model)
 *   2. Z-score calibration against n=2,802 norm population
 *   3. 5→4 MBTI dimension mapping via deterministic formulas
 *
 * Dog path continues to use the existing Likert-offset scoring in mbti-calculator.ts.
 */

import type {
  Answer,
  CalculateResponse,
  Dimension,
  DimensionScore,
  MBTIType,
  Pole,
} from "@/types";
import type { ItemResponse } from "@/lib/cat-quiz/types";
import { getItemsForVersion } from "@/lib/cat-quiz/items";
import { calculateAllDimensionScores } from "@/lib/cat-quiz/scoring";
import { mapScoresToMbti } from "@/lib/cat-quiz/mbti-mapper";
import type { MbtiDimensionResult } from "@/lib/cat-quiz/types";
import { getPreferenceStrength, getPoleLabel } from "./mbti-utils";

// ─── Dimension Key Mapping ──────────────────────────────────────────

const DIM_KEY_MAP: Record<string, Dimension> = {
  ei: "EI",
  sn: "SN",
  tf: "TF",
  jp: "JP",
};

const LETTER_TO_POLE: Record<string, Record<string, Pole>> = {
  ei: { E: "E" as Pole, I: "I" as Pole },
  sn: { N: "N" as Pole, S: "S" as Pole },
  tf: { F: "F" as Pole, T: "T" as Pole },
  jp: { P: "P" as Pole, J: "J" as Pole },
};

// ─── Confidence Mapping ─────────────────────────────────────────────

const CONFIDENCE_MAP: Record<string, number> = {
  "较模糊": 0.25,
  "较明确": 0.55,
  "非常明确": 0.85,
};

const VALID_MBTI_TYPES: MBTIType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

function isValidMBTIType(type: string): type is MBTIType {
  return VALID_MBTI_TYPES.includes(type as MBTIType);
}

// ─── Bridge Conversion ──────────────────────────────────────────────

/**
 * Convert a single MBTI dimension result (from cat_quiz) to the project's
 * DimensionScore format. Uses tanh for smooth z-score → normalizedScore mapping.
 */
function mbtiDimToDimensionScore(
  dimKey: string,
  result: MbtiDimensionResult
): DimensionScore {
  const dimension = DIM_KEY_MAP[dimKey];
  if (!dimension) {
    throw new Error(`Unknown dimension key: ${dimKey}`);
  }

  const poleMap = LETTER_TO_POLE[dimKey];
  if (!poleMap) {
    throw new Error(`No pole map for dimension: ${dimKey}`);
  }

  const dominantPole = poleMap[result.letter];
  if (!dominantPole) {
    throw new Error(
      `Unknown letter "${result.letter}" for dimension ${dimKey}`
    );
  }

  // zScore → normalizedScore: use tanh for smooth mapping
  // z=0 → 0, z=±0.5 → ±0.46, z=±1 → ±0.76, z=±2 → ±0.96
  const normalizedScore = Math.tanh(result.zScore);
  const roundedNorm = Math.round(normalizedScore * 1000) / 1000;

  // Categorical confidence → numeric (0–1)
  const confidence = CONFIDENCE_MAP[result.confidence] ?? 0.5;

  const preferenceStrength = getPreferenceStrength(confidence);
  const poleLabel = getPoleLabel(dominantPole);

  return {
    dimension,
    rawScore: Math.round(result.zScore * 200) / 100,
    maxScore: 3,
    normalizedScore: roundedNorm,
    dominantPole,
    confidence: Math.round(confidence * 1000) / 1000,
    preferenceStrength,
    label: `${preferenceStrength}偏好${poleLabel}(${dominantPole})`,
  };
}

/**
 * Convert all 4 MBTI dimension results to Record<Dimension, DimensionScore>.
 */
function convertMbtiDimsToScores(dims: {
  ei: MbtiDimensionResult;
  sn: MbtiDimensionResult;
  tf: MbtiDimensionResult;
  jp: MbtiDimensionResult;
}): Record<Dimension, DimensionScore> {
  return {
    EI: mbtiDimToDimensionScore("ei", dims.ei),
    SN: mbtiDimToDimensionScore("sn", dims.sn),
    TF: mbtiDimToDimensionScore("tf", dims.tf),
    JP: mbtiDimToDimensionScore("jp", dims.jp),
  };
}

// ─── Main Entry Point ───────────────────────────────────────────────

/**
 * Calculate cat MBTI from user answers.
 *
 * Full pipeline:
 *   1. Validate answer count (25 for Standard version)
 *   2. Convert Answer[] → ItemResponse[]
 *   3. Feline Five weighted-sum factor scoring (5 dimensions)
 *   4. Z-score calibration against norm population
 *   5. 5→4 MBTI dimension mapping
 *   6. Convert to project's CalculateResponse format
 *
 * @param answers — 25 answers (Standard version), each questionId 1–48, value 1–5
 * @returns CalculateResponse with MBTI type and 4-dimension scores
 * @throws Error if validation fails or calculation errors
 */
export function calculateCatMBTI(answers: Answer[]): CalculateResponse {
  // 1. Validate answer count
  if (!answers || answers.length === 0) {
    throw new Error("答案不能为空");
  }

  if (answers.length !== 25) {
    throw new Error(`需要 25 道题答案，当前只有 ${answers.length} 道`);
  }

  // 2. Get Standard version items (25 items)
  const items = getItemsForVersion("standard");

  // 3. Convert Answer[] → ItemResponse[]
  const responses: ItemResponse[] = answers.map((a) => ({
    itemId: a.questionId,
    score: a.value as 1 | 2 | 3 | 4 | 5,
  }));

  // 4. Feline Five weighted-sum scoring → 5 dimension scores
  const felineScores = calculateAllDimensionScores(items, responses, false);

  // 5. MBTI mapping → 4 MBTI dimensions + type code + cat name
  const mapping = mapScoresToMbti(felineScores);

  // 6. Validate type code
  const typeCode = mapping.code;
  if (!isValidMBTIType(typeCode)) {
    throw new Error(`计算出无效的 MBTI 类型: ${typeCode}`);
  }

  // 7. Convert to project format
  const scores = convertMbtiDimsToScores({
    ei: mapping.ei,
    sn: mapping.sn,
    tf: mapping.tf,
    jp: mapping.jp,
  });

  return { type: typeCode, scores };
}
