// 根布局：字体 + 全局样式 + Header + 页面内容

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HotBoard - 国内主流平台热榜聚合",
  description: "聚合百度、微博、头条、B站、抖音、知乎、贴吧、掘金、GitHub 等平台热榜",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Header />
        {children}
      </body>
    </html>
  );
}
