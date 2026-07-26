import type { Answer, MBTIType, Dimension, DimensionScore, Pole, PreferenceLevel } from "@/types";
import { questions } from "@/data/questions";

// 每个维度的"第一 pole"（正分方向）
export const FIRST_POLES: Record<Dimension, Pole> = {
  EI: "E",
  SN: "S",
  TF: "T",
  JP: "J",
};

export const SECOND_POLES: Record<Dimension, Pole> = {
  EI: "I",
  SN: "N",
  TF: "F",
  JP: "P",
};

const POLE_LABELS: Record<Pole, string> = {
  E: "外向", I: "内向",
  S: "感觉", N: "直觉",
  T: "思考", F: "情感",
  J: "判断", P: "感知",
};

const VALID_TYPES: MBTIType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

function isValidType(type: string): type is MBTIType {
  return VALID_TYPES.includes(type as MBTIType);
}

/** 根据置信度获取偏好强度等级 */
export function getPreferenceStrength(confidence: number): PreferenceLevel {
  if (confidence >= 0.75) return "绝对";
  if (confidence >= 0.50) return "明确";
  if (confidence >= 0.25) return "中等";
  return "轻微";
}

/** 获取 pole 的中文标签 */
export function getPoleLabel(pole: Pole): string {
  return POLE_LABELS[pole];
}

/**
 * 计算单个维度的 Likert 计分
 * 公式：dimensionScore = Σ (likertValue - 3) × direction × weight
 *   - likertValue ∈ {1,2,3,4,5}，偏移 = value - 3 ∈ {-2,-1,0,+1,+2}
 *   - direction = +1 if keyedPole 是维度的第一 pole(E/S/T/J), -1 otherwise
 *   - 正分 → 倾向第一 pole，负分 → 倾向第二 pole
 */
export function calculateDimensionScore(
  dimension: Dimension,
  answers: Answer[]
): DimensionScore {
  const dimQuestions = questions.filter((q) => q.dimension === dimension);
  const maxScore = dimQuestions.length * 2; // 每题最大偏移 = 2

  let rawScore = 0;

  for (const q of dimQuestions) {
    const answer = answers.find((a) => a.questionId === q.id);
    if (!answer) {
      throw new Error(`缺少第 ${q.id} 题的答案`);
    }

    const offset = answer.value - 3; // -2 到 +2
    const isFirstPole = FIRST_POLES[dimension] === q.keyedPole;
    const direction = isFirstPole ? 1 : -1;
    rawScore += offset * direction * q.weight;
  }

  const normalizedScore = rawScore / maxScore; // -1.0 ~ +1.0
  const isFirst = normalizedScore >= 0;
  const dominantPole = isFirst
    ? FIRST_POLES[dimension]
    : SECOND_POLES[dimension];
  const confidence = Math.abs(normalizedScore); // 0 ~ 1
  const preferenceStrength = getPreferenceStrength(confidence);

  return {
    dimension,
    rawScore: Math.round(rawScore * 100) / 100,
    maxScore,
    normalizedScore: Math.round(normalizedScore * 1000) / 1000,
    dominantPole,
    confidence: Math.round(confidence * 1000) / 1000,
    preferenceStrength,
    label: `${preferenceStrength}偏好${getPoleLabel(dominantPole)}(${dominantPole})`,
  };
}

/**
 * 计算 4 个维度的 Likert 得分并生成 MBTI 类型码
 */
export function calculateMBTI(answers: Answer[]): {
  type: MBTIType;
  scores: Record<Dimension, DimensionScore>;
} {
  if (!answers || answers.length === 0) {
    throw new Error("答案不能为空");
  }

  if (answers.length < 20) {
    throw new Error(`需要 20 道题的答案，当前只有 ${answers.length} 道`);
  }

  const dimensions: Dimension[] = ["EI", "SN", "TF", "JP"];
  const scores = {} as Record<Dimension, DimensionScore>;

  for (const dim of dimensions) {
    scores[dim] = calculateDimensionScore(dim, answers);
  }

  const type = (
    scores.EI.dominantPole +
    scores.SN.dominantPole +
    scores.TF.dominantPole +
    scores.JP.dominantPole
  );

  if (!isValidType(type)) {
    throw new Error(`计算出无效的 MBTI 类型: ${type}`);
  }

  return { type, scores };
}
