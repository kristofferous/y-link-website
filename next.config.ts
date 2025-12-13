import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  i18n: {
    locales: ["nb", "en"],
    defaultLocale: "nb",
  },
};

export default nextConfig;
