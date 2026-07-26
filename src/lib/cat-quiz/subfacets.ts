/**
 * Extraversion sub-facet definitions for E/I and S/N mapping.
 *
 * The Extraversion factor splits into two sub-facets per PRD §4.1:
 *   - E/I (social energy): active, decisive, persevering, quitting
 *   - S/N (cognitive style): curious, inventive, inquisitive, smart, vigilant, deliberate
 *
 * Two Extraversion items (aimless, clumsy) are not explicitly assigned
 * to either sub-facet in the PRD. They are assigned to the cognitive subset
 * as reverse indicators of cognitive engagement (→ S end).
 *
 * This module is the conceptual foundation for the MBTI mapping formulas:
 *   z_EI = z_Extraversion     — social energy component
 *   z_SN = (z_E - z_N)/2      — cognitive style vs emotional stability
 *
 * Reference: PRD §4.2, §2.6.3 原则 A
 */

import type { CatItem } from "./types";
import { itemBank } from "./items";

/** Item IDs comprising the E/I social-energy sub-facet */
export const EI_SOCIAL_ITEM_IDS: readonly number[] = [15, 19, 25, 26];
// 15=Decisive(.62,+), 19=Active(.53,+), 25=Persevering(.40,+), 26=Quitting(.31,-)

/** Item IDs comprising the S/N cognitive-style sub-facet (Extraversion part) */
export const SN_COGNITIVE_ITEM_IDS: readonly number[] = [
  16, 17, 18, 20, 21, 22, 23, 24,
];
// 16=Smart(.60,+), 17=Curious(.59,+), 18=Inventive(.56,+), 20=Inquisitive(.53,+),
// 21=Vigilant(.48,+), 22=Deliberate(.48,+), 23=Aimless(.45,-), 24=Clumsy(.40,-)

/**
 * Get items belonging to the E/I social-energy sub-facet.
 */
export function getEISocialItems(): readonly CatItem[] {
  return itemBank.filter((i) => EI_SOCIAL_ITEM_IDS.includes(i.id));
}

/**
 * Get items belonging to the S/N cognitive-style sub-facet.
 */
export function getSNCognitiveItems(): readonly CatItem[] {
  return itemBank.filter((i) => SN_COGNITIVE_ITEM_IDS.includes(i.id));
}

/**
 * Compute a z-score for a sub-facet from dimension-level scores.
 *
 * Since the sub-facet uses a subset of Extraversion items, we estimate
 * the sub-facet z-score from the full Extraversion dimension z-score,
 * scaled by the ratio of sub-facet to full dimension loadings.
 *
 * This is a centering-based estimation until real sub-facet norms
 * are computed from Cat_personality_data.xlsx.
 *
 * @param dimensionZScore — z-score of the full Extraversion dimension
 * @param _subFacetItemCount — number of items in the sub-facet
 * @param _fullDimensionItemCount — total items in Extraversion (12)
 */
export function estimateSubFacetZScore(
  dimensionZScore: number,
  _subFacetItemCount: number,
  _fullDimensionItemCount: number
): number {
  // Currently a direct pass-through — the sub-facet z-score tracks
  // the full dimension z-score proportionally.
  // When sub-facet norms are available, this becomes:
  //   (rawSubFacetScore - subFacetMean) / subFacetStdDev
  return dimensionZScore;
}
