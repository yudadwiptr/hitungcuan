import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  highlight,
  heading,
  description,
  points,
}: {
  eyebrow: ReactNode;
  title?: string;
  highlight?: string;
  /** Ganti judul standar dengan elemen <h1> custom */
  heading?: ReactNode;
  description: string;
  points: { icon: LucideIcon; label: string }[];
}) {
  return (
    <div className="pt-8 pb-8 sm:pt-10">
      <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-medium text-slate-600 shadow-sm">
        {eyebrow}
      </p>
      {heading ?? (
        <h1 className="mt-4 max-w-3xl text-[30px] leading-[1.15] font-bold tracking-tight text-slate-900 sm:text-[40px]">
          {title} <span className="text-emerald-600">{highlight}</span>
        </h1>
      )}
      <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-slate-600">{description}</p>
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        {points.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <p.icon className="size-4 text-emerald-600" aria-hidden />
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
