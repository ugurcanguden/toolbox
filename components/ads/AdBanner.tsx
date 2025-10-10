'use client';

import { useEffect, useState } from 'react';
import { AdUnit } from 'next-google-adsense';
import { useCookieConsent } from '@/hooks';

interface AdBannerProps {
  dataAdSlot: string;
  className?: string;
}

/**
 * Google AdSense Banner Component (via next-google-adsense)
 * - Clean integration with next-google-adsense library
 * - Respects user cookie consent (GDPR/CCPA compliant)
 * - Non-personalized ads when consent declined
 * Usage: <AdBanner dataAdSlot="YOUR_AD_SLOT_ID" />
 */
export function AdBanner({
  dataAdSlot,
  className = '',
}: AdBannerProps) {
  const { hasConsent, isLoading } = useCookieConsent();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR/hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show placeholder while loading consent
  if (!isMounted || isLoading) {
    return <div className={className} style={{ minHeight: '100px' }} />;
  }

  return (
    <div className={className}>
      <AdUnit
        publisherId="ca-pub-9339461513261360"
        slotId={dataAdSlot}
        layout="display"
        // Non-personalized ads when consent declined
        {...(!hasConsent && { 'data-npa': '1' })}
      />
    </div>
  );
}
