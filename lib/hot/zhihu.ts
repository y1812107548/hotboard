// 知乎热榜 —— 数据源：知乎搜索热词 API（无需认证）
// 接口：www.zhihu.com/api/v4/search/top_search
// 注意：原 /api/v3/feed/topstory/hot-lists/total 已需要登录认证
import { HotPlatform } from "../types";

export async function fetchZhihu(): Promise<HotPlatform> {
  const res = await fetch(
    "https://www.zhihu.com/api/v4/search/top_search",
    { headers: { "User-Agent": "Mozilla/5.0" } }
  );
  const json = await res.json();
  const list = json?.top_search?.words ?? [];

  return {
    platform: "zhihu",
    title: "知乎热榜",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.display_query ?? v.query ?? "",
      url: `https://www.zhihu.com/search?q=${encodeURIComponent(v.query ?? "")}&type=content`,
      heat: undefined,
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
