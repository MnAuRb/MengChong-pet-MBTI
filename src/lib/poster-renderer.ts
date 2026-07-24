import { results } from "@/data/results";
import type { MBTIType } from "@/types";

// 16 种 MBTI 海报配色 — 温馨暖色调
const TYPE_COLORS: Record<string, { bg: string; accent: string }> = {
  INTJ: { bg: "#FFF5F0", accent: "#E8734A" },
  INTP: { bg: "#FFF8F3", accent: "#D4956B" },
  ENTJ: { bg: "#FFF3ED", accent: "#C7513B" },
  ENTP: { bg: "#FFFBF5", accent: "#E8A24E" },
  INFJ: { bg: "#FDF5F7", accent: "#D4647E" },
  INFP: { bg: "#FFF5F6", accent: "#C77D9E" },
  ENFJ: { bg: "#FFF3F0", accent: "#E0554E" },
  ENFP: { bg: "#FFFBF3", accent: "#F0A030" },
  ISTJ: { bg: "#F8F4F0", accent: "#B8956E" },
  ISFJ: { bg: "#FFF7F2", accent: "#D4956B" },
  ESTJ: { bg: "#F7F5F2", accent: "#C7774A" },
  ESFJ: { bg: "#FFF5EE", accent: "#E8885A" },
  ISTP: { bg: "#F5F5F3", accent: "#A08060" },
  ISFP: { bg: "#FFF6F4", accent: "#D88A7D" },
  ESTP: { bg: "#FFF4ED", accent: "#E06030" },
  ESFP: { bg: "#FFF8F0", accent: "#F4B840" },
};

const CANVAS_W = 750;
const CANVAS_H = 1200;
const FONT_FAMILY = '"PingFang SC", "Microsoft YaHei", sans-serif';
const TEXT_COLOR = "#2D1B14";

/** 加载图片，返回 HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`加载图片失败: ${src}`));
    img.src = src;
  });
}

/** 绘制圆角矩形路径 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** 纯测量：根据 ctx.measureText 计算该段文字需要的总高度（不绘制） */
function measureTextHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = text.split("");
  let line = "";
  let lineCount = 1;
  for (const char of chars) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      line = char;
      lineCount++;
    } else {
      line = testLine;
    }
  }
  return lineCount * lineHeight;
}

/** 在 Canvas 上绘制文字，超出 maxWidth 自动换行。返回实际绘制的总高度。 */
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = text.split("");
  let line = "";
  let currentY = y;

  for (const char of chars) {
    const testLine = line + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.length > 0) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY - y;
}

/**
 * 客户端 Canvas 合成分享海报
 * @param mbtiType 用户 MBTI 结果类型（如 "INTJ"）
 * @param petName  用户宠物名字
 * @returns base64 data URL (image/png)
 */
