import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Swords } from "lucide-react";
import { getMessages } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { getAllContent, getAllContentPaths, getContent, getDynamicNavigation, type ContentItem } from "@/lib/content";
import { Breadcrumbs, JsonLd, WikiSidebar, localizeHref } from "@/components/site";
import { MobileTOC, SidebarTOC } from "@/components/table-of-contents";
import { CONTENT_TYPES } from "@/config/navigation";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://godofwar3remastered.wiki";
type Messages = typeof en;

function languageAlternates(pathname: string) {
  return Object.fromEntries(routing.locales.map((locale) => [locale, locale === "en" ? pathname : `/${locale}${pathname}`]));
}

export async function generateStaticParams() {
  const paths = await getAllContentPaths("en");
  const listingPages = CONTENT_TYPES.map((ct) => ({ slug: [ct] }));
  return [...listingPages, ...paths.map((item) => ({ slug: [item.contentType, ...item.slug] }))];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  if (slug.length === 1 && CONTENT_TYPES.includes(slug[0])) {
    const ct = slug[0];
    const ctTitle = ct.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const ctMessages = (messages as unknown as Record<string, Record<string, string>>)[ct];
    const title = ctMessages?.overviewTitle || `${ctTitle} — God of War 3 Remastered PC`;
    const description = ctMessages?.overviewDescription || `Browse all ${ctTitle.toLowerCase()} for the God of War 3 Remastered PC fan port.`;
    return { title, description, alternates: { canonical: `/${ct}`, languages: languageAlternates(`/${ct}`) }, openGraph: { title, description, url: `${siteUrl}/${ct}`, images: [`${siteUrl}/images/hero.webp`] } };
  }
  const [contentType, ...articleSlug] = slug;
  const item = await getContent(contentType, articleSlug, locale);
  if (!item) return { title: "Not Found" };
  const pathname = `/${contentType}/${articleSlug.join("/")}`;
  const image = item.metadata.image?.startsWith("http") ? item.metadata.image : `${siteUrl}${item.metadata.image ?? "/images/hero.webp"}`;
  return { title: `${item.metadata.title} — God of War 3 Remastered PC`, description: item.metadata.description, alternates: { canonical: pathname, languages: languageAlternates(pathname) }, openGraph: { type: "article", title: item.metadata.title, description: item.metadata.description, url: `${siteUrl}${pathname}`, images: [image] }, twitter: { card: "summary_large_image", images: [image] } };
}

export default async function SlugPage({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }) {
  const { locale, slug } = await params;
  const navGroups = getDynamicNavigation(locale);
  if (slug.length === 1) return <NavigationPage locale={locale} contentType={slug[0]} navGroups={navGroups} />;
  return <DetailPage locale={locale} contentType={slug[0]} slug={slug.slice(1)} navGroups={navGroups} />;
}

