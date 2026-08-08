import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-12 gap-8
                    lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-center lg:px-12 lg:py-16">
      <TrackPageView event="page_view_home" />

      {/* Left column: Hero + CTA */}
      <div className="flex flex-col items-center lg:items-start gap-6">
        {/* Logo / Hero */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <div className="text-6xl lg:text-8xl">🐾</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-center lg:text-left text-warm-dark">
            萌宠MBTI
          </h1>
          <p className="text-lg text-center lg:text-left text-warm-600 leading-relaxed">
            完成5分钟趣味测试
            <br />
            解锁你家毛孩子的专属人格
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/test"
          className="bg-warm hover:bg-warm-600 text-white font-bold
                     py-4 px-8 rounded-button w-full lg:w-auto text-center text-lg
                     transition-colors shadow-lg shadow-warm/25 lg:px-12"
        >
          🐱 开始测试
        </Link>
      </div>

      {/* Right column: Feature highlights */}
      <div className="flex flex-col gap-3 w-full lg:gap-4">
        <div className="flex items-center gap-3 bg-white rounded-card px-4 py-3 shadow-sm
                        lg:hover:shadow-md lg:hover:scale-[1.02] lg:transition-all lg:duration-200">
          <span className="text-2xl">🧠</span>
          <span className="text-sm text-warm-dark">20道趣味行为题，科学又有趣</span>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-card px-4 py-3 shadow-sm
                        lg:hover:shadow-md lg:hover:scale-[1.02] lg:transition-all lg:duration-200">
          <span className="text-2xl">🎭</span>
          <span className="text-sm text-warm-dark">16种宠物人格，看看你家的像哪个</span>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-card px-4 py-3 shadow-sm
                        lg:hover:shadow-md lg:hover:scale-[1.02] lg:transition-all lg:duration-200">
          <span className="text-2xl">📤</span>
          <span className="text-sm text-warm-dark">生成精美海报，分享到朋友圈</span>
        </div>
      </div>
    </div>
  );
}
