// 单个平台热榜卡片：彩色标识 + 标题 + Top10 列表
// 新增平台颜色：在 platformColors 加一项
import { HotPlatform } from "@/lib/types";
import { HotItem } from "./hot-item";

// 各平台品牌色，用于卡片左上角小圆点
const platformColors: Record<string, string> = {
  bilibili: "bg-[#fb7299]",
  zhihu: "bg-[#0066ff]",
  weibo: "bg-[#e6162d]",
  github: "bg-[#24292e]",
  baidu: "bg-[#4e6ef2]",
  toutiao: "bg-[#e44b4b]",
  douyin: "bg-[#111] dark:bg-[#fff]",
  juejin: "bg-[#1e80ff]",
  tieba: "bg-[#3385ff]",
};

export function HotCard({ data }: { data: HotPlatform }) {
  const color = platformColors[data.platform] ?? "bg-primary";

  // 错误状态：显示平台名 + 不可用提示
  if (data.status === "error") {
    return (
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-3 h-3 rounded-full ${color}`} />
          <h2 className="font-semibold text-sm">{data.title}</h2>
        </div>
        <p className="text-xs text-muted-foreground">暂时无法获取数据</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card hover:shadow-sm transition-shadow overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        <h2 className="font-semibold text-sm">{data.title}</h2>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {data.items.length} 条
        </span>
      </div>
      <div className="py-1">
        {data.items.map((item) => (
          <HotItem key={item.rank} item={item} />
        ))}
      </div>
    </div>
  );
}
