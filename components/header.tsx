// 顶部导航栏：站点标题 + 缓存策略说明
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">HotBoard</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            热榜聚合
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          数据缓存 5 分钟 · 非商用
        </div>
      </div>
    </header>
  );
}
