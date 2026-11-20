import Image from "next/image";
import logo from "../../../public/brand/logo.png";

/** Wordmark "hitungcuan." — aset di public/brand/logo.png (generate: node scripts/generate-brand.mjs). */
export function Logo({ className = "h-7 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src={logo} alt="HitungCuan" className={className} priority={priority} sizes="160px" />;
}
