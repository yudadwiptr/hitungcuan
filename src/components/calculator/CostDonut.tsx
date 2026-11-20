import { formatPercent, formatRupiah } from "@/lib/format";

export interface DonutSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

const R = 15.9155; // keliling = 100 → dasharray langsung dalam persen
const GAP = 0.8;

export function CostDonut({
  segments,
  total,
  centerLabel,
}: {
  segments: DonutSegment[];
  total: number;
  centerLabel: string;
}) {
  const visible = segments.filter((s) => s.value > 0);
  const sum = visible.reduce((a, s) => a + s.value, 0);

  const pcts = visible.map((s) => (sum > 0 ? (s.value / sum) * 100 : 0));
  const arcs = visible.map((s, i) => ({
    ...s,
    len: Math.max(pcts[i] - (visible.length > 1 ? GAP : 0), 0.001),
    offset: pcts.slice(0, i).reduce((a, p) => a + p, 0),
  }));

  const description = visible
    .map((s) => `${s.label} ${formatPercent(sum > 0 ? s.value / sum : 0, 0)}`)
    .join(", ");

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-[132px] shrink-0">
        <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={`Proporsi harga jual: ${description}`}>
          <circle cx="21" cy="21" r={R} fill="none" stroke="#F1F5F9" strokeWidth="5" />
          {arcs.map((a) => (
            <circle
              key={a.key}
              cx="21"
              cy="21"
              r={R}
              fill="none"
              stroke={a.color}
              strokeWidth="5"
              strokeDasharray={`${a.len} ${100 - a.len}`}
              strokeDashoffset={-a.offset}
              className="transition-[stroke-dasharray,stroke-dashoffset] duration-500 ease-out"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{centerLabel}</span>
          <span className="text-[13px] font-bold text-slate-900 tabular-nums">{formatRupiah(total)}</span>
        </div>
      </div>

      <ul className="min-w-0 flex-1 space-y-2">
        {segments.map((s) => {
          const pct = sum > 0 ? s.value / sum : 0;
          return (
            <li key={s.key} className="flex items-center gap-2 text-[12.5px]">
              <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: s.color }} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-slate-600">{s.label}</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatPercent(pct, 0)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
