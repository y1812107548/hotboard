// B站热搜 —— 数据源：B站官方搜索热词 API（无需认证）
// 接口：s.search.bilibili.com/main/hotword
// 注意：api.bilibili.com 的 popular/ranking 接口在 Cloudflare Workers IP 下会被风控拦截（返回 HTML），
//       改用搜索热词接口，数据为实时热搜关键词，更贴合热榜定位。
import { HotPlatform } from "../types";

export async function fetchBilibili(): Promise<HotPlatform> {
  const res = await fetch(
    "https://s.search.bilibili.com/main/hotword",
    { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://search.bilibili.com/" } }
  );
  const json = await res.json();
  const list = json?.list ?? [];

  return {
    platform: "bilibili",
    title: "B站热搜",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.show_name || v.keyword,
      url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(v.keyword)}`,
      heat: v.heat_score ? v.heat_score.toLocaleString() : undefined,
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
