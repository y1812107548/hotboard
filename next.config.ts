import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare 适配：跳过 Next.js Image 优化（Workers 不支持 sharp）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
