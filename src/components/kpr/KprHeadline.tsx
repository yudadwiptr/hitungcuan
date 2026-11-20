/**
 * Judul KPR dengan permainan kata: "cuan" dicoret lalu berganti jadi "cicilan".
 * Murni CSS (sekali jalan saat halaman dibuka) — aman SSR/hydration,
 * dan langsung tampil di state akhir bila pengguna memilih reduced motion.
 */
export function KprHeadline() {
  return (
    <h1 className="mt-4 max-w-3xl text-[30px] leading-[1.18] font-bold tracking-tight text-slate-900 sm:text-[40px]">
      Hitung{" "}
      <span className="inline-grid justify-items-start align-bottom">
        <span aria-hidden className="hc-swap-out relative col-start-1 row-start-1 text-slate-400">
          cuan
          <span className="hc-strike absolute top-[55%] right-[-4%] left-[-4%] h-[0.09em] rounded-full bg-rose-500" />
        </span>
        <span className="hc-swap-in col-start-1 row-start-1 text-emerald-600">cicilan</span>
      </span>{" "}
      KPR dulu,
      <br />
      biar tetap <span className="text-emerald-600">cuan.</span>
    </h1>
  );
}
