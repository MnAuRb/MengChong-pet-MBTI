import { NextResponse } from "next/server";
import { calculateDogMBTI } from "@/lib/dog-calculator";
import { calculateCatMBTI } from "@/lib/cat-calculator";
import type { CalculateRequest, CalculateResponse } from "@/types";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as CalculateRequest;
    const petType = body.petType || "dog";

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "缺少 answers 字段" }, { status: 400 });
    }

    const expectedCount = 25; // Both cat and dog use 25 questions
    if (body.answers.length !== expectedCount) {
      return NextResponse.json(
        { error: `需要 ${expectedCount} 道题答案，收到 ${body.answers.length} 道` },
        { status: 400 }
      );
    }

    const maxQuestionId = petType === "cat" ? 48 : 100;
    const validValues =
      petType === "cat"
        ? ([1, 2, 3, 4, 5] as const)
        : ([0, 1, 2, 3, 4] as const);

    // 校验每条答案结构
    for (let i = 0; i < body.answers.length; i++) {
      const a = body.answers[i];
      if (
        typeof a.questionId !== "number" ||
        a.questionId < 1 ||
        a.questionId > maxQuestionId
      ) {
        return NextResponse.json(
          { error: `第 ${i + 1} 条答案 questionId 无效` },
          { status: 400 }
        );
      }
      if (typeof a.value !== "number" || !(validValues as readonly number[]).includes(a.value)) {
        return NextResponse.json(
          { error: `第 ${i + 1} 条答案 value 无效: ${a.value}，需为 ${petType === "cat" ? "1-5" : "0-4"}` },
          { status: 400 }
        );
      }
    }

    const result =
      petType === "cat"
        ? calculateCatMBTI(body.answers)
        : calculateDogMBTI(body.answers);

    const response: CalculateResponse = {
      type: result.type,
      scores: result.scores,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("calculate error:", error);
    const message =
      error instanceof Error ? error.message : "计算失败，请重试";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
