// 掘金热榜 —— 数据源：掘金官方推荐 API（无需认证，POST）
// 接口：api.juejin.cn/recommend_api/v1/article/recommend_all_feed
// 参数 sort_type=200 表示按热度排序，需过滤 item_type=14（广告）
import { HotPlatform } from "../types";

export async function fetchJuejin(): Promise<HotPlatform> {
  const res = await fetch(
    "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed",
    {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_type: 2,
        client_type: 2608,
        sort_type: 200, // 热度排序
        cursor: "0",
        limit: 10,
      }),
    }
  );
  const json = await res.json();
  // 过滤广告条目（item_type === 14）
  const list = (json?.data ?? []).filter((v: any) => v.item_type === 2);

  return {
    platform: "juejin",
    title: "掘金热榜",
    items: list.slice(0, 10).map((v: any, i: number) => {
      const info = v.item_info?.article_info ?? {};
      return {
        rank: i + 1,
        title: info.title ?? "",
        url: `https://juejin.cn/post/${info.article_id ?? ""}`,
        heat: info.view_count ? `${info.view_count.toLocaleString()} 阅读` : undefined,
      };
    }),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
