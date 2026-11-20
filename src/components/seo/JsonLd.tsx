import { siteConfig } from "@/lib/site";
import { STUDIO } from "@/lib/tools";

/** JSON-LD WebApplication + FAQPage untuk satu halaman kalkulator. */
export function JsonLd({
  name,
  description,
  path,
  faq,
}: {
  name: string;
  description: string;
  path: string;
  faq: { q: string; a: string }[];
}) {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name,
      url,
      description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "id-ID",
      offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
      creator: { "@type": "Organization", name: STUDIO.name, url: STUDIO.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
