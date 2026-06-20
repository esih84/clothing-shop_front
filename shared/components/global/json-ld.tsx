import { brand } from "@/shared/config/brand";

/**
 * تزریق داده‌ی ساختاریافته (JSON-LD) برای موتورهای جستجو.
 * این کامپوننت سرور-ساید است و خروجی <script> امن تولید می‌کند.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** اسکیمای سازمان + وب‌سایت برای صفحه‌ی اصلی/layout */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: brand.name,
        alternateName: brand.nameEn,
        url: brand.url,
        description: brand.description,
        email: brand.contact.email,
        sameAs: [
          brand.social.instagram,
          brand.social.telegram,
          brand.social.twitter,
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
