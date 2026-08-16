/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Large originals are fine: these are generated on demand and CDN-cached,
    // so a multi-megabyte JPEG ships to the browser as a few hundred KB.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
}

export default nextConfig
