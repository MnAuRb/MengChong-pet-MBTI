import { CAT_BREEDS, DOG_BREEDS } from "@/data/breeds";
import type { MBTIType } from "@/types";

/**
 * 根据中文品种名查找 slug。
 * @param breedName 中文品种名，如 "金毛"
 * @param petType 宠物类型
 * @returns slug，如 "golden-retriever"；找不到返回 null
 */
export function getBreedSlug(
  breedName: string,
  petType: "cat" | "dog"
): string | null {
  const breeds = petType === "cat" ? CAT_BREEDS : DOG_BREEDS;
  return breeds.find((b) => b.name === breedName)?.slug ?? null;
}

/**
 * 获取品种 × 性格的图片路径。
 * @param breedSlug 品种目录 slug
 * @param mbtiType MBTI 类型（如 "INTJ"）
 * @param petType 宠物类型
 * @returns 图片路径，如 "/images/breeds/dog/golden-retriever/INTJ.png"
 */
export function getBreedImagePath(
  breedSlug: string,
  mbtiType: MBTIType,
  petType: "cat" | "dog"
): string {
  return `/images/breeds/${petType}/${breedSlug}/${mbtiType}.png`;
}
