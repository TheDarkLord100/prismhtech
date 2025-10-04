import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // disables the image optimizer
  },
};

export default nextConfig;
