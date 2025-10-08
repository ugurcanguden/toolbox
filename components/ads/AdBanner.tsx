'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks';

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
}

/**
 * Google AdSense Banner Component
 * Only displays ads if user has accepted cookies
 * Usage: <AdBanner dataAdSlot="YOUR_AD_SLOT_ID" />
 */
export function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  className = '',
}: AdBannerProps) {
  const { hasConsent, isLoading } = useCookieConsent();

  useEffect(() => {
    // Only load ads if consent is given
    if (hasConsent) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [hasConsent]);

  // Don't render anything while checking consent or if declined
  if (isLoading || !hasConsent) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9339461513261360"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
