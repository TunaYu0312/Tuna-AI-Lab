import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const previewImage = new URL("/og.png", baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title: "菜单定价决策室｜Menu Pricing Decision Room",
    description:
      "为连锁餐饮企业建立从共同事实、方案权衡到试点复盘的可追溯菜单定价决策闭环。",
    openGraph: {
      title: "菜单定价决策室",
      description: "一场会议，一个定价决策，一条可追溯的增长闭环。",
      type: "website",
      locale: "zh_CN",
      images: [
        {
          url: previewImage,
          width: 1536,
          height: 1024,
          alt: "菜单定价决策室的五阶段决策闭环",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "菜单定价决策室",
      description: "让价格决策经得起追问，也经得起复盘。",
      images: [previewImage],
    },
  };
}

export const viewport = {
  themeColor: "#172224",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
