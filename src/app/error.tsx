"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-16 gap-5 text-center">
      <div className="text-6xl">😿</div>
      <h1 className="text-xl font-bold text-warm-dark">
        哎呀，出了点小问题
      </h1>
      <p className="text-warm-500 text-sm max-w-xs leading-relaxed">
        毛孩子不小心把东西弄乱了，我们正在收拾中……
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="bg-warm hover:bg-warm-600 text-white font-bold
                     py-3 px-8 rounded-button text-base transition-colors"
        >
          🔄 再试一次
        </button>
        <Link
          href="/"
          className="text-warm font-medium underline text-sm"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
