// GitHub Trending —— 数据源：GitHub Search API（官方，无需认证）
// 接口：api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc
// 限制：未认证请求 10次/分钟，富足于 5 分钟缓存周期
import { HotPlatform } from "../types";

export async function fetchGithub(): Promise<HotPlatform> {
  const res = await fetch(
    "https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10",
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/vnd.github+json",
      },
    }
  );
  const json = await res.json();
  const list = json?.items ?? [];

  return {
    platform: "github",
    title: "GitHub Trending",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.full_name ?? "",
      url: v.html_url ?? "",
      heat: `⭐ ${(v.stargazers_count ?? 0).toLocaleString()}`
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
