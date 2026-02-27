'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { pageview, GA_MEASUREMENT_ID, GTM_CONTAINER_ID } from '@/lib/analytics';

const COOKIE_CONSENT_KEY = 'toolbox-cookie-consent';

function getRuntimeAnalyticsIds() {
  if (typeof window === 'undefined') {
    return { gaMeasurementId: GA_MEASUREMENT_ID, gtmContainerId: GTM_CONTAINER_ID };
  }

  const runtime = (window as any).__APP_PUBLIC_ENV || {};
  return {
    gaMeasurementId: runtime.NEXT_PUBLIC_GA_MEASUREMENT_ID || runtime.NEXT_PUBLIC_GA_ID || GA_MEASUREMENT_ID,
    gtmContainerId: runtime.NEXT_PUBLIC_GTM_ID || GTM_CONTAINER_ID,
  };
}

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      const run = () => {
        const { gaMeasurementId } = getRuntimeAnalyticsIds();
        pageview(url, gaMeasurementId);
      };
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        const id = (window as any).requestIdleCallback(run, { timeout: 2000 });
        return () => (window as any).cancelIdleCallback?.(id);
      }
      const timer = setTimeout(run, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ids, setIds] = useState(() => getRuntimeAnalyticsIds());

  useEffect(() => {
    const readConsent = () => {
      try {
        const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!raw) {
          setAnalyticsEnabled(false);
          return;
        }
        const parsed = JSON.parse(raw);
        setAnalyticsEnabled(parsed?.consent === 'accepted');
      } catch {
        setAnalyticsEnabled(false);
      }
    };

    readConsent();
    setIds(getRuntimeAnalyticsIds());
    setMounted(true);
    window.addEventListener('storage', readConsent);
    window.addEventListener('cookie-consent-changed', readConsent);
    return () => {
      window.removeEventListener('storage', readConsent);
      window.removeEventListener('cookie-consent-changed', readConsent);
    };
  }, []);

  if (!mounted || !analyticsEnabled || !ids.gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ids.gaMeasurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ids.gaMeasurementId}', {
              page_path: window.location.pathname,
              send_page_view: false,
              transport_type: 'beacon',
            });
          `,
        }}
      />
      {ids.gtmContainerId && (
        <Script
          id="gtm-loader"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtm.js?id=${ids.gtmContainerId}`}
        />
      )}
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}
