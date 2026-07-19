import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add any additional config options here
  allowedDevOrigins: ["localhost", "127.0.0.1", "0.0.0.0"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
