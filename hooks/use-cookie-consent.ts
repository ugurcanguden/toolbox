'use client';

import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'toolbox-cookie-consent';

export type ConsentStatus = 'accepted' | 'declined' | null;

export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check consent status from localStorage
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (consent) {
          try {
            // Try to parse as JSON (new format)
            const consentData = JSON.parse(consent);
            setConsentStatus(consentData.consent);
          } catch {
            // Handle old format (plain string)
            if (consent === 'accepted' || consent === 'declined') {
              setConsentStatus(consent as ConsentStatus);
            }
          }
        }
      } catch (error) {
        console.error('Error reading cookie consent:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConsent();

    // Listen for storage changes (from other tabs or consent manager)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) {
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    consentStatus,
    isLoading,
    hasConsent: consentStatus === 'accepted',
    hasDeclined: consentStatus === 'declined',
    isConsentGiven: consentStatus !== null,
  };
}
