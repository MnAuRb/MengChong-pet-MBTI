"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePetContext } from "@/contexts/PetContext";
import { track } from "@/lib/analytics";

type Status = "loading" | "error" | "ready";

export default function SharePage() {
  const { petInfo, resultType } = usePetContext();
  const [status, setStatus] = useState<Status>("loading");
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fetchedRef = useRef(false);

  const missing = !resultType || !petInfo;

  // 每次挂载重置 ref
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

        const res = await fetch("/api/generate-poster", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mbtiType: type,
            petName: info.name,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(err.error ?? `请求失败 (${res.status})`);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPosterUrl(url);
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
    <div className="flex flex-col flex-1 px-6 py-8 gap-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-warm-dark">分享你的毛孩子</h2>
        <p className="text-sm text-warm-500 mt-1">
          长按图片保存到相册，分享给朋友
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {missing ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-500 text-sm">请先完成测试</p>
            <Link href="/" className="text-warm font-medium underline text-sm">
              返回首页
            </Link>
          </div>
        ) : status === "loading" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-warm-200 border-t-warm rounded-full animate-spin" />
            <p className="text-sm text-warm-500">正在生成海报……</p>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-500 text-sm">{errorMsg}</p>
            <button
              onClick={() => {
                fetchedRef.current = false;
                setStatus("loading");
                setErrorMsg("");
              }}
              className="text-warm font-medium underline text-sm"
            >
              重试
            </button>
            <Link href="/result" className="text-warm-400 text-sm underline">
              返回结果页
            </Link>
          </div>
        ) : status === "ready" && posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt="萌宠MBTI分享海报"
            className="w-full rounded-card shadow-xl"
            style={{ maxWidth: 375 }}
          />
        ) : null}
      </div>

      {status === "ready" && (
        <div className="bg-warm-light rounded-card px-4 py-3 text-center">
          <p className="text-sm font-medium text-warm-700">
            👆 长按上方海报图片 → 保存到相册
          </p>
          <p className="text-xs text-warm-500 mt-1">
            然后分享到朋友圈、小红书或发给朋友！
          </p>
        </div>
      )}

      <Link
        href="/result"
        className="text-center text-sm text-warm font-medium underline py-3 min-h-[44px] flex items-center justify-center"
      >
        ← 返回结果页
      </Link>
    </div>
  );
}
