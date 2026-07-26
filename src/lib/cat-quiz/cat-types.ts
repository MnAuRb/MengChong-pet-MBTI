/**
 * 16 Cat MBTI personality types.
 *
 * All types, Chinese names, and descriptions from PRD §4.4.
 * Each type has a unique 4-letter code, Chinese name, and one-line description.
 */

import type { MbtiCode } from "./types";

export interface CatTypeEntry {
  readonly code: MbtiCode;
  readonly nameZh: string;
  readonly description: string;
}

/** All 16 cat MBTI types, keyed by 4-letter code */
export const CAT_MBTI_TYPES: Record<MbtiCode, CatTypeEntry> = {
  ENTP: {
    code: "ENTP",
    nameZh: "发明家猫",
    description: "外向好奇、独立创新、精力旺盛、行为随性——总有新花样",
  },
  ENTJ: {
    code: "ENTJ",
    nameZh: "指挥官猫",
    description: "外向自信、独立果断、精力充沛、行为规律——天生的领导者",
  },
  ENFP: {
    code: "ENFP",
    nameZh: "探险家猫",
    description: "外向好奇、亲人粘人、精力充沛、行为随性——永远在探索",
  },
  ENFJ: {
    code: "ENFJ",
    nameZh: "外交官猫",
    description: "外向自信、温柔亲和、精力充沛、行为规律——猫群中的社交明星",
  },
  ESTP: {
    code: "ESTP",
    nameZh: "冒险家猫",
    description: "外向务实、独立疏离、精力旺盛、行为随性——活在当下的行动派",
  },
  ESTJ: {
    code: "ESTJ",
    nameZh: "管理者猫",
    description: "外向务实、独立果断、精力充沛、行为规律——一切尽在掌控",
  },
  ESFP: {
    code: "ESFP",
    nameZh: "表演家猫",
    description: "外向务实、亲人粘人、精力旺盛、行为随性——家中的开心果",
  },
  ESFJ: {
    code: "ESFJ",
    nameZh: "守护者猫",
    description: "外向务实、温柔亲和、精力充沛、行为规律——默默守护全家人",
  },
  INTP: {
    code: "INTP",
    nameZh: "哲学家猫",
    description: "内向好奇、独立创新、安静观察、行为随性——沉浸在自己的世界",
  },
  INTJ: {
    code: "INTJ",
    nameZh: "战略家猫",
    description: "内向自信、独立果断、安静观察、行为规律——深思熟虑后才行动",
  },
  INFP: {
    code: "INFP",
    nameZh: "诗人猫",
    description: "内向敏感、温柔粘人、安静观察、行为随性——细腻温柔的心灵捕手",
  },
  INFJ: {
    code: "INFJ",
    nameZh: "顾问猫",
    description: "内向敏感、温柔亲和、安静观察、行为规律——安静但总能洞察一切",
  },
  ISTP: {
    code: "ISTP",
    nameZh: "工匠猫",
    description: "内向务实、独立疏离、安静观察、行为随性——专注做自己喜欢的事",
  },
  ISTJ: {
    code: "ISTJ",
    nameZh: "检查员猫",
    description: "内向务实、独立果断、安静观察、行为规律——生活就是一套固定流程",
  },
  ISFP: {
    code: "ISFP",
    nameZh: "艺术家猫",
    description: "内向敏感、温柔粘人、安静独处、行为随性——享受慢生活",
  },
  ISFJ: {
    code: "ISFJ",
    nameZh: "保卫者猫",
    description: "内向敏感、温柔亲和、安静独处、行为规律——安静而忠诚的陪伴者",
  },
};

/** Look up a cat type by its 4-letter MBTI code */
export function getCatType(code: MbtiCode): CatTypeEntry | undefined {
  return CAT_MBTI_TYPES[code];
}
