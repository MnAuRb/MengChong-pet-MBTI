/**
 * Feline Five dimension metadata.
 *
 * All values from Litchfield et al. (2017):
 * - Variance explained: Table 2 (before/after Varimax rotation)
 * - Cronbach's α: Abstract / Results section
 * - Item count: Table 3
 */

import type { DimensionMeta } from "./types";

export const DIMENSION_META: Record<string, DimensionMeta> = {
  Neuroticism: {
    name: "Neuroticism",
    nameZh: "神经质",
    varianceExplainedBefore: 18.24,
    varianceExplainedAfter: 13.4,
    cronbachsAlpha: 0.9,
    itemCount: 14,
  },
  Extraversion: {
    name: "Extraversion",
    nameZh: "外向性",
    varianceExplainedBefore: 12.03,
    varianceExplainedAfter: 8.08,
    cronbachsAlpha: 0.8,
    itemCount: 12,
  },
  Dominance: {
    name: "Dominance",
    nameZh: "支配性",
    varianceExplainedBefore: 6.97,
    varianceExplainedAfter: 7.55,
    cronbachsAlpha: 0.8,
    itemCount: 8,
  },
  Impulsiveness: {
    name: "Impulsiveness",
    nameZh: "冲动性",
    varianceExplainedBefore: 6.51,
    varianceExplainedAfter: 6.92,
    cronbachsAlpha: 0.72,
    itemCount: 7,
  },
  Agreeableness: {
    name: "Agreeableness",
    nameZh: "亲和性",
    varianceExplainedBefore: 3.67,
    varianceExplainedAfter: 5.58,
    cronbachsAlpha: 0.78,
    itemCount: 7,
  },
} as const;
