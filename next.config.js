/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  experimental: {
    mdxRs: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
};

module.exports = nextConfig;
