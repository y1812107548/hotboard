// 热榜主面板 —— 客户端组件，页面加载时并行请求所有平台 API
// 新增平台：在 PLATFORMS 数组加一项即可

"use client";

import { useEffect, useState } from "react";
import { HotPlatform } from "@/lib/types";
import { HotCard } from "./hot-card";

// 平台注册表：key 对应 /api/hot/[key] 路由
const PLATFORMS = [
  { key: "weibo", label: "微博" },
  { key: "baidu", label: "百度" },
  { key: "zhihu", label: "知乎" },
  { key: "toutiao", label: "头条" },
  { key: "douyin", label: "抖音" },
  { key: "bilibili", label: "B站" },
  { key: "tieba", label: "贴吧" },
  { key: "juejin", label: "掘金" },
  { key: "github", label: "GitHub" },
];

export function HotBoard() {
  const [data, setData] = useState<Record<string, HotPlatform | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // 所有平台并行请求，互不阻塞
    async function fetchAll() {
      const results = await Promise.all(
        PLATFORMS.map(async (p) => {
          try {
            const res = await fetch(`/api/hot/${p.key}`);
            return [p.key, await res.json()] as const;
          } catch {
            return [p.key, null] as const;
          }
        })
      );

      if (cancelled) return;
      setData(Object.fromEntries(results));
      setLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []); // 仅挂载时请求一次，无自动刷新（非商用场景）

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((p) => {
          const platformData = data[p.key];

          // 加载中：骨架屏占位
          if (loading || !platformData) {
            return (
              <div key={p.key} className="rounded-xl border bg-card p-4 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="h-4 w-16 bg-muted rounded" />
                </div>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                    <div className="w-5 h-5 bg-muted rounded" />
                    <div className="h-3 flex-1 bg-muted rounded" />
                  </div>
                ))}
              </div>
            );
          }

          return <HotCard key={p.key} data={platformData} />;
        })}
      </div>
    </div>
  );
}
