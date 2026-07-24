// ===== 宠物信息 =====
export interface PetInfo {
  name: string;
  type: "cat" | "dog" | "other";
  age?: string;
}

// ===== 测试题 =====
export type Dimension = "EI" | "SN" | "TF" | "JP";
export type Pole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface QuestionOption {
  text: string;
  pole: Pole;
}

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  options: [QuestionOption, QuestionOption];
}

// ===== 用户答案 =====
export interface Answer {
  questionId: number;
  selectedPole: Pole;
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

// ===== API 请求/响应 =====
export interface CalculateRequest {
  answers: Answer[];
}

export interface CalculateResponse {
  type: MBTIType;
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
