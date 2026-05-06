// 头条热榜 —— 数据源：今日头条官方接口（无需认证）
// 接口：www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc
// 返回字段 Title, Url, HotValue, Label 等
import { HotPlatform } from "../types";

export async function fetchToutiao(): Promise<HotPlatform> {
  const res = await fetch(
    "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc",
    {
      headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.toutiao.com/" },
    }
  );
  const json = await res.json();
  const list = json?.data ?? [];

  return {
    platform: "toutiao",
    title: "头条热榜",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.Title ?? "",
      url: v.Url ?? `https://www.toutiao.com/trending/${v.ClusterId ?? ""}`,
      heat: v.HotValue ? `${parseInt(v.HotValue).toLocaleString()} 热度` : undefined,
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
