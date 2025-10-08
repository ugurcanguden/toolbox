'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            {t('madeWith')} <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {t('by')}
          </p>
          <p className="font-medium text-foreground">{t('privacy')}</p>
        </div>
      </div>
    </footer>
  );
}

