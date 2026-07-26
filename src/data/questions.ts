import type { Question, Dimension, Pole } from "@/types";
import type { CatItem, FelineFiveDimension } from "@/lib/cat-quiz/types";
import { getItemsForVersion } from "@/lib/cat-quiz/items";

// ─── Feline Five → MBTI Dimension mapping (display only, not scoring) ───

const DIMENSION_MAP: Record<FelineFiveDimension, Dimension> = {
  Neuroticism: "SN",
  Extraversion: "EI",
  Dominance: "TF",
  Impulsiveness: "JP",
  Agreeableness: "TF",
};

const POSITIVE_POLE: Record<FelineFiveDimension, Pole> = {
  Neuroticism: "N",
  Extraversion: "E",
  Dominance: "T",
  Impulsiveness: "P",
  Agreeableness: "F",
};

const NEGATIVE_POLE: Record<FelineFiveDimension, Pole> = {
  Neuroticism: "S",
  Extraversion: "I",
  Dominance: "F",
  Impulsiveness: "J",
  Agreeableness: "T",
};

// ─── Dog questions (existing, 20 items) ──────────────────────────────

export const questions: Question[] = [
  // ===== EI 维度：外向(E) vs 内向(I) — 3 E-keyed + 2 I-keyed =====
  {
    id: 1,
    dimension: "EI",
    text: "陌生人来家里做客时，我的宠物会主动凑过去嗅闻、探索或求关注",
    keyedPole: "E",
    weight: 1.0,
  },
  {
    id: 2,
    dimension: "EI",
    text: "在宠物公园或陌生环境中，我的宠物会主动靠近其他动物或人类互动",
    keyedPole: "E",
    weight: 1.0,
  },
  {
    id: 3,
    dimension: "EI",
    text: "我在家大声说话、唱歌或跳舞时，我的宠物会被吸引过来围观或参与",
    keyedPole: "E",
    weight: 1.0,
  },
  {
    id: 4,
    dimension: "EI",
    text: "我的宠物更享受独自安静待着，不需要频繁的社交互动来获得满足感",
    keyedPole: "I",
    weight: 1.0,
  },
  {
    id: 5,
    dimension: "EI",
    text: "面对新环境或陌生人时，我的宠物会先保持距离、观察清楚再决定是否靠近",
    keyedPole: "I",
    weight: 1.0,
  },

  // ===== SN 维度：感觉(S) vs 直觉(N) — 3 S-keyed + 2 N-keyed =====
  {
    id: 6,
    dimension: "SN",
    text: "拿到新玩具或零食时，我的宠物会直接上手操作，而不是先反复观察研究",
    keyedPole: "S",
    weight: 1.0,
  },
  {
    id: 7,
    dimension: "SN",
    text: "我的宠物更关注眼前实际的东西，不会被凭空想象的事物分心",
    keyedPole: "S",
    weight: 1.0,
  },
  {
    id: 8,
    dimension: "SN",
    text: "我的宠物吃饭时专注高效，一气呵成，不会被周围小动静分散注意力",
    keyedPole: "S",
    weight: 1.0,
  },
  {
    id: 9,
    dimension: "SN",
    text: "我的宠物经常对「不存在的东西」表现出好奇——追空气里的飞虫、盯墙壁的影子、对着虚空叫",
    keyedPole: "N",
    weight: 1.0,
  },
  {
    id: 10,
    dimension: "SN",
    text: "我的宠物会花时间「研究」新事物——先绕圈、闻、看很久，才决定怎么互动",
    keyedPole: "N",
    weight: 1.0,
  },

  // ===== TF 维度：思考(T) vs 情感(F) — 3 T-keyed + 2 F-keyed =====
  {
    id: 11,
    dimension: "TF",
    text: "即使我情绪明显低落，我的宠物也照常该吃吃该睡睡，不会特别改变行为",
    keyedPole: "T",
    weight: 1.0,
  },
  {
    id: 12,
    dimension: "TF",
    text: "犯错（打碎东西、乱尿）后，我的宠物表现得像什么都没发生过，不会露出愧疚或讨好的表情",
    keyedPole: "T",
    weight: 1.0,
  },
  {
    id: 13,
    dimension: "TF",
    text: "我的宠物把「规则」看得比「情感」更重——比如到点必须出门，不管我当下在做什么",
    keyedPole: "T",
    weight: 1.0,
  },
  {
    id: 14,
    dimension: "TF",
    text: "我情绪不好时，我的宠物会明显改变行为——靠近我、蹭我、安静陪着或发出安慰的声音",
    keyedPole: "F",
    weight: 1.0,
  },
  {
    id: 15,
    dimension: "TF",
    text: "我的宠物的情绪写在脸上——开心、委屈、嫉妒、得意都能很清楚地看出来",
    keyedPole: "F",
    weight: 1.0,
  },

  // ===== JP 维度：判断(J) vs 感知(P) — 3 J-keyed + 2 P-keyed =====
  {
    id: 16,
    dimension: "JP",
    text: "我的宠物有非常固定的作息规律——每天在差不多同一时间吃饭、散步、睡觉",
    keyedPole: "J",
    weight: 1.0,
  },
  {
    id: 17,
    dimension: "JP",
    text: "我的宠物严格遵守家里的规矩——不上沙发、不进卧室、不翻垃圾桶",
    keyedPole: "J",
    weight: 1.0,
  },
  {
    id: 18,
    dimension: "JP",
    text: "看到我拿出行李箱或收拾东西，我的宠物会立刻警觉并表现出焦虑不安",
    keyedPole: "J",
    weight: 1.0,
  },
  {
    id: 19,
    dimension: "JP",
    text: "我的宠物对睡觉地点很随性——今天睡窝里、明天睡沙发、后天睡在一个奇怪的角落",
    keyedPole: "P",
    weight: 1.0,
  },
  {
    id: 20,
    dimension: "JP",
    text: "早上叫醒我这件事完全看宠物的心情——想叫就叫，不想叫就一起睡懒觉",
    keyedPole: "P",
    weight: 1.0,
  },
];

// ─── Cat questions (25 items, Standard version, from Feline Five model) ──

function buildCatQuestions(): Question[] {
  const items = getItemsForVersion("standard");
  return items.map((item: CatItem) => ({
    id: item.id,
    dimension: DIMENSION_MAP[item.dimension],
    text: `我的猫咪${item.traitZh}，${item.definitionZh}`,
    keyedPole:
      item.direction === "+"
        ? POSITIVE_POLE[item.dimension]
        : NEGATIVE_POLE[item.dimension],
    weight: item.loading,
  }));
}

export const catQuestions: Question[] = buildCatQuestions();
