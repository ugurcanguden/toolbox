'use client';

import { useEffect, useRef, useState } from 'react';
import { useCookieConsent } from '@/hooks';

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
}

/**
 * Google AdSense Banner Component (Optimized with IntersectionObserver)
 * - Only loads when visible in viewport
 * - Improves page performance and interactivity
 * - Defers ad loading to prevent blocking user interactions
 * Usage: <AdBanner dataAdSlot="YOUR_AD_SLOT_ID" />
 */
export function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  className = '',
}: AdBannerProps) {
  const { hasConsent, isLoading } = useCookieConsent();
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // IntersectionObserver to detect when ad is in viewport
  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '200px', // Load 200px before it's visible
        threshold: 0.01,
      }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // Load ad only when visible and not already loaded
  useEffect(() => {
    if (!isVisible || hasLoaded || isLoading) return;

    const loadAd = () => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setHasLoaded(true);
      } catch (err) {
        // Silently ignore duplicate push errors in development
        if (process.env.NODE_ENV === 'development') {
          // Expected in StrictMode
        } else {
          console.error('AdSense error:', err);
        }
      }
    };

    // Delay ad loading to ensure page is interactive first
    const timer = setTimeout(loadAd, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, hasLoaded, isLoading]);

  // Don't render while checking consent
  if (isLoading) {
    return <div className={className} style={{ minHeight: '100px' }} />;
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9339461513261360"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        // If consent declined, request non-personalized ads
        {...(!hasConsent && { 'data-npa': '1' })}
      />
    </div>
  );
}
