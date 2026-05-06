// 统一热榜 API 路由：/api/hot/[platform]
// Next.js API Routes 在后端运行，绕过浏览器 CORS 限制
// 每个平台独立 fetcher + 内存缓存，互不阻塞

import { NextRequest, NextResponse } from "next/server";
import { getCached, getStale, setCache } from "@/lib/cache";
import { fetchBilibili } from "@/lib/hot/bilibili";
import { fetchZhihu } from "@/lib/hot/zhihu";
import { fetchWeibo } from "@/lib/hot/weibo";
import { fetchGithub } from "@/lib/hot/github";
import { fetchBaidu } from "@/lib/hot/baidu";
import { fetchToutiao } from "@/lib/hot/toutiao";
import { fetchDouyin } from "@/lib/hot/douyin";
import { fetchJuejin } from "@/lib/hot/juejin";
import { fetchTieba } from "@/lib/hot/tieba";

// 平台注册表：新增平台只需在此加一行
const fetchers: Record<string, () => Promise<import("@/lib/types").HotPlatform>> = {
  bilibili: fetchBilibili,
  zhihu: fetchZhihu,
  weibo: fetchWeibo,
  github: fetchGithub,
  baidu: fetchBaidu,
  toutiao: fetchToutiao,
  douyin: fetchDouyin,
  juejin: fetchJuejin,
  tieba: fetchTieba,
};

/** Promise.race 超时包装：上游 API 10 秒无响应则抛出错误 */
async function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  const timer = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("上游 API 请求超时")), ms)
  );
  return Promise.race([promise, timer]);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const fetcher = fetchers[platform];

  if (!fetcher) {
    return NextResponse.json(
      { status: "error", error: `Unknown platform: ${platform}` },
      { status: 404 }
    );
  }

  // 命中有效缓存直接返回，避免重复请求上游 API
  const cached = getCached(platform);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const data = await withTimeout(fetcher());
    setCache(platform, data);
    return NextResponse.json(data);
  } catch (e: any) {
    // fetch 失败时尝试返回过期缓存作为降级
    const stale = getStale(platform);
    if (stale) return NextResponse.json(stale);

    return NextResponse.json({
      platform,
      title: platform,
      items: [],
      updatedAt: new Date().toISOString(),
      status: "error",
      error: e.message ?? "Failed to fetch",
    });
  }
}
