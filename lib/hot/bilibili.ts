// B站热搜 —— 数据源：B站官方搜索热词 API（无需认证）
// 接口：api.bilibili.com/x/web-interface/search/square?limit=10
// 注意：B站 WAF 对 Cloudflare Workers IP 有风控，必须先访问首页获取 buvid3 Cookie，
//       再携带 Cookie 请求 API，否则返回 HTML 拦截页。
import { HotPlatform } from "../types";

export async function fetchBilibili(): Promise<HotPlatform> {
  // 第一步：访问首页获取 Cookie（buvid3 是 WAF 校验关键）
  const homeRes = await fetch("https://www.bilibili.com", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  // 提取 Set-Cookie 中的 buvid3
  const cookies = (homeRes.headers as any).getSetCookie?.() ?? [];
  const buvid3 = cookies.find((c: string) => c.startsWith("buvid3="));
  const cookieHeader = buvid3 ? buvid3.split(";")[0] : "";

  // 第二步：携带 Cookie 请求热搜 API
  const res = await fetch(
    "https://api.bilibili.com/x/web-interface/search/square?limit=10",
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://search.bilibili.com/",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    }
  );

  const json = await res.json();
  const list = json?.data?.trending?.list ?? [];

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
