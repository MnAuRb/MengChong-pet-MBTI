import { NextResponse } from "next/server";
import { calculateMBTI } from "@/lib/mbti-calculator";
import type { CalculateRequest, CalculateResponse } from "@/types";

const VALID_POLES = ["E", "I", "S", "N", "T", "F", "J", "P"] as const;

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as CalculateRequest;

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "缺少 answers 字段" }, { status: 400 });
    }

    if (body.answers.length !== 20) {
      return NextResponse.json(
        { error: `需要 20 道题答案，收到 ${body.answers.length} 道` },
        { status: 400 }
      );
    }

    // 校验每条答案结构
    for (let i = 0; i < body.answers.length; i++) {
      const a = body.answers[i];
      if (typeof a.questionId !== "number" || a.questionId < 1 || a.questionId > 20) {
        return NextResponse.json(
          { error: `第 ${i + 1} 条答案 questionId 无效` },
          { status: 400 }
        );
      }
      if (typeof a.selectedPole !== "string" || !VALID_POLES.includes(a.selectedPole)) {
        return NextResponse.json(
          { error: `第 ${i + 1} 条答案 selectedPole 无效: ${a.selectedPole}` },
          { status: 400 }
        );
      }
    }

    const type = calculateMBTI(body.answers);

    const result: CalculateResponse = { type };

    return NextResponse.json(result);
  } catch (error) {
    console.error("calculate error:", error);
    const message =
      error instanceof Error ? error.message : "计算失败，请重试";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
