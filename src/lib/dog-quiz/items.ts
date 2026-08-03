/**
 * Item bank access layer for dog C-BARQ questions.
 *
 * Loads 25 items from src/data/dog-quiz/items.json.
 * Mirrors the pattern of cat-quiz/items.ts.
 */

import type { DogItem } from "./types";
import itemsData from "@/data/dog-quiz/items.json";

/** Full 25-item bank (all items, single version) */
export const dogItemBank: readonly DogItem[] = itemsData as DogItem[];

/** Get all items for the dog test (always 25) */
export function getDogItems(): readonly DogItem[] {
  return dogItemBank;
}

/** Get items by C-BARQ factor */
export function getDogItemsByFactor(factor: string): readonly DogItem[] {
  return dogItemBank.filter((item) => item.cbarqFactor === factor);
}

/** Get items by MBTI dimension */
export function getDogItemsByDimension(dimension: string): readonly DogItem[] {
  return dogItemBank.filter((item) => item.mbtiDimension === dimension);
}

/** Look up a single item by C-BARQ id */
export function getDogItemById(id: number): DogItem | undefined {
  return dogItemBank.find((item) => item.id === id);
}

/** Count items per C-BARQ factor */
export function dogItemCountByFactor(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of dogItemBank) {
    counts[item.cbarqFactor] = (counts[item.cbarqFactor] || 0) + 1;
  }
  return counts;
}
