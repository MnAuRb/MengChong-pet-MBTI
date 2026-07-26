/**
 * Input validation for user responses.
 *
 * Validates ItemResponse[] at the system boundary before
 * data enters the scoring pipeline. Uses throw/catch pattern
 * to match the host project's error handling convention.
 *
 * Adapted from cat_quiz for 萌宠MBTI project.
 */

import type { ItemResponse, TestVersion, LikertScore } from "./types";
import { getItemsForVersion, itemBank } from "./items";

const VALID_SCORES: ReadonlySet<number> = new Set([1, 2, 3, 4, 5]);

/** Check if a value is a valid LikertScore (1-5 integer) */
function isValidScore(value: unknown): value is LikertScore {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    VALID_SCORES.has(value)
  );
}

/**
 * Validate user responses for a given test version.
 *
 * Rules:
 * - Responses must be a non-empty array
 * - Each response must have a valid itemId and score (1–5)
 * - No duplicate itemIds
 * - All itemIds must belong to the specified version
 * - Quick/Standard: no missing items (all version items must be answered)
 * - Professional: up to 2 missing items allowed; >2 → error
 *
 * Returns validated ItemResponse[] on success.
 * @throws Error describing the validation issue (with userMessage)
 */
export function validateResponses(
  version: TestVersion,
  responses: unknown
): readonly ItemResponse[] {
  // ── Check input is an array ──
  if (!Array.isArray(responses)) {
    throw new Error("数据格式错误，请重新提交");
  }

  if (responses.length === 0) {
    throw new Error("请至少回答一道题目");
  }

  // ── Validate each response entry ──
  const seenIds = new Set<number>();
  const validated: ItemResponse[] = [];

  for (let i = 0; i < responses.length; i++) {
    const entry = responses[i];

    // Check structure
    if (typeof entry !== "object" || entry === null) {
      throw new Error(`第${i + 1}题的回答格式有误`);
    }

    const { itemId, score } = entry as Record<string, unknown>;

    // Check itemId
    if (
      typeof itemId !== "number" ||
      !Number.isInteger(itemId) ||
      itemId < 1
    ) {
      throw new Error(`第${i + 1}题的题目编号格式有误`);
    }

    // Check duplicate
    if (seenIds.has(itemId)) {
      throw new Error(`题目${itemId}重复作答，每题只能回答一次`);
    }
    seenIds.add(itemId);

    // Check score
    if (!isValidScore(score)) {
      throw new Error(
        `题目${itemId}的评分为${String(score)}，请选择1-5之间的分数`
      );
    }

    validated.push({ itemId, score: score as LikertScore });
  }

  // ── Check against version items ──
  const versionItems = getItemsForVersion(version);
  const versionItemIds = new Set(versionItems.map((item) => item.id));

  // Check for itemIds not in this version
  for (const resp of validated) {
    if (!versionItemIds.has(resp.itemId)) {
      const item = itemBank.find((it) => it.id === resp.itemId);
      if (item) {
        throw new Error(
          `题目"${item.traitZh}"不在${version}版本中，请选择正确的测试版本`
        );
      }
      throw new Error(`题目编号${resp.itemId}不存在`);
    }
  }

  // ── Check missing items ──
  const missingIds: number[] = [];
  for (const item of versionItems) {
    if (!seenIds.has(item.id)) {
      missingIds.push(item.id);
    }
  }

  if (version === "quick" || version === "standard") {
    if (missingIds.length > 0) {
      const versionLabel = version === "quick" ? "快速版" : "标准版";
      throw new Error(
        `${versionLabel}需要回答全部${versionItems.length}道题目，当前缺少${missingIds.length}题`
      );
    }
  } else {
    // Professional: allow up to 2 missing
    if (missingIds.length > 2) {
      throw new Error(
        `专业版最多允许跳过2题，当前缺少${missingIds.length}题，请完成后重新提交`
      );
    }
  }

  return validated;
}
