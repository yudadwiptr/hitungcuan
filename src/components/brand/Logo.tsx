/**
 * Logo HitungCuan: tiga batang naik (pertumbuhan) + koin emas (cuan)
 * di atas rounded-square emerald.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="40" height="40" rx="11" fill="#059669" />
      <path d="M0 11C0 4.925 4.925 0 11 0h18c6.075 0 11 4.925 11 11v4C27 15 13 22 0 30V11Z" fill="#10B981" opacity=".55" />
      <rect x="9" y="22.5" width="5.5" height="9" rx="1.75" fill="#fff" fillOpacity=".6" />
      <rect x="17.25" y="17" width="5.5" height="14.5" rx="1.75" fill="#fff" fillOpacity=".82" />
      <rect x="25.5" y="11" width="5.5" height="20.5" rx="1.75" fill="#fff" />
      <circle cx="13" cy="13.5" r="4.25" fill="#FBBF24" />
      <circle cx="13" cy="13.5" r="2.4" fill="none" stroke="#B45309" strokeOpacity=".55" strokeWidth="1.1" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={"inline-flex items-center gap-2.5 " + (className ?? "")}>
      <LogoMark className="size-8 shrink-0" />
      <span className="text-[17px] font-bold tracking-tight text-slate-900">
        Hitung<span className="text-emerald-600">Cuan</span>
      </span>
    </span>
  );
}
