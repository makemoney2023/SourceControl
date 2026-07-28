import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/apply",
        destination: "/inquire",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
