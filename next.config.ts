import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.msscdn.net",
      },
    ],
  },
};

export default nextConfig;
