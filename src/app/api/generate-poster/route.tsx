// @vercel/og 使用 Satori 渲染 JSX → PNG（非 React 渲染）

import { ImageResponse } from "@vercel/og";
import { results } from "@/data/results";
import type { PosterRequest } from "@/types";
import type { MBTIResult } from "@/types";

const TYPE_COLORS: Record<string, { bg: string; accent: string }> = {
  INTJ: { bg: "#1a1a2e", accent: "#e94560" },
  INTP: { bg: "#16213e", accent: "#0f3460" },
  ENTJ: { bg: "#2d1b69", accent: "#fa9d2f" },
  ENTP: { bg: "#1b4332", accent: "#f9c74f" },
  INFJ: { bg: "#240046", accent: "#c77dff" },
  INFP: { bg: "#3c096c", accent: "#e0aaff" },
  ENFJ: { bg: "#3a0ca3", accent: "#f72585" },
  ENFP: { bg: "#7209b7", accent: "#4cc9f0" },
  ISTJ: { bg: "#2c3e50", accent: "#a8d8ea" },
  ISFJ: { bg: "#34495e", accent: "#f8b500" },
  ESTJ: { bg: "#1e3a5f", accent: "#ff6b35" },
  ESFJ: { bg: "#3d2c2e", accent: "#f4845f" },
  ISTP: { bg: "#1a1a1a", accent: "#00b4d8" },
  ISFP: { bg: "#2a1b3d", accent: "#e5989b" },
  ESTP: { bg: "#1b263b", accent: "#e63946" },
  ESFP: { bg: "#3a0ca3", accent: "#ffd60a" },
};

function PosterElement(petName: string, result: MBTIResult, colors: { bg: string; accent: string }) {
  return (
    <div
      style={{
        width: 750,
        height: 1200,
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bg}ee 100%)`,
        color: "#ffffff",
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        padding: 60,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `${colors.accent}22`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `${colors.accent}15`,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
        <span style={{ fontSize: 32 }}>🐾</span>
        <span style={{ fontSize: 28, fontWeight: 600, color: `${colors.accent}cc` }}>
          萌宠MBTI
        </span>
      </div>

      <p style={{ fontSize: 28, color: `${colors.accent}99`, marginBottom: 8, marginTop: 0 }}>
        {petName}是……
      </p>

      <h1
        style={{
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: "0.1em",
          margin: 0,
          color: colors.accent,
          lineHeight: 1.1,
          textShadow: `0 0 60px ${colors.accent}44`,
        }}
      >
        {result.type}
      </h1>

      <p style={{ fontSize: 36, fontWeight: 700, marginTop: 8, marginBottom: 32, color: "#ffffff" }}>
        {result.nickname}
      </p>

      <div
        style={{
          background: `${colors.accent}18`,
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 32,
          borderLeft: `4px solid ${colors.accent}`,
        }}
      >
        <p style={{ fontSize: 26, fontWeight: 500, fontStyle: "italic", lineHeight: 1.5, margin: 0, color: "#ffffffdd" }}>
          &ldquo;{result.quote}&rdquo;
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
        {result.traits.slice(0, 3).map((trait, i) => (
          <span
            key={i}
            style={{
              fontSize: 18,
              padding: "8px 18px",
              borderRadius: 20,
              background: `${colors.accent}22`,
              color: `${colors.accent}ee`,
              fontWeight: 500,
            }}
          >
            {trait}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: 32,
          borderTop: `1px solid ${colors.accent}33`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 18, color: "#ffffff99" }}>你的毛孩子是什么人格？</span>
          <span style={{ fontSize: 22, fontWeight: 600, color: colors.accent }}>
            扫码来测 → 萌宠MBTI
          </span>
        </div>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 16,
            background: `${colors.accent}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
          }}
        >
          📱
        </div>
      </div>
    </div>
  );
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as PosterRequest;

    if (!body.mbtiType || !body.petName) {
      return Response.json({ error: "缺少 mbtiType 或 petName" }, { status: 400 });
    }

    // 名称长度校验（与前端 PetInfoForm maxLength 保持一致）
    if (body.petName.length > 20) {
      return Response.json({ error: "petName 长度不能超过 20 个字符" }, { status: 400 });
    }

    const result = results[body.mbtiType];
    if (!result) {
      return Response.json({ error: `未知的 MBTI 类型: ${body.mbtiType}` }, { status: 400 });
    }

    const colors = TYPE_COLORS[body.mbtiType] ?? { bg: "#2D1B14", accent: "#FF8C42" };

    return new ImageResponse(PosterElement(body.petName, result, colors), {
      width: 750,
      height: 1200,
    });
  } catch (error) {
    console.error("generate-poster error:", error);
    const message = error instanceof Error ? error.message : "海报生成失败";
    return Response.json({ error: message }, { status: 500 });
  }
}
