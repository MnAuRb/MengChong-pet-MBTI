import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export default function Home() {
  return (
    <>
      <TrackPageView event="page_view_home" />

      {/* ================================================================ */}
      {/*  HERO — 双背景图：手机竖版 / 桌面横版                                */}
      {/*  图片就位后，把 globals.css 中 .hero-bg 的渐变替换为 url()           */}
      {/* ================================================================ */}
      <section
        className="hero-bg relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <h1
            className="text-[56px] lg:text-[72px] font-extrabold leading-[1.08] tracking-[-0.025em] mb-5"
            style={{ color: "#FFFFFF", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
          >
            萌宠<span style={{ color: "#FFF8EF" }}>MBTI</span>
          </h1>
          <p
            className="text-lg lg:text-xl font-normal leading-relaxed mb-10 max-w-md"
            style={{ color: "#FFF8EF", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            完成5分钟趣味测试
            <br />
            解锁你家毛孩子的专属人格
          </p>
          <Link
            href="/test"
            className="inline-flex items-center justify-center rounded-full px-10 py-3.5
                       text-[15px] font-semibold
                       transition-all active:scale-95"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#40342F",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            开始测试
          </Link>
          <p className="mt-6 text-xs" style={{ color: "rgba(255,248,239,0.6)" }}>
            ↓ 向下滚动了解更多
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  FEATURES                                                         */}
      {/* ================================================================ */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">
          {/* Intro */}
          <div className="text-center max-w-md">
            <h2 className="text-[28px] lg:text-[36px] font-bold leading-[1.2] tracking-[-0.015em] text-brand-text mb-3">
              5分钟，了解你的毛孩子
            </h2>
            <p className="text-base font-normal text-brand-muted leading-relaxed">
              基于行为心理学设计，20道趣味题目，科学又有趣
            </p>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-3 w-full sm:flex-row sm:gap-4">
            <div className="flex items-center gap-3 bg-brand-surface rounded-xl border border-brand-border px-5 py-4 flex-1">
              <span className="text-2xl">🧠</span>
              <span className="text-sm text-brand-text">
                20道趣味行为题，科学又有趣
              </span>
            </div>
            <div className="flex items-center gap-3 bg-brand-surface rounded-xl border border-brand-border px-5 py-4 flex-1">
              <span className="text-2xl">🎭</span>
              <span className="text-sm text-brand-text">
                16种宠物人格，看看你家的像哪个
              </span>
            </div>
            <div className="flex items-center gap-3 bg-brand-surface rounded-xl border border-brand-border px-5 py-4 flex-1">
              <span className="text-2xl">📤</span>
              <span className="text-sm text-brand-text">
                生成精美海报，分享到朋友圈
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-brand-muted/40 text-center max-w-sm leading-relaxed">
            * 本测试仅供娱乐参考，不构成专业心理学评估。结果基于趣味行为问卷，请勿作为决策依据。
          </p>
        </div>
      </section>
    </>
  );
}
