import { brand } from "@/shared/config/brand";

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
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://petmeal.ir",
    "@graph": [
      {
        "@type": "Organization",
        name: brand.name,
        alternateName: brand.nameEn,
        url: brand.url,
        description: brand.description,
        // email: brand.contact.email,
        sameAs: [
          brand.social.instagram,
          brand.social.telegram,
          // brand.social.twitter,
        ],
      },
      {
        "@type": "WebSite",
        name: brand.name,
        url: brand.url,
        inLanguage: "fa-IR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${brand.url}/categories?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return <JsonLd data={data} />;
}
