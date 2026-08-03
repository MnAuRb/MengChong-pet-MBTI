import type { Question, Dimension, Pole } from "@/types";
import type { CatItem, FelineFiveDimension } from "@/lib/cat-quiz/types";
import { getItemsForVersion } from "@/lib/cat-quiz/items";
import { dogItemBank } from "@/lib/dog-quiz/items";

// ─── Feline Five → MBTI Dimension mapping (display only, not scoring) ───

const DIMENSION_MAP: Record<FelineFiveDimension, Dimension> = {
  Neuroticism: "SN",
  Extraversion: "EI",
  Dominance: "TF",
  Impulsiveness: "JP",
  Agreeableness: "TF",
};

const POSITIVE_POLE: Record<FelineFiveDimension, Pole> = {
  Neuroticism: "N",
  Extraversion: "E",
  Dominance: "T",
  Impulsiveness: "P",
  Agreeableness: "F",
};

const NEGATIVE_POLE: Record<FelineFiveDimension, Pole> = {
  Neuroticism: "S",
  Extraversion: "I",
  Dominance: "F",
  Impulsiveness: "J",
  Agreeableness: "T",
};

// ─── Dog questions (25 items from C-BARQ validated bank) ──────────────

/**
 * Build dog Question[] from dogItemBank (C-BARQ 25 items).
 *
 * Each C-BARQ item is converted to the project's Question type for
 * compatibility with QuestionCard and the test page.
 * Scoring uses the dog-quiz/ module (weighted sum + z-score), not
 * the legacy Likert-offset method.
 */
function buildDogQuestions(): Question[] {
  return dogItemBank.map((item) => ({
    id: item.id,
    dimension: item.mbtiDimension,
    text: item.textZh,
    keyedPole: item.pole,
    weight: item.loading,
  }));
}

export const dogQuestions: Question[] = buildDogQuestions();
export const questions: Question[] = dogQuestions; // backward compat: default = dog

// ─── Cat questions (25 items, Standard version, from Feline Five model) ──

function buildCatQuestions(): Question[] {
  const items = getItemsForVersion("standard");
  return items.map((item: CatItem) => ({
    id: item.id,
    dimension: DIMENSION_MAP[item.dimension],
    text: `我的猫咪${item.traitZh}，${item.definitionZh}`,
    keyedPole:
      item.direction === "+"
        ? POSITIVE_POLE[item.dimension]
        : NEGATIVE_POLE[item.dimension],
    weight: item.loading,
  }));
}

export const catQuestions: Question[] = buildCatQuestions();
