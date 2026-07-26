/**
 * Norm parameters for z-score calibration.
 *
 * Computed from Cat_personality_data.xlsx (n=2,802 cats, Australia + New Zealand).
 *
 * Processing steps:
 *   1. Converted original 7-point Likert responses to 5-point scale
 *      (s_5 = round(1 + (s_7 - 1) × 4/6)).
 *   2. Applied weighted-sum formula F_f = Σ |loading_i| × adjusted_score_i
 *      where adjusted_score = r_i (positive) or 6 - r_i (negative).
 *   3. Computed population μ (mean) and σ (standard deviation) for each dimension.
 *
 * Reference: PRD §3.2–3.3
 *
 * Computed: 2026-07-27
 */

import type { NormParams, FelineFiveDimension } from "./types";

export const NORM_PARAMS: Record<FelineFiveDimension, NormParams> = {
  Neuroticism: { mean: 22.733926, stdDev: 6.995609 },
  Extraversion: { mean: 22.238373, stdDev: 3.374607 },
  Dominance: { mean: 13.005735, stdDev: 3.861032 },
  Impulsiveness: { mean: 8.605899, stdDev: 2.376627 },
  Agreeableness: { mean: 12.23353, stdDev: 2.276816 },
};
