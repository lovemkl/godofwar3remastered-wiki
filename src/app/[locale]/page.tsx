import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { JsonLd, WikiSidebar } from "@/components/site";
import { getAllContent, getDynamicNavigation, type ContentItem, CONTENT_TYPES } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";
import HomePageClient from "./HomePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://godofwar3remastered.wiki";

type Messages = typeof en;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  return {
    title: messages.home.meta.title,
    description: messages.home.meta.description,
    alternates: { canonical: locale === "en" ? "/" : `/${locale}`, languages: { en: "/", es: "/es", pt: "/pt", de: "/de" } },
    openGraph: { title: messages.home.meta.title, description: messages.home.meta.description, url: siteUrl, images: [`${siteUrl}/images/hero.webp`] },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const messages = (await getMessages({ locale })) as Messages;
  const navGroups = getDynamicNavigation(loc);
  const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: "God of War 3 Remastered PC Wiki", url: siteUrl, description: messages.home.meta.description };
  const videoGame = { "@context": "https://schema.org", "@type": "VideoGame", name: "God of War 3 Remastered PC", description: "The unofficial God of War 3 Remastered PC port brings Sony's PS4 remaster of Kratos' Greek saga to Windows natively — 4K resolution, up to 240 FPS, FSR upscaling, mod support and cheat options, playable from start to finish. This wiki covers the install, the settings and the emulation alternatives.", genre: ["Action", "Action-Adventure", "Remaster"], gamePlatform: ["PC"], playMode: ["SinglePlayer"], applicationCategory: "Game", operatingSystem: "Windows 10/11", publisher: { "@type": "Organization", name: "Fan Port Community" }, url: siteUrl, image: `${siteUrl}/images/hero.webp` };
  const faqData = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: messages.home.faq.items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

  // 动态加载所有 content 目录下的文章
  const allArticles: ContentItem[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, loc);
    allArticles.push(...items);
  }

  // 取最近更新的 8 篇文章（按 date 倒序）
  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = a.metadata.lastModified || a.metadata.date;
      const dateB = b.metadata.lastModified || b.metadata.date;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={webSite} />
      <JsonLd data={videoGame} />
      <JsonLd data={faqData} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <HomePageClient home={messages.home} locale={locale} articles={allArticles} recentArticles={recentArticles} />
        <WikiSidebar locale={locale} navGroups={navGroups} />
      </div>
    </main>
  );
}
