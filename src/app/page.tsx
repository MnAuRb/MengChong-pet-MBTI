import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-12 gap-8
                    lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-center lg:px-12 lg:py-16">
      <TrackPageView event="page_view_home" />

      {/* Left column: Hero + CTA */}
      <div className="flex flex-col items-center lg:items-start gap-8">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-normal text-brand-text text-center lg:text-left">
            萌宠MBTI
          </h1>
          <p className="text-lg font-normal text-brand-muted text-center lg:text-left leading-relaxed">
            完成5分钟趣味测试
            <br />
            解锁你家毛孩子的专属人格
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-3">
          <Link
            href="/test"
            className="inline-flex items-center justify-center rounded-full bg-brand-primary text-white
                       text-sm font-medium px-8 py-3 transition-colors hover:bg-brand-text
                       w-full lg:w-auto text-center"
          >
            开始测试
          </Link>
          <Link
            href="/test"
            className="text-sm text-brand-muted underline underline-offset-4 hover:text-brand-text transition-colors"
          >
            了解更多 →
          </Link>
        </div>
      </div>

      {/* Right column: Feature highlights */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-3 bg-brand-surface-alt rounded-lg border border-brand-border px-4 py-4">
          <span className="text-xl">🧠</span>
          <span className="text-sm text-brand-text">20道趣味行为题，科学又有趣</span>
        </div>
        <div className="flex items-center gap-3 bg-brand-surface-alt rounded-lg border border-brand-border px-4 py-4">
          <span className="text-xl">🎭</span>
          <span className="text-sm text-brand-text">16种宠物人格，看看你家的像哪个</span>
        </div>
        <div className="flex items-center gap-3 bg-brand-surface-alt rounded-lg border border-brand-border px-4 py-4">
          <span className="text-xl">📤</span>
          <span className="text-sm text-brand-text">生成精美海报，分享到朋友圈</span>
        </div>
      </div>
    </div>
  );
}
