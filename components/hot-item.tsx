// 单条热榜条目：排名徽章 + 标题（溢出截断）+ 热度标签（溢出截断）
// 前三名排名徽章高亮为红色
import { HotItem as HotItemType } from "@/lib/types";
import { cn } from "@/lib/utils";

// 热度/播放量/讨论数标签，无数据则不渲染
function HeatBadge({ heat }: { heat?: string }) {
  if (!heat) return null;
  return (
    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded truncate max-w-[100px] shrink-0">
      {heat}
    </span>
  );
}

export function HotItem({ item }: { item: HotItemType }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted/50 rounded-lg transition-colors group"
    >
      {/* 排名徽章：前 3 名红色高亮 */}
      <span
        className={cn(
          "w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold shrink-0",
          item.rank <= 3
            ? "bg-red-500 text-white"
            : "bg-muted text-muted-foreground"
        )}
      >
        {item.rank}
      </span>
      {/* 标题：flex-1 + min-w-0 + truncate 确保溢出省略号生效 */}
      <span className="text-sm truncate group-hover:text-primary transition-colors flex-1 min-w-0">
        {item.title}
      </span>
      <HeatBadge heat={item.heat} />
    </a>
  );
}
