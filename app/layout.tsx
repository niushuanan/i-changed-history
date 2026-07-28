import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import "../src/styles.css";

const TITLE = "哎！我改变了历史？";
const DESCRIPTION = "从一百个真实历史转折点出发，亲手写下十二次决定，让 AI 推演同一个穿越者的一生与被改变的 2026。";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#11100f",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(`${protocol}://${host}`) : undefined;

  return {
    metadataBase,
    title: TITLE,
    description: DESCRIPTION,
    applicationName: TITLE,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: "summary",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
