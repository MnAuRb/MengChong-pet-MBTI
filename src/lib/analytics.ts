import type { TrackEvent, TrackPayload } from "@/types";

let sessionId: string | null = null;

function getSessionId(): string {
  if (typeof window === "undefined") return "server";

  if (!sessionId) {
    const stored = localStorage.getItem("mbti_session_id");
    if (stored) {
      sessionId = stored;
    } else {
      sessionId = crypto.randomUUID();
      localStorage.setItem("mbti_session_id", sessionId);
    }
  }
  return sessionId;
}

function getScreenSize(): string {
  if (typeof window === "undefined") return "server";
  return `${window.innerWidth}x${window.innerHeight}`;
}

export async function track(
  event: TrackEvent,
  extra?: Partial<Pick<TrackPayload, "pet_type" | "mbti_type">>
): Promise<void> {
  try {
    const payload: TrackPayload = {
      event,
      session_id: getSessionId(),
      screen_size: getScreenSize(),
      ...extra,
    };

    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // 埋点静默失败，不影响用户体验
  }
}
