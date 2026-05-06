// 百度热搜 —— 数据源：第三方聚合 API（api.xunjinlu.fun）
// 备用方案：api.52vmy.cn/api/wl/hot?type=baidu
import { HotPlatform } from "../types";

export async function fetchBaidu(): Promise<HotPlatform> {
  const res = await fetch("https://api.xunjinlu.fun/api/rebang/baidu.php", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const json = await res.json();
  const list = json?.data?.list ?? [];

  return {
    platform: "baidu",
    title: "百度热搜",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.title ?? "",
      url: v.url ?? `https://www.baidu.com/s?wd=${encodeURIComponent(v.title ?? "")}`,
      heat: v.hot_value ? `${(v.hot_value as number).toLocaleString()} 热度` : undefined,
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
