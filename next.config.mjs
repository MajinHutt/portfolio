/** @type {import('next').NextConfig} */

// Allow next/image to accept the CDN host. Derived from the same env var the
// app uses, so there is only one place to change when you move buckets.
const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
const remotePatterns = [];

if (assetBase) {
  try {
    const { protocol, hostname } = new URL(assetBase);
    remotePatterns.push({ protocol: protocol.replace(":", ""), hostname });
  } catch {
    console.warn(`[next.config] NEXT_PUBLIC_ASSET_BASE_URL is not a valid URL: ${assetBase}`);
  }
}

const nextConfig = {
  images: {
    remotePatterns,
    // COST CONTROL: Vercel's Image Optimisation is metered on the Hobby tier.
    // Renders are exported pre-optimised (AVIF/WebP) from Blender/Krita, so the
    // optimiser would add billing risk without improving anything. next/image
    // is still used for its reserved aspect box and lazy loading.
    // See docs/COST-CONTROLS.md before changing this.
    unoptimized: true,
  },
};

export default nextConfig;
