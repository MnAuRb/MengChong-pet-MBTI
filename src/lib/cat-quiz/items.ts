/**
 * Item bank module — exports the 48-item question bank and version selectors.
 *
 * Adapted from cat_quiz for 萌宠MBTI project.
 * JSON import uses standard Next.js/TS module resolution (no import assertions).
 */

import type { CatItem, TestVersion, FelineFiveDimension } from "./types";
import itemsData from "@/data/cat-items.json";

/** Full 48-item question bank */
export const itemBank: readonly CatItem[] = itemsData as readonly CatItem[];

/** Get items for a specific test version */
export function getItemsForVersion(version: TestVersion): readonly CatItem[] {
  switch (version) {
    case "quick":
      return itemBank.filter((i) => i.isQuick);
    case "standard":
      return itemBank.filter((i) => i.isStandard);
    case "professional":
      return itemBank;
  }
}

/** Get items belonging to a specific Feline Five dimension */
export function getItemsByDimension(
  dimension: FelineFiveDimension
): readonly CatItem[] {
  return itemBank.filter((i) => i.dimension === dimension);
}

/** Get a single item by its ID */
export function getItemById(id: number): CatItem | undefined {
  return itemBank.find((i) => i.id === id);
}

/** Number of items per dimension */
export function itemCountByDimension(
  dimension: FelineFiveDimension
): number {
  return getItemsByDimension(dimension).length;
}
