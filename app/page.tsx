// 首页：渲染热榜主面板（服务端组件，数据由客户端 HotBoard 异步拉取）
import { HotBoard } from "@/components/hot-board";

export default function Home() {
  return (
    <main className="flex-1">
      <HotBoard />
    </main>
  );
}
