import Script from "next/script";

/**
 * Cloudflare Web Analytics.
 *
 * Chosen over Google Analytics and Vercel Analytics for three reasons:
 *
 *   - It sets no cookies and stores nothing on the visitor's device, so it does
 *     not need a consent banner under UK PECR. A banner would be the single
 *     most damaging thing we could add to a portfolio: the first interaction an
 *     admissions tutor has should not be dismissing a dialog.
 *   - It is free and unmetered, with no card and no paid tier to drift into.
 *     See docs/COST-CONTROLS.md.
 *   - It reports page views, referrers and countries, which is all that is
 *     genuinely knowable anyway. Anything claiming to identify a visitor is
 *     inferring, not knowing.
 *
 * Dormant until NEXT_PUBLIC_CF_BEACON_TOKEN is set: with no token this renders
 * nothing at all and makes no request. Setup in docs/ANALYTICS.md.
 *
 * `afterInteractive` so the beacon never competes with the page or the models
 * for bandwidth. Analytics that slow a portfolio down are a bad trade.
 */
export function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