async function NavigationPage({ locale, contentType, navGroups }: { locale: Locale; contentType: string; navGroups: import("@/lib/content").NavGroup[] }) {
  if (!CONTENT_TYPES.includes(contentType)) notFound();
  const messages = (await getMessages({ locale })) as Messages;
  const items = await getAllContent(contentType, locale);
  const listData = { "@context": "https://schema.org", "@type": "ItemList", name: `${contentType} — God of War 3 Remastered PC`, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteUrl}/${contentType}/${item.slug}`, name: item.metadata.title })) };

  // 读取分类标题（优先用 locale JSON 里的，没有就转 slug）
  const sectionTitle = (messages as unknown as Record<string, Record<string, string>>)[contentType]?.overviewTitle
    || contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const sectionDesc = (messages as unknown as Record<string, Record<string, string>>)[contentType]?.overviewDescription || "";

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><JsonLd data={listData} /><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]"><article><Breadcrumbs items={[{ label: messages.shared.home, href: localizeHref("/", locale) }, { label: sectionTitle }]} /><h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{sectionTitle}</h1>{sectionDesc && <p className="mt-5 text-lg leading-8 text-muted-foreground">{sectionDesc}</p>}{items.length > 0 && <><div className="mt-10 grid gap-4 sm:grid-cols-2">{items.map((item) => <Link key={`/${contentType}/${item.slug}`} href={localizeHref(`/${contentType}/${item.slug}`, locale)} className="group rounded-2xl border border-border bg-card/70 p-5 transition hover:-translate-y-0.5 hover:border-[hsl(var(--nav-theme-light))]"><div className="mb-4 flex items-center justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-[hsl(var(--nav-theme))]"><Swords className="h-5 w-5" /></span>{item.metadata.badge && <Badge variant="secondary">{item.metadata.badge}</Badge>}</div><h3 className="text-lg font-bold text-foreground group-hover:text-[hsl(var(--nav-theme))]">{item.metadata.title}</h3><p className="mt-2 min-h-[3rem] text-sm leading-6 text-muted-foreground">{item.metadata.description}</p><span className="mt-4 inline-flex items-center text-sm font-semibold text-[hsl(var(--nav-theme))]">{messages.shared.readMore}<ChevronRight className="ml-1 h-4 w-4" /></span></Link>)}</div></>}{items.length === 0 && <p className="mt-8 text-muted-foreground">{messages.shared.noGuidesAvailable}</p>}</article><WikiSidebar locale={locale} navGroups={navGroups} currentPath={`/${contentType}`} /></div></main>;
}

async function DetailPage({ locale, contentType, slug, navGroups }: { locale: Locale; contentType: string; slug: string[]; navGroups: import("@/lib/content").NavGroup[] }) {
  if (!CONTENT_TYPES.includes(contentType)) notFound();
  const messages = (await getMessages({ locale })) as Messages;
  const item = await getContent(contentType, slug, locale);
  if (!item) notFound();
  const pathname = `/${contentType}/${slug.join("/")}`;
  const tocLabel = messages.shared.tableOfContents || messages.shared.inThisSection || "Table of Contents";
  const sectionLabel = contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const articleData = { "@context": "https://schema.org", "@type": "Article", headline: item.metadata.title, description: item.metadata.description, image: `${siteUrl}${item.metadata.image ?? "/images/hero.webp"}`, datePublished: item.metadata.date, dateModified: item.metadata.lastModified ?? item.metadata.date, mainEntityOfPage: `${siteUrl}${pathname}`, author: { "@type": "Organization", name: "God of War 3 Remastered PC Wiki" }, publisher: { "@type": "Organization", name: "God of War 3 Remastered PC Wiki", logo: { "@type": "ImageObject", url: `${siteUrl}/android-chrome-512x512.png` } } };
  const breadcrumbData = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: sectionLabel, item: `${siteUrl}/${contentType}` }, { "@type": "ListItem", position: 3, name: item.metadata.title, item: `${siteUrl}${pathname}` }] };
  // FAQPage schema for the pages whose headings ARE questions — rich results + AI citation surface.
  const FAQ_DATA: Record<string, Array<[string, string]>> = {
    "guide/god-of-war-3-remastered-pc-guide": [
      ["Is there an official God of War 3 Remastered PC version?", "No. What works today is a fan-made native Windows port of the PS4 Remastered edition. Sony has not announced an official PC release."],
      ["How do I install the God of War 3 Remastered PC port?", "Four steps: extract your PS4 game files with a PKG Extractor, apply Patch 1.2 to the extracted folder, arrange the CUSA0163 title-ID directory, then launch and load mods. It legally requires files dumped from your own PS4 copy."],
      ["Does the PC port support mods and cheats?", "Yes — the native port loads community mods directly (texture replacements, FPS configurations) and ships built-in cheat toggles. On the RPCS3 emulator route, cheats arrive as patch-manager tables instead."],
      ["What performance does the port reach?", "Up to 4K resolution and 240 FPS on capable hardware, with AMD FSR upscaling for more modest GPUs."],
    ],
    "features/mods-and-cheats": [
      ["Do God of War 3 Remastered mods work on PC?", "Yes — the native PC port loads community mods natively, and the RPCS3 emulator route uses patch-manager fixes (motion blur removal, FPS unlock, cheat tables). The mods page itemizes both paths."],
      ["Does Cheat Engine work with God of War 3 Remastered on PC?", "Not usefully on the RPCS3 route — emulated memory breaks Cheat Engine scans; cheat functionality arrives as patch-manager tables. On the native port, built-in cheat toggles and native mod loading already cover most of what Cheat Engine would do."],
    ],
  };
  const faqKey = `${contentType}/${slug.join("/")}`;
  const faqPairs = FAQ_DATA[faqKey];
  const faqData = faqPairs ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqPairs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } : null;

  const relatedLabel = messages.shared.relatedGuides || "Related Guides";

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><JsonLd data={articleData} /><JsonLd data={breadcrumbData} />{faqData && <JsonLd data={faqData} />}<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]"><article><Breadcrumbs items={[{ label: messages.shared.home, href: localizeHref("/", locale) }, { label: sectionLabel, href: localizeHref(`/${contentType}`, locale) }, { label: item.metadata.title }]} /><h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{item.metadata.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{item.metadata.summary ?? item.metadata.description}</p><aside className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-sm leading-7"><strong>Source review · October 22, 2026:</strong> This wiki has not independently tested the port, its binaries, performance or a complete playthrough. Earlier performance advice is untested and may differ from current releases. Check the <a className="underline" href="https://github.com/FelipePrado0/SpartanPort">maintainer documentation</a> and <Link className="underline" href={localizeHref("/guide/how-to-install", locale)}>release and installation checks</Link> before using it.</aside><MobileTOC headings={item.headings} label={tocLabel} /><div className="prose-invert mt-10 max-w-none"><item.MDXContent /></div><ArticleCards locale={locale} contentType={contentType} currentSlug={slug.join("/")} relatedLabel={relatedLabel} /></article><aside className="space-y-6"><SidebarTOC headings={item.headings} label={tocLabel} currentPathname={pathname} /><WikiSidebar locale={locale} navGroups={navGroups} currentPath={pathname} /></aside></div></main>;
}

async function ArticleCards({ locale, contentType, currentSlug, relatedLabel }: { locale: string; contentType: string; currentSlug: string; relatedLabel: string }) {
  // 动态获取同分类其他文章（排除当前文章）
  const allItems = await getAllContent(contentType, locale as Locale);
  const related = allItems.filter((item) => item.slug !== currentSlug).slice(0, 4);

  if (related.length === 0) return null;

  return <div className="mt-12 space-y-8"><section><h3 className="text-xl font-bold text-foreground">{relatedLabel}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{related.map((item) => <SmallCard key={item.slug} icon={<Swords className="h-5 w-5" />} title={item.metadata.title} description={item.metadata.description} href={localizeHref(`/${contentType}/${item.slug}`, locale)} />)}</div></section></div>;
}

function SmallCard({ title, description, href, icon }: { title: string; description: string; href: string; icon?: React.ReactNode }) { return <Link href={href} className="block rounded-2xl border border-border bg-card/70 p-5 transition hover:border-[hsl(var(--nav-theme-light))]">{icon && <div className="mb-3 text-[hsl(var(--nav-theme))]">{icon}</div>}<h4 className="font-bold text-foreground">{title}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></Link>; }
