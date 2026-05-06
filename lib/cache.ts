// 内存缓存层：TTL 5 分钟，过期数据保留用作 fallback
// 服务重启后缓存自动清空，无需担心内存泄漏（最多 10 个平台 × 小数据量）

import { HotPlatform } from "./types";

const store = new Map<string, { data: HotPlatform; timestamp: number }>();
const TTL = 5 * 60 * 1000; // 5 分钟

/** 获取有效缓存，过期返回 undefined（不删除，保留给 getStale 做降级） */
export function getCached(key: string): HotPlatform | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > TTL) return undefined;
  return entry.data;
}

/** 获取缓存（含过期数据），用于 fetch 失败时降级展示 */
export function getStale(key: string): HotPlatform | undefined {
  return store.get(key)?.data;
}

export function setCache(key: string, data: HotPlatform): void {
  store.set(key, { data, timestamp: Date.now() });
}
