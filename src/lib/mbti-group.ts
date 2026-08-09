import type { MBTIType } from "@/types";

export type MbtiGroup = "analyst" | "diplomat" | "sentinel" | "explorer";

/** Map a 16-type MBTI code to its 4-group personality category */
export function getMbtiGroup(type: MBTIType): MbtiGroup {
  switch (type) {
    case "INTJ": case "INTP": case "ENTJ": case "ENTP":
      return "analyst";
    case "INFJ": case "INFP": case "ENFJ": case "ENFP":
      return "diplomat";
    case "ISTJ": case "ISFJ": case "ESTJ": case "ESFJ":
      return "sentinel";
    case "ISTP": case "ISFP": case "ESTP": case "ESFP":
      return "explorer";
  }
}

export interface GroupColorSet {
  cardBg: string;
  cardShadow: string;
  typeText: string;
  barFill: string;
  accentBorder: string;
  traitBg: string;
  adviceBg: string;
  gradientBadge: string;
  primaryHex: string;
  accentHex: string;
  lightHex: string;
  strongHex: string;
}

/**
 * Static color map keyed by personality group.
 * Class values are literal Tailwind strings — Tailwind JIT scans these.
 * Hex values are used for inline styles (confidence bars, poster rendering).
 */
export const MBTI_GROUP_COLORS: Record<MbtiGroup, GroupColorSet> = {
  analyst: {
    cardBg: "bg-analyst-surface",
    cardShadow: "shadow-result-analyst",
    typeText: "text-analyst-text",
    barFill: "bg-analyst-primary",
    accentBorder: "border-l-analyst-accent",
    traitBg: "bg-analyst-strong",
    adviceBg: "bg-analyst-surface",
    gradientBadge: "bg-analyst-gradient",
    primaryHex: "#8D5E89",
    accentHex: "#68548E",
    lightHex: "#AA80A5",
    strongHex: "#EADCE6",
  },
  diplomat: {
    cardBg: "bg-diplomat-surface",
    cardShadow: "shadow-result-diplomat",
    typeText: "text-diplomat-text",
    barFill: "bg-diplomat-primary",
    accentBorder: "border-l-diplomat-accent",
    traitBg: "bg-diplomat-strong",
    adviceBg: "bg-diplomat-surface",
    gradientBadge: "bg-diplomat-gradient",
    primaryHex: "#3FA56F",
    accentHex: "#32986D",
    lightHex: "#78B957",
    strongHex: "#DDEBD3",
  },
  sentinel: {
    cardBg: "bg-sentinel-surface",
    cardShadow: "shadow-result-sentinel",
    typeText: "text-sentinel-text",
    barFill: "bg-sentinel-primary",
    accentBorder: "border-l-sentinel-accent",
    traitBg: "bg-sentinel-strong",
    adviceBg: "bg-sentinel-surface",
    gradientBadge: "bg-sentinel-gradient",
    primaryHex: "#6E98D0",
    accentHex: "#4D7BB8",
    lightHex: "#9FC4EA",
    strongHex: "#D7E8F8",
  },
  explorer: {
    cardBg: "bg-explorer-surface",
    cardShadow: "shadow-result-explorer",
    typeText: "text-explorer-text",
    barFill: "bg-explorer-primary",
    accentBorder: "border-l-explorer-accent",
    traitBg: "bg-explorer-strong",
    adviceBg: "bg-explorer-surface",
    gradientBadge: "bg-explorer-gradient",
    primaryHex: "#F6B73C",
    accentHex: "#F28C28",
    lightHex: "#FFD85A",
    strongHex: "#FFE9B3",
  },
};
