// 共享类型定义 —— 所有 fetcher 和组件的数据契约
// 新增平台时：PlatformKey 加一个值，lib/hot/ 下加对应 fetcher

/** 单条热榜条目 */
export interface HotItem {
  rank: number; // 排名 1-based
  title: string; // 条目标题
  url: string; // 点击跳转链接
  heat?: string; // 热度文案（如 "123万 热度"），可选
}

/** 一个平台的完整热榜数据 */
export interface HotPlatform {
  platform: string; // 平台 key，如 "weibo"
  title: string; // 展示标题，如 "微博热搜"
  items: HotItem[]; // 热榜条目列表
  updatedAt: string; // ISO 时间戳
  status: "ok" | "error";
  error?: string; // status === "error" 时的错误描述
}

/** 已支持的平台标识 */
export type PlatformKey =
  | "bilibili"
  | "zhihu"
  | "weibo"
  | "github"
  | "baidu"
  | "toutiao"
  | "douyin"
  | "juejin"
  | "tieba"
  | "xiaohongshu";
