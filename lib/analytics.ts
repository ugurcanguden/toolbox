// Google Analytics helper functions

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || '';
export const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string, measurementId = GA_MEASUREMENT_ID) => {
  if (!measurementId) return;
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', measurementId, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}, measurementId = GA_MEASUREMENT_ID) => {
  if (!measurementId) return;
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
