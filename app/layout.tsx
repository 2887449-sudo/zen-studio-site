import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "ZEN 漫剧宇宙 | AI Motion Comics Universe",
  description: "ZEN 漫剧宇宙是一个高端 AI 动态漫画平台，提供原创漫剧、会员观看、创作者 IP 合作。Premium AI-powered motion comics platform.",
  openGraph: {
    title: "ZEN 漫剧宇宙 | AI Motion Comics Universe",
    description: "Premium AI-powered motion comics platform for original series, membership viewing, and creator IP cooperation.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>
          <ToastProvider>
            <Header />
            {children}
            <Footer />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
