// 贴吧热议 —— 数据源：百度贴吧官方接口（无需认证）
// 接口：tieba.baidu.com/hottopic/browse/topicList
// 返回 bang_topic.topic_list[] 含讨论数、话题链接等
import { HotPlatform } from "../types";

export async function fetchTieba(): Promise<HotPlatform> {
  const res = await fetch(
    "https://tieba.baidu.com/hottopic/browse/topicList",
    {
      headers: { "User-Agent": "Mozilla/5.0", Referer: "https://tieba.baidu.com/" },
    }
  );
  const json = await res.json();
  const list = json?.data?.bang_topic?.topic_list ?? [];

  return {
    platform: "tieba",
    title: "贴吧热议",
    items: list.slice(0, 10).map((v: any, i: number) => ({
      rank: i + 1,
      title: v.topic_name ?? "",
      url: v.topic_url ?? `https://tieba.baidu.com/hottopic/browse/hottopic?topic_id=${v.topic_id ?? ""}`,
      heat: v.discuss_num ? `${(v.discuss_num as number).toLocaleString()} 讨论` : undefined,
    })),
    updatedAt: new Date().toISOString(),
    status: "ok",
  };
}
