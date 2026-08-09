import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "萌宠MBTI — 发现你家毛孩子的隐藏人格",
  description:
    "完成5分钟趣味测试，解锁你家宠物的专属MBTI人格！猫咪军师、狗狗外交官……16种宠物人格等你来测。",
  openGraph: {
    title: "萌宠MBTI — 发现你家毛孩子的隐藏人格",
    description:
      "完成5分钟趣味测试，解锁你家宠物的专属MBTI人格！",
    type: "website",
    locale: "zh_CN",
    siteName: "萌宠MBTI",
  },
  twitter: {
    card: "summary_large_image",
    title: "萌宠MBTI — 发现你家毛孩子的隐藏人格",
    description:
      "完成5分钟趣味测试，解锁你家宠物的专属MBTI人格！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased bg-brand-bg">
      <body className="min-h-full flex flex-col mx-auto bg-brand-bg text-brand-text sm:max-w-2xl lg:max-w-6xl">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
