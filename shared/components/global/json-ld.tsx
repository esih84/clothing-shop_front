import { brand as brandConfig } from "@/shared/config/brand";
import type { SiteSettings } from "@/shared/config/site-settings";

/**
 * Injects structured data (JSON-LD) for search engines.
 * This is a server-side component and produces safe <script> output.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + website schema for the home page/layout */
export function OrganizationJsonLd({ settings }: { settings: SiteSettings }) {
  const { brand, contact } = settings;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: brand.name,
        alternateName: brand.nameEn,
        url: brandConfig.url,
        description: brand.description,
        ...(contact.email ? { email: contact.email } : {}),
        ...(contact.phone ? { telephone: contact.phone } : {}),
        // A blank social field means "not set up yet" — an empty string in
        // sameAs is a schema error, so those are dropped instead of emitted.
        sameAs: [contact.instagram, contact.telegram, contact.whatsapp].filter(
          Boolean,
        ),
      },
      {
        "@type": "WebSite",
        name: brand.name,
        url: brandConfig.url,
        inLanguage: "fa-IR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${brandConfig.url}/categories?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return <JsonLd data={data} />;
}