export async function renderPoster(
  mbtiType: MBTIType,
  petName: string
): Promise<string> {
  const result = results[mbtiType];
  if (!result) throw new Error(`未知的 MBTI 类型: ${mbtiType}`);

  const colors = TYPE_COLORS[mbtiType] ?? { bg: "#FFF5F0", accent: "#E8734A" };

  // ---- 创建 Canvas ----
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W * 2;
  canvas.height = CANVAS_H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  // ---- 1. 背景渐变 ----
  const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bgGradient.addColorStop(0, colors.bg);
  bgGradient.addColorStop(1, `${colors.accent}15`);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // ---- 2. 装饰圆形 ----
  ctx.fillStyle = `${colors.accent}18`;
  ctx.beginPath();
  ctx.arc(CANVAS_W + 50, -50, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `${colors.accent}10`;
  ctx.beginPath();
  ctx.arc(-30, CANVAS_H + 30, 180, 0, Math.PI * 2);
  ctx.fill();

  // ---- 3. 品牌头 ----
  ctx.font = `700 32px ${FONT_FAMILY}`;
  ctx.fillStyle = colors.accent;
  ctx.textBaseline = "top";
  ctx.fillText("🐾 萌宠MBTI", 60, 60);

  // ---- 4. 人格形象图（320px 圆形） ----
  const imgSrc = `/images/personalities/${mbtiType}.png`;
  const img = await loadImage(imgSrc);
  const imgSize = 320;
  const imgX = (CANVAS_W - imgSize) / 2;
  const imgY = 120;
  ctx.save();
  ctx.beginPath();
  ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
  ctx.restore();
  // 圆形描边
  ctx.strokeStyle = `${colors.accent}55`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  let y = 500;

  // ---- 5. "{petName}是…" ----
  ctx.font = `500 28px ${FONT_FAMILY}`;
  ctx.fillStyle = `${colors.accent}cc`;
  ctx.textAlign = "center";
  ctx.fillText(`${petName}是……`, CANVAS_W / 2, y);
  y += 52;

  // ---- 6. MBTI 类型大标题（带发光） ----
  ctx.font = `800 108px ${FONT_FAMILY}`;
  ctx.fillStyle = colors.accent;
  ctx.shadowColor = `${colors.accent}33`;
  ctx.shadowBlur = 30;
  ctx.fillText(result.type, CANVAS_W / 2, y);
  ctx.shadowBlur = 0;
  y += 120;

  // ---- 7. 昵称 ----
  ctx.font = `700 40px ${FONT_FAMILY}`;
  ctx.fillStyle = TEXT_COLOR;
  ctx.fillText(result.nickname, CANVAS_W / 2, y);
  y += 64;
  ctx.textAlign = "left";

  // ---- 8. 金句 ----
  const quoteX = 80;
  const quoteW = CANVAS_W - 160;
  const quoteBoxY = y;

  ctx.font = `500 28px ${FONT_FAMILY}`;
  const lineH = 42;
  // 只用 measureTextHeight 计算高度，不绘制
  const quoteHeight = measureTextHeight(ctx, result.quote, quoteW - 48, lineH);
  const quoteBoxH = quoteHeight + 52;

  // 背景框
  ctx.fillStyle = `${colors.accent}15`;
  roundRect(ctx, quoteX, quoteBoxY, quoteW, quoteBoxH, 16);
  ctx.fill();
  // 左侧 accent 竖线
  ctx.fillStyle = colors.accent;
  ctx.fillRect(quoteX + 4, quoteBoxY + 14, 4, quoteBoxH - 28);

  // 金句文字（只绘制一次）
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `500 28px ${FONT_FAMILY}`;
  drawWrappedText(ctx, result.quote, quoteX + 28, quoteBoxY + 22, quoteW - 48, lineH);

  y = quoteBoxY + quoteBoxH + 32;

  // ---- 9. 行为特点标签 ----
  const tagsToShow = result.traits.slice(0, 3);
  const tagHeight = 38;
  const tagPadding = 20;
  let tagX = 80;

  ctx.font = `500 18px ${FONT_FAMILY}`;
  for (const trait of tagsToShow) {
    const tagW = ctx.measureText(trait).width + tagPadding * 2;
    const tagR = tagHeight / 2;

    ctx.fillStyle = `${colors.accent}1e`;
    roundRect(ctx, tagX, y, tagW, tagHeight, tagR);
    ctx.fill();

    ctx.fillStyle = colors.accent;
    ctx.textBaseline = "middle";
    ctx.fillText(trait, tagX + tagPadding, y + tagHeight / 2);

    tagX += tagW + 14;
  }

  y += 70;

  // ---- 10. 底部回流 CTA ----
  const bottomY = CANVAS_H - 180;
  ctx.strokeStyle = `${colors.accent}33`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, bottomY);
  ctx.lineTo(CANVAS_W - 80, bottomY);
  ctx.stroke();

  const ctaY = bottomY + 36;
  ctx.font = `18px ${FONT_FAMILY}`;
  ctx.fillStyle = `${TEXT_COLOR}88`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText("你的毛孩子是什么人格？", 80, ctaY);

  ctx.font = `600 22px ${FONT_FAMILY}`;
  ctx.fillStyle = colors.accent;
  ctx.fillText("扫码来测 → 萌宠MBTI", 80, ctaY + 28);

  // ---- 11. 返回 base64 ----
  return canvas.toDataURL("image/png");
}
