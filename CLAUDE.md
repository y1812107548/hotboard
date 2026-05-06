# HotBoard — 国内主流平台热榜聚合

## 项目简介

聚合 9 个国内主流平台实时热榜的展示网站：微博、百度、知乎、头条、抖音、B站、贴吧、掘金、GitHub。非商用个人项目。

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 + shadcn/ui 4 |
| 组件基座 | @base-ui/react |
| 后端 | Next.js API Routes（代理绕过 CORS） |
| 缓存 | 内存 Map，TTL 5 分钟 |
| 部署 | `npm run build && npm start` / Vercel |

## 项目结构

```
hot-aggregator/
├── app/
│   ├── layout.tsx              # 根布局（字体 + Header）
│   ├── page.tsx                # 首页
│   ├── globals.css             # Tailwind + shadcn 主题变量
│   └── api/hot/[platform]/
│       └── route.ts            # 统一热榜 API 代理路由
├── components/
│   ├── header.tsx              # 顶部导航栏
│   ├── hot-board.tsx           # 热榜主面板（客户端组件，并行请求）
│   ├── hot-card.tsx            # 单平台热榜卡片
│   ├── hot-item.tsx            # 单条热榜条目（排名 + 标题 + 热度）
│   └── ui/button.tsx           # shadcn Button
├── lib/
│   ├── types.ts                # HotItem / HotPlatform / PlatformKey 类型
│   ├── utils.ts                # cn() 工具函数
│   ├── cache.ts                # 内存缓存（getCached / getStale / setCache）
│   └── hot/
│       ├── weibo.ts            # 微博热搜（官方 Ajax 接口）
│       ├── baidu.ts            # 百度热搜（第三方聚合）
│       ├── zhihu.ts            # 知乎热榜（官方搜索热词 API）
│       ├── toutiao.ts          # 头条热榜（官方 hot-board 接口）
│       ├── douyin.ts           # 抖音热榜（第三方聚合）
│       ├── bilibili.ts         # B站热门（官方 popular 接口）
│       ├── tieba.ts            # 贴吧热议（官方 topicList 接口）
│       ├── juejin.ts           # 掘金热榜（官方 recommend API，POST）
│       └── github.ts           # GitHub Trending（官方 Search API）
└── public/
    └── favicon.ico
```

## 新增平台步骤

1. `lib/types.ts` → PlatformKey 添加新平台标识
2. `lib/hot/新平台.ts` → 实现 fetch 函数，返回 `HotPlatform`
3. `app/api/hot/[platform]/route.ts` → fetchers 注册表 import 并添加
4. `components/hot-board.tsx` → PLATFORMS 数组添加 { key, label }
5. `components/hot-card.tsx` → platformColors 添加品牌色

## 数据流

```
浏览器 → /api/hot/[platform] → getCached() 命中则直接返回
                                   ↓ 未命中
                               fetch 上游 API → setCache() → 返回 JSON
                                   ↓ 失败
                               getStale() 降级过期缓存 → 无缓存则返回 error
```

## 运行命令

```bash
npm run dev      # 开发模式 http://localhost:3000
npm run build    # 生产构建
npm start        # 生产运行
npm run lint     # ESLint 检查
```
