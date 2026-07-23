import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import type { TrackPayload } from "@/types";

const VALID_EVENTS: Set<string> = new Set([
  "page_view_home",
  "click_start_test",
  "test_started",
  "test_completed",
  "page_view_result",
  "click_share",
  "share_completed",
  "click_retest",
]);

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as TrackPayload;

    if (!body.event || !body.session_id) {
      return NextResponse.json(
        { error: "缺少 event 或 session_id" },
        { status: 400 }
      );
    }

    if (!VALID_EVENTS.has(body.event)) {
      return NextResponse.json(
        { error: `无效的 event 类型: ${body.event}` },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer.from("analytics_events").insert({
      session_id: body.session_id,
      event: body.event,
      pet_type: body.pet_type ?? null,
      mbti_type: body.mbti_type ?? null,
      screen_size: body.screen_size ?? null,
      user_agent: request.headers.get("user-agent") ?? null,
    });

    if (error) {
      console.error("track insert error:", error.message);
      return NextResponse.json({ error: "写入失败" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("track error:", error);
    return NextResponse.json({ error: "埋点失败" }, { status: 500 });
  }
}
