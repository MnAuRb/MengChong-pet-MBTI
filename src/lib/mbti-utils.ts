/**
 * Shared MBTI utility constants and functions.
 *
 * Extracted from mbti-calculator.ts — used by the legacy dog calculator,
 * the new dog-quiz module, and the ResultCard component.
 */

import type { Dimension, Pole, PreferenceLevel } from "@/types";

// ─── Pole Constants ─────────────────────────────────────────────────────

/** The "first pole" for each dimension: positive direction */
export const FIRST_POLES: Record<Dimension, Pole> = {
  EI: "E",
  SN: "S",
  TF: "T",
  JP: "J",
};

/** The "second pole" for each dimension: negative direction */
export const SECOND_POLES: Record<Dimension, Pole> = {
  EI: "I",
  SN: "N",
  TF: "F",
  JP: "P",
};

// ─── Labels ─────────────────────────────────────────────────────────────

const POLE_LABELS: Record<Pole, string> = {
  E: "外向",
  I: "内向",
  S: "感觉",
  N: "直觉",
  T: "思考",
  F: "情感",
  J: "判断",
  P: "感知",
};

/** Get the Chinese label for a pole */
export function getPoleLabel(pole: Pole): string {
  return POLE_LABELS[pole];
}

// ─── Preference Strength ────────────────────────────────────────────────

/** Map confidence value to preference strength label */
export function getPreferenceStrength(confidence: number): PreferenceLevel {
  if (confidence >= 0.75) return "绝对";
  if (confidence >= 0.50) return "明确";
  if (confidence >= 0.25) return "中等";
  return "轻微";
}
