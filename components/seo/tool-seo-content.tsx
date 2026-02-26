'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Star, ShieldCheck } from 'lucide-react';

interface ToolSeoContentProps {
  toolId: string;
}

export function ToolSeoContent({ toolId }: ToolSeoContentProps) {
  const t = useTranslations(`tools.${toolId}.seo`);

  const howToUse = t.raw('howToUse') as string[];
  const features = t.raw('features') as string[];
  const privacy = t('privacy');

  return (
    <div className="mt-16 space-y-12 border-t pt-12">
      <section>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t('howToUseTitle')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howToUse.map((step, index) => (
            <Card key={index} className="bg-muted/30 border-none">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary/20 mb-4">{index + 1}</div>
                <p className="text-muted-foreground">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t('featuresTitle')}</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 bg-card p-4 rounded-lg border">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold">{t('privacyTitle')}</h2>
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {privacy}
        </p>
      </section>
    </div>
  );
}
