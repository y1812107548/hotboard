// B站热门视频 —— 数据源：B站官方 API（无需认证）
// 接口：api.bilibili.com/x/web-interface/popular?pn=1&ps=10
// 注意：ranking/v2 接口已失效（-352 风控），改用 popular 接口
import { HotPlatform } from "../types";

export async function fetchBilibili(): Promise<HotPlatform> {
  const res = await fetch(
    "https://api.bilibili.com/x/web-interface/popular?pn=1&ps=10",
    { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.bilibili.com/" } }
  );
  const json = await res.json();
  const list = json?.data?.list ?? [];

  return {
    platform: "bilibili",
    title: "B站热门",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.title,
      url: `https://www.bilibili.com/video/${v.bvid}`,
      heat: `${(v.stat?.view ?? 0).toLocaleString()} 播放`,
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
