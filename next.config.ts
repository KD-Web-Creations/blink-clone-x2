import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel handles output automatically - no standalone needed */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.blink.new',
      },
      {
        protocol: 'https',
        hostname: 'blink.new',
      },
    ],
  },
};

export default nextConfig;
