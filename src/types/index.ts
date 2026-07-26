// ===== 宠物信息 =====
export interface PetInfo {
  name: string;
  type: "cat" | "dog" | "other";
  age?: string;
}

// ===== Likert 量表 =====
/** 5-point Likert：1=完全不符合, 2=不太符合, 3=有时符合, 4=比较符合, 5=完全符合 */
export type LikertValue = 1 | 2 | 3 | 4 | 5;

// ===== 测试题 =====
export type Dimension = "EI" | "SN" | "TF" | "JP";
export type Pole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface Question {
  id: number;
  dimension: Dimension;
  /** 行为陈述句 — 用户对这句话的符合程度打分 */
  text: string;
  /** 此题测量的 pole（正向计分方向） */
  keyedPole: Pole;
  /** 题目权重，默认 1.0 */
  weight: number;
}

// ===== 用户答案 =====
export interface Answer {
  questionId: number;
  /** 1-5 Likert 值 */
  value: LikertValue;
}

// ===== MBTI 结果 =====
export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export interface MBTIResult {
  type: MBTIType;
  nickname: string;
  description: string;
  traits: string[];
  quote: string;
  advice: string;
}

// ===== 计分结果 =====
export type PreferenceLevel = "轻微" | "中等" | "明确" | "绝对";

export interface DimensionScore {
  dimension: Dimension;
  /** 原始分，范围 -10 ~ +10（5题 × 每题偏移 -2~+2） */
  rawScore: number;
  /** 理论最大绝对值 = 每题数 × 2 */
  maxScore: number;
  /** 归一化分数，-1.0 ~ +1.0 */
  normalizedScore: number;
  /** 主导 pole */
  dominantPole: Pole;
  /** 置信度 0-1 */
  confidence: number;
  /** 偏好强度等级 */
  preferenceStrength: PreferenceLevel;
  /** 人读标签，如 "明确偏好外向(E)" */
  label: string;
}

// ===== API 请求/响应 =====
export interface CalculateRequest {
  answers: Answer[];
  petType?: "cat" | "dog" | "other";
}

export interface CalculateResponse {
  type: MBTIType;
  scores: Record<Dimension, DimensionScore>;
}

// ===== 数据埋点 =====
export type TrackEvent =
  | "page_view_home"
  | "click_start_test"
  | "test_started"
  | "test_completed"
  | "page_view_result"
  | "click_share"
  | "share_completed"
  | "click_retest";

export interface TrackPayload {
  event: TrackEvent;
  session_id: string;
  pet_type?: "cat" | "dog" | "other";
  mbti_type?: string;
  screen_size?: string;
}
