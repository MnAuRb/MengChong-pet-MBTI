import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-16 gap-6 text-center">
      <div className="text-7xl">🐾❓</div>
      <h1 className="text-2xl font-bold text-warm-dark">
        页面走丢了……
      </h1>
      <p className="text-warm-500 text-sm max-w-xs leading-relaxed">
        毛孩子不知道跑到哪里去了，正在努力寻找中。要不先回家等等？
      </p>
      <Link
        href="/"
        className="bg-warm hover:bg-warm-600 text-white font-bold
                   py-3 px-8 rounded-button text-lg transition-colors"
      >
        🏠 返回首页
      </Link>
    </div>
  );
}
