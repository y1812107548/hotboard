// 抖音热榜 —— 数据源：第三方聚合 API（api.xunjinlu.fun）
// 抖音无公开官方热榜 API，备选：api.istero.com（需注册 token）
import { HotPlatform } from "../types";

export async function fetchDouyin(): Promise<HotPlatform> {
  const res = await fetch("https://api.xunjinlu.fun/api/rebang/douyin.php", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const json = await res.json();
  const list = json?.data?.list ?? [];

  return {
    platform: "douyin",
    title: "抖音热榜",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.title ?? "",
      url: v.url ?? `https://www.douyin.com/search/${encodeURIComponent(v.title ?? "")}`,
      heat: v.hot_label ?? (v.hot_value ? `${(v.hot_value as number).toLocaleString()}` : undefined),
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
