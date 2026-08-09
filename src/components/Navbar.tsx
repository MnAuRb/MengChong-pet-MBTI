"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/test", label: "开始测试" },
  { href: "#", label: "性格类型", disabled: true },
  { href: "#", label: "品种类型", disabled: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function linkClass(href: string, disabled?: boolean) {
    const base =
      "text-sm font-normal transition-colors py-1";
    if (disabled) {
      return `${base} text-brand-muted/40 cursor-not-allowed`;
    }
    const isActive = href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);
    return isActive
      ? `${base} text-brand-primary font-medium`
      : `${base} text-brand-muted hover:text-brand-text`;
  }

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/70 backdrop-blur-xl border-b border-brand-border/40">
      <div className="mx-auto flex items-center justify-between h-14 px-5 max-w-6xl">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-brand-text no-underline"
        >
          🐾 萌宠MBTI
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={linkClass(l.href, l.disabled)}
              aria-disabled={l.disabled}
              tabIndex={l.disabled ? -1 : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
        >
          <span
            className={`w-5 h-0.5 bg-brand-text rounded-full transition-transform ${
              menuOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-brand-text rounded-full transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-brand-text rounded-full transition-transform ${
              menuOpen ? "-rotate-45 -translate-y-[3px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-5 pb-5 gap-0">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`py-3 text-sm border-b border-brand-border/50 ${
                l.disabled
                  ? "text-brand-muted/40 cursor-not-allowed"
                  : (l.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(l.href))
                    ? "text-brand-primary font-medium"
                    : "text-brand-muted"
              }`}
              aria-disabled={l.disabled}
              tabIndex={l.disabled ? -1 : undefined}
            >
              {l.label}
              {l.disabled && (
                <span className="ml-2 text-[10px] text-brand-muted/40">
                  敬请期待
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
