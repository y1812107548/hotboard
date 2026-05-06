// 微博热搜 —— 数据源：微博官方 Ajax 接口（无需登录）
// 接口：weibo.com/ajax/side/hotSearch
// 注意：需携带 Referer 头，否则会被拒绝
import { HotPlatform } from "../types";

export async function fetchWeibo(): Promise<HotPlatform> {
  const res = await fetch("https://weibo.com/ajax/side/hotSearch", {
    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://weibo.com/" },
  });
  const json = await res.json();
  const list = json?.data?.realtime ?? [];

  return {
    platform: "weibo",
    title: "微博热搜",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.word ?? v.note ?? "",
      url: `https://s.weibo.com/weibo?q=${encodeURIComponent(v.word ?? "")}`,
      heat: v.num ? `${v.num} 热度` : (v.raw_hot ? `${v.raw_hot}` : undefined),
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
