'use client';

import { useEffect, useRef, useState } from 'react';
import { useCookieConsent } from '@/hooks';

interface InArticleAdProps {
  dataAdSlot: string;
  className?: string;
}

/**
 * Google AdSense In-Article Ad Component (Optimized)
 * - Only loads when visible in viewport
 * - Improves page performance and interactivity
 * - Defers ad loading to prevent blocking user interactions
 * For placing ads within content
 */
export function InArticleAd({
  dataAdSlot,
  className = 'my-8',
}: InArticleAdProps) {
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
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-9339461513261360"
        data-ad-slot={dataAdSlot}
        data-ad-format="fluid"
        data-ad-layout="in-article"
        // If consent declined, request non-personalized ads
        {...(!hasConsent && { 'data-npa': '1' })}
      />
    </div>
  );
}
