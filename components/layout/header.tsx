'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';
import { CommandPalette } from './command-palette';
import type { Locale } from '@/i18n/request';
import { Code2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('navigation');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-6 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl rounded-full border border-border/60 bg-background/80 backdrop-blur-lg shadow-lg transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Left: Logo */}
          <div className="flex flex-1 items-center justify-start">
            <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity" aria-label={`${tCommon('appName')} - ${tCommon('home') ?? 'Home'}`}>
              <Code2 className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline">{tCommon('appName')}</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex flex-none items-center justify-center gap-8">
            <Link href={`/${locale}`} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              {tNav('home')}
            </Link>
            <Link href={`/${locale}/blog`} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              {tNav('blog')}
            </Link>
            <Link href={`/${locale}/about`} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              {tNav('about')}
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
            <div>
              <CommandPalette locale={locale} />
            </div>
            <LocaleSwitcher currentLocale={locale} />
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div id="mobile-nav" className="absolute top-full left-0 right-0 mt-3 mx-auto w-[calc(100%-2rem)] max-w-sm rounded-[2rem] border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-xl md:hidden overflow-hidden origin-top animate-in slide-in-from-top-2 fade-in duration-200">
            <nav className="flex flex-col p-4 gap-2">
              <Link
                href={`/${locale}`}
                className="px-4 py-3 text-sm font-semibold rounded-2xl hover:bg-muted/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tNav('home')}
              </Link>
              <Link
                href={`/${locale}/blog`}
                className="px-4 py-3 text-sm font-semibold rounded-2xl hover:bg-muted/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tNav('blog')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="px-4 py-3 text-sm font-semibold rounded-2xl hover:bg-muted/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tNav('about')}
              </Link>
              <div className="px-4 py-3 sm:hidden">
                <CommandPalette locale={locale} />
              </div>
            </nav>
          </div>
        )}
      </header>
  );
}
