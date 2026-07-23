"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ShareError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Share page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-16 gap-5 text-center">
      <div className="text-6xl">📤💥</div>
      <h1 className="text-xl font-bold text-warm-dark">海报生成失败</h1>
      <p className="text-warm-500 text-sm max-w-xs leading-relaxed">
        海报生成遇到了问题，返回结果页再试一次吧。
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={reset}
          className="bg-warm hover:bg-warm-600 text-white font-bold
                     py-3 px-8 rounded-button text-base transition-colors"
        >
          🔄 再试一次
        </button>
        <Link href="/result" className="text-warm font-medium underline text-sm">
          返回结果页
        </Link>
      </div>
    </div>
  );
}
