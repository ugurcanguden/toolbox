'use client';

interface JsonLdToolProps {
  tool: {
    title: string;
    description: string;
    id: string;
    category: string;
  };
  faqs?: { question: string; answer: string }[];
  locale: string;
}

export function JsonLdTool({ tool, faqs, locale }: JsonLdToolProps) {
  const domain = 'https://toolbox.curioboxapp.info';
  const url = `${domain}/${locale}/tools/${tool.id}`;

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": tool.description,
    "url": url,
    "applicationCategory": tool.category === 'pdf' ? 'MultimediaApplication' : 'DeveloperApplication',
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "inLanguage": locale
  };

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
