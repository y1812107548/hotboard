import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 部分平台（如 Cloudflare Workers、部分国内 Serverless）不支持 sharp，保持无优化更通用
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
