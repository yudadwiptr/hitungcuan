"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ToolIcon } from "@/components/brand/ToolIcon";
import { cx } from "@/components/ui/form";
import { TOOLS } from "@/lib/tools";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="HitungCuan — beranda"
          className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20"
        >
          <Logo priority className="h-6 w-auto sm:h-7" />
        </Link>

        <nav aria-label="Kalkulator" className="hidden items-center gap-1 rounded-xl bg-slate-100/80 p-1 md:flex">
          {TOOLS.map((tool) => {
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition",
                  active ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-900/5" : "text-slate-600 hover:text-slate-900",
                )}
              >
                <ToolIcon name={tool.icon} className="size-4" />
                {tool.nav}
              </Link>
            );
          })}
        </nav>

        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15 lg:inline-flex">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
          Gratis · tanpa daftar
        </span>
      </div>

      {/* Navigasi mobile: tab horizontal */}
      <nav aria-label="Kalkulator" className="border-t border-slate-100 md:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-1.5 [scrollbar-width:none]">
          {TOOLS.map((tool) => {
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition",
                  active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15" : "text-slate-600",
                )}
              >
                <ToolIcon name={tool.icon} className="size-3.5" />
                {tool.nav}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
