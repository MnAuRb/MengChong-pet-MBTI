"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TestError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Test page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-16 gap-5 text-center">
      <div className="text-6xl">🐾💦</div>
      <h1 className="text-xl font-bold text-warm-dark">测试页面出错了</h1>
      <p className="text-warm-500 text-sm max-w-xs leading-relaxed">
        毛孩子突然跑开了，让我们重来一次吧。
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={reset}
          className="bg-warm hover:bg-warm-600 text-white font-bold
                     py-3 px-8 rounded-button text-base transition-colors"
        >
          🔄 重新加载
        </button>
        <Link href="/" className="text-warm font-medium underline text-sm">
          返回首页
        </Link>
      </div>
    </div>
  );
}
