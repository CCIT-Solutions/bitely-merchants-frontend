const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
      domains: ['api-blog.calo.app'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.bitelyapp.net",
      },
      {
        protocol: "https",
        hostname: "api.bitelyapp.net",
      },
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = withBundleAnalyzer(nextConfig);
