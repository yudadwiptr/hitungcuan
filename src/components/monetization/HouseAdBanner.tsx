import { getImageProps } from "next/image";
import desktopBanner from "../../../public/ads/yumastudio-banner.webp";
import mobileBanner from "../../../public/ads/yumastudio-banner-mobile.webp";
import { siteConfig } from "@/lib/site";

/**
 * Iklan internal (house ad) — tampil selama slot AdSense belum diisi.
 * Art direction: banner lebar di ≥768px, crop 3,2:1 (logo + tagline) di mobile agar tetap terbaca.
 */
export function HouseAdBanner() {
  const { href, alt } = siteConfig.houseAd;
  const common = { alt, sizes: "(min-width: 1024px) 970px, 100vw", priority: true };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktopBanner });
  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({ ...common, src: mobileBanner });

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener"
      aria-label={alt}
      className="group relative block overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/10 transition hover:shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} width={desktopBanner.width} height={desktopBanner.height} />
        <img {...rest} srcSet={mobileSrcSet} alt={alt} className="block h-auto w-full transition duration-300 group-hover:scale-[1.01]" />
      </picture>
      <span className="pointer-events-none absolute top-1.5 left-1.5 rounded bg-slate-900/55 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
        Iklan
      </span>
    </a>
  );
}
