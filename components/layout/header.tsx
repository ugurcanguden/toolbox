'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';
import type { Locale } from '@/i18n/request';
import { Code2 } from 'lucide-react';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl">
          <Code2 className="h-6 w-6" />
          <span className="hidden sm:inline">{t('appName')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LocaleSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

