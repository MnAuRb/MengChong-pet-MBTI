"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePetContext } from "@/contexts/PetContext";
import { renderPoster } from "@/lib/poster-renderer";
import { getBreedSlug } from "@/lib/breed-image";
import { dogResults } from "@/data/dog-results";
import { catResults } from "@/data/cat-results";
import { track } from "@/lib/analytics";
import type { MBTIResult } from "@/types";

type Status = "loading" | "error" | "ready";

export default function SharePage() {
  const { petInfo, resultType } = usePetContext();
  const [status, setStatus] = useState<Status>("loading");
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fetchedRef = useRef(false);

  const missing = !resultType || !petInfo;

  useEffect(() => {
    fetchedRef.current = false;
  }, []);

  useEffect(() => {
    if (missing) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function generate() {
      try {
        const info = petInfo!;
        const type = resultType!;

        const breedSlug = getBreedSlug(info.breed, info.type);
        const resultsMap: Record<string, MBTIResult> =
          info.type === "cat" ? catResults : dogResults;
        const result = resultsMap[type];
        if (!result) throw new Error(`未知的 MBTI 类型: ${type}`);

        const dataUrl = await renderPoster(type, info.name, breedSlug, info.type, result);
        setPosterUrl(dataUrl);
        setStatus("ready");
        track("share_completed", {
          pet_type: info.type,
          mbti_type: type,
        });
      } catch (e) {
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "海报生成失败，请重试");
      }
    }

    generate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missing]);

  return (
    <div className="flex flex-col flex-1 px-6 py-8 gap-5
                    lg:grid lg:grid-cols-[auto_1fr] lg:gap-10 lg:items-start lg:px-12 lg:py-10">

      {/* 标题 — 手机显示在顶部，桌面端移到右栏 */}
      <div className="text-center lg:hidden">
        <h2 className="text-xl font-normal text-brand-text">分享你的毛孩子</h2>
        <p className="text-sm text-brand-muted mt-1">
          长按图片保存到相册，分享给朋友
        </p>
      </div>

      {/* 左栏：海报区域 */}
      <div className="flex-1 flex items-center justify-center lg:flex-initial">
        {missing ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-brand-error text-sm">请先完成测试</p>
            <Link href="/" className="text-brand-text font-normal underline underline-offset-4 text-sm">
              返回首页
            </Link>
          </div>
        ) : status === "loading" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-brand-surface-alt border-t-brand-primary rounded-full animate-spin" />
            <p className="text-sm text-brand-muted">正在生成海报……</p>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-brand-error text-sm">{errorMsg}</p>
            <button
              onClick={() => {
                fetchedRef.current = false;
                setStatus("loading");
                setErrorMsg("");
              }}
              className="text-brand-text font-normal underline underline-offset-4 text-sm"
            >
              重试
            </button>
            <Link href="/result" className="text-brand-muted text-sm underline underline-offset-4">
              返回结果页
            </Link>
            <Link
              href="/"
              className="rounded-full bg-brand-primary hover:bg-brand-text text-white
                         text-sm font-medium py-3 px-8 w-full text-center
                         transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        ) : status === "ready" && posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt="萌宠MBTI分享海报"
            className="w-full rounded-lg"
            style={{ maxWidth: 375 }}
          />
        ) : null}
      </div>

      {/* 右栏：说明信息（桌面端显示） */}
      <div className="flex flex-col gap-5 lg:gap-6">
        {/* 标题 — 仅桌面端显示 */}
        <div className="hidden lg:block">
          <h2 className="text-xl font-normal text-brand-text">分享你的毛孩子</h2>
          <p className="text-sm text-brand-muted mt-1">
            长按图片保存到相册，分享给朋友
          </p>
        </div>

        {/* 保存提示 */}
        {status === "ready" && (
          <div className="bg-brand-surface-alt border border-brand-border rounded-lg px-4 py-3 text-center lg:text-left">
            <p className="text-sm font-normal text-brand-text">
              👆 长按上方海报图片 → 保存到相册
            </p>
            <p className="text-xs text-brand-muted mt-1">
              然后分享到朋友圈、小红书或发给朋友！
            </p>
          </div>
        )}

        {/* 分享步骤引导 — 桌面端显示 */}
        <div className="hidden lg:flex lg:flex-col lg:gap-2">
          <p className="text-sm font-normal text-brand-text">📋 如何分享？</p>
          <ol className="text-sm text-brand-muted space-y-1 list-decimal list-inside">
            <li>长按左侧海报保存到相册</li>
            <li>打开微信朋友圈或小红书</li>
            <li>选择图片发布，秀出你家毛孩子！</li>
          </ol>
        </div>

        <Link
          href="/result"
          className="inline-flex items-center justify-center
                     rounded-full border-2 border-brand-primary text-brand-primary
                     hover:bg-brand-primary/25 hover:border-brand-text hover:text-brand-text
                     text-sm font-medium
                     py-3 px-8 w-full text-center
                     transition-colors lg:w-44 lg:self-start"
        >
          ← 返回结果页
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center
                     rounded-full bg-brand-primary hover:bg-brand-text text-white
                     text-sm font-medium py-3 px-8 w-full text-center
                     transition-colors lg:w-44 lg:self-start"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
