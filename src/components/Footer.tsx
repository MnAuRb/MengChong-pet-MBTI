import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  disabled?: boolean;
}

const FOOTER_COLS: { title: string; links: FooterLink[] }[] = [
  {
    title: "产品",
    links: [
      { label: "开始测试", href: "/test" },
      { label: "性格类型", href: "#", disabled: true },
      { label: "品种类型", href: "#", disabled: true },
    ],
  },
  {
    title: "常见问题",
    links: [
      { label: "什么是宠物MBTI？", href: "#", disabled: true },
      { label: "结果科学吗？", href: "#", disabled: true },
      { label: "如何分享结果？", href: "#", disabled: true },
    ],
  },
  {
    title: "团队",
    links: [
      { label: "关于我们", href: "#", disabled: true },
      { label: "联系我们", href: "#", disabled: true },
      { label: "隐私政策", href: "#", disabled: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border py-14 px-6">
      <div className="mx-auto max-w-4xl grid grid-cols-2 gap-10 sm:grid-cols-3">
        {FOOTER_COLS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-brand-text mb-1">
              {col.title}
            </h4>
            {col.links.map((l) =>
              l.disabled ? (
                <span
                  key={l.label}
                  className="text-sm text-brand-muted/40 cursor-not-allowed"
                >
                  {l.label}
                </span>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors no-underline"
                >
                  {l.label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-4xl mt-12 pt-6 border-t border-brand-border/50">
        <p className="text-xs text-brand-muted/50 text-center">
          © 2026 萌宠MBTI · 仅供娱乐参考，不构成专业建议
        </p>
      </div>
    </footer>
  );
}
