import type { Answer, MBTIType } from "@/types";

const VALID_TYPES: MBTIType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

function isValidType(type: string): type is MBTIType {
  return VALID_TYPES.includes(type as MBTIType);
}

export function calculateMBTI(answers: Answer[]): MBTIType {
  if (!answers || answers.length === 0) {
    throw new Error("答案不能为空");
  }

  if (answers.length < 20) {
    throw new Error(`需要20道题的答案，当前只有 ${answers.length} 道`);
  }

  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const answer of answers) {
    const { selectedPole } = answer;
    if (selectedPole in scores) {
      scores[selectedPole]++;
    }
  }

  // 每维度选得分高的一方，平局优先 E/S/T/J
  const type =
    (scores.E >= scores.I ? "E" : "I") +
    (scores.S >= scores.N ? "S" : "N") +
    (scores.T >= scores.F ? "T" : "F") +
    (scores.J >= scores.P ? "J" : "P");

  if (!isValidType(type)) {
    throw new Error(`计算出无效的 MBTI 类型: ${type}`);
  }

  return type;
}
