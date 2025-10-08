import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/${params.locale}/tools`,
      languages: {
        en: '/en/tools',
        de: '/de/tools',
        tr: '/tr/tools',
        fr: '/fr/tools',
        pt: '/pt/tools',
      },
    },
  };
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
