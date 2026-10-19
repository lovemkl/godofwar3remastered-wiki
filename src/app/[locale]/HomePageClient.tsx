"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, ChevronRight, CircleHelp, Code2, Compass, Flame, Map as MapIcon, ScrollText, Shield, Skull, Swords, Trophy, Users, Zap, type LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrailerButton, localizeHref } from "@/components/site";
import type { ContentItem } from "@/lib/content";
import en from "@/locales/en.json";

type Home = typeof en.home;

const icons: LucideIcon[] = [BookOpen, Shield, Compass, Boxes, Flame, Code2, Swords, MapIcon, Users, Trophy, Skull, Zap, CircleHelp, ScrollText];



// 卡片展示用短标题：剥品牌名前缀（竞品列文章不带游戏名，压主词密度至 1-3%）
const BRAND = en.site.shortName;
function cardTitle(t: string): string {
  if (BRAND && t.toLowerCase().startsWith(BRAND.toLowerCase())) {
    const s = t.slice(BRAND.length).replace(/^[\s:\-–—|]+/, "").trim();
    if (s) return s;
  }
  return t;
}

export default function HomePageClient({ home, locale, articles, recentArticles }: { home: Home; locale: string; articles: ContentItem[]; recentArticles: ContentItem[] }) {
  const YOUTUBE_VIDEO_ID = "Q0GN0JvEXBw";

  return (
    <div className="space-y-16">
      {/* Hero Section — full-bleed Spartan backdrop */}
      <section className="relative overflow-hidden rounded-lg border border-[hsl(8_68%_48%/0.45)] px-4 py-14 text-center shadow-[0_0_50px_hsl(8_60%_38%/0.16)] sm:py-20">
        <div className="absolute inset-0 -z-10">
          <img src="/images/hero.webp" alt="" aria-hidden width={1280} height={720} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="mx-auto mb-5 flex items-center justify-center gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">{home.hero.title}</h1>
          <span className="mt-2 inline-flex items-center rounded-md border border-[hsl(var(--nav-theme))] bg-[hsl(var(--nav-theme))] px-2.5 py-0.5 text-xs font-semibold text-primary-foreground sm:-translate-y-1.5">{home.hero.eyebrow}</span>
        </div>
        <div className="mx-auto mt-5 max-w-2xl">
          <TrailerButton videoId={YOUTUBE_VIDEO_ID} />
        </div>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-foreground/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{home.hero.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">{home.hero.stats.map((stat) => <span key={stat} className="inline-flex items-center gap-1 rounded-sm border border-[hsl(var(--nav-theme))/0.4] bg-background/70 px-2.5 py-0.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">{stat}</span>)}</div>
      </section>

      {/* 最近更新 + 新手教程 两栏布局 */}
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* 左侧：动态更新 — 最近 8 篇 MDX 文章，支持滚动 */}
        <Card className="border-border bg-card/70 p-5">
          <h2 className="mb-4 text-xl font-bold text-foreground">{home.updates.title}</h2>
          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {recentArticles.map((article) => (
              <Link
                key={`/${article.contentType}/${article.slug}`}
                href={localizeHref(`/${article.contentType}/${article.slug}`, locale)}
                className="block rounded-xl border border-border bg-background p-4 transition hover:border-[hsl(var(--nav-theme-light))]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge className="bg-[hsl(var(--nav-theme))] text-primary-foreground">{article.contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge>
                  <span className="text-xs text-muted-foreground">{article.metadata.date}</span>
                </div>
                <p className="font-semibold text-foreground">{cardTitle(article.metadata.title)}</p>
              </Link>
            ))}
          </div>
          <Button asChild className="mt-5 w-full" variant="outline">
                <Link href={localizeHref("/guide", locale)}>{home.updates.browse}</Link>
          </Button>
        </Card>

        {/* 右侧：新手教程 4 步卡片 */}
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--nav-theme))]">{home.start.eyebrow}</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{home.start.title}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {home.start.cards.map((card) => (
              <div key={card.number} className="rounded-2xl border border-border bg-card/70 p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--nav-theme))] text-sm font-bold text-primary-foreground">{card.number}</span>
                <h3 className="mt-4 font-bold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Content Section — auto-scrolling carousel */}
      {articles.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[hsl(var(--nav-theme))]">{home.popular.eyebrow}</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{home.popular.title}</h2>
            </div>
            {home.popular.quickLinks && home.popular.quickLinks.length > 0 && (
              <div className="hidden gap-2 sm:flex">{home.popular.quickLinks.map((link) => <Badge key={link} variant="outline" className="border-border px-3 py-1 text-muted-foreground">{link}</Badge>)}</div>
            )}
          </div>
          <div className="relative mt-6 overflow-hidden">
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />
            <div className="flex gap-4 animate-auto-scroll pb-4">
              {/* Render cards twice for seamless infinite loop */}
              {[...articles, ...articles].map((article, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <Link key={`${index}-${article.contentType}/${article.slug}`} href={localizeHref(`/${article.contentType}/${article.slug}`, locale)} className="group min-w-[260px] max-w-[300px] flex-shrink-0 rounded-2xl border border-border bg-card/70 p-5 transition hover:border-[hsl(var(--nav-theme-light))]">
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-[hsl(var(--nav-theme))]"><Icon className="h-5 w-5" /></span>
                      {article.metadata.badge && <Badge variant="secondary">{article.metadata.badge}</Badge>}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-[hsl(var(--nav-theme))]">{cardTitle(article.metadata.title)}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">{article.metadata.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About Game (curated, stays in JSON) */}
      <section className="grid gap-8 rounded-3xl border border-border bg-card/60 p-6 lg:grid-cols-[1.1fr_0.9fr]"><div><h2 className="text-3xl font-bold tracking-tight text-foreground">{home.aboutGame.title}</h2>{home.aboutGame.paragraphs.map((p) => <p key={p} className="mt-5 leading-8 text-muted-foreground">{p}</p>)}<Button asChild className="mt-6"><Link href={localizeHref("/guide/god-of-war-3-remastered-pc-guide", locale)}>{home.aboutGame.cta}</Link></Button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">{home.aboutGame.stats.map((stat) => <div key={stat.label} className="rounded-2xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p><p className="mt-2 text-xl font-bold text-foreground">{stat.value}</p></div>)}</div></section>

      {/* 8 Module Sections (full-width stacked, matching reference site style) */}
      {home.explore.modules && home.explore.modules.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{home.explore.title}</h2>
          <p className="mt-2 text-muted-foreground">{home.explore.description}</p>

          {/* Quick nav pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {home.explore.modules.map((mod) => (
              <Link
                key={mod.order}
                href={localizeHref(mod.href, locale)}
                className="rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-sm text-muted-foreground transition hover:border-[hsl(var(--nav-theme-light))] hover:text-[hsl(var(--nav-theme))]"
              >
                {mod.name}
              </Link>
            ))}
          </div>

          {/* Stacked module content sections */}
          <div className="mt-8 space-y-6">
            {home.explore.modules.map((mod) => (
              <div key={mod.order} className="overflow-hidden rounded-2xl border border-border bg-card/70">
                {/* Module header */}
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                  <h3 className="text-lg font-bold text-foreground">{mod.name}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">{mod.description}</p>
                </div>

                {/* Module preview — styled per displayType */}
                <div className="px-6 py-5">
                  {/* code-cards: show active codes */}
                  {mod.displayType === "code-cards" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="space-y-3">
                      {mod.highlights.map((h, i) => (
                        <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted p-4">
                          <div className="flex items-center gap-3">
                            <code className="rounded-lg bg-background px-3 py-1.5 font-mono text-sm font-bold text-foreground">{h.label}</code>
                            <span className="text-sm text-muted-foreground">{h.detail}</span>
                          </div>
                          {"badge" in h && h.badge && <Badge className="shrink-0 bg-emerald-600 text-white text-[10px]">{h.badge}</Badge>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* step-by-step: numbered step cards */}
                  {mod.displayType === "step-by-step" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {mod.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[hsl(var(--nav-theme))] text-xs font-bold text-primary-foreground">{h.label}</span>
                          <span className="text-sm leading-6 text-muted-foreground">{h.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* tier-grid: S/A/B/C colored cards */}
                  {mod.displayType === "tier-grid" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {mod.highlights.map((h, i) => {
                        const tierColor =
                          h.label === "S" ? "border-amber-500/40 bg-amber-500/10" :
                          h.label === "A" ? "border-emerald-500/40 bg-emerald-500/10" :
                          h.label === "B" ? "border-blue-500/40 bg-blue-500/10" :
                          h.label === "C" ? "border-zinc-500/40 bg-zinc-500/10" :
                          "border-border bg-muted";
                        const tierText =
                          h.label === "S" ? "text-amber-600 dark:text-amber-400" :
                          h.label === "A" ? "text-emerald-600 dark:text-emerald-400" :
                          h.label === "B" ? "text-blue-600 dark:text-blue-400" :
                          h.label === "C" ? "text-zinc-600 dark:text-zinc-400" :
                          "text-muted-foreground";
                        return (
                          <div key={i} className={`rounded-xl border p-4 ${tierColor}`}>
                            <span className={`text-sm font-bold ${tierText}`}>{h.label} Tier</span>
                            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{h.detail}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* card-list: icon + name cards */}
                  {mod.displayType === "card-list" && mod.highlights && mod.highlights.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {mod.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-muted p-3">
                          <span className="text-xl">{h.label}</span>
                          <span className="text-sm font-medium text-foreground">{h.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href={localizeHref(mod.href, locale)}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-[hsl(var(--nav-theme))] hover:underline"
                  >
                    Read Full Guide <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ (curated, stays in JSON) */}
      <section><h2 className="text-3xl font-bold tracking-tight text-foreground">{home.faq.title}</h2><p className="mt-2 text-muted-foreground">{home.faq.description}</p><Accordion type="single" collapsible className="mt-6 rounded-2xl border border-border bg-card/70 px-5">{home.faq.items.map((item, index) => <AccordionItem key={item.question} value={`item-${index}`}><AccordionTrigger className="text-left text-foreground">{item.question}</AccordionTrigger><AccordionContent className="leading-7 text-muted-foreground">{item.answer}</AccordionContent></AccordionItem>)}</Accordion></section>

      {/* Final CTA (curated, stays in JSON) */}
      <section className="rounded-3xl border border-border bg-gradient-to-br from-muted to-card p-8 text-center"><h2 className="text-3xl font-bold tracking-tight text-foreground">{home.finalCta.title}</h2><p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{home.finalCta.description}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Button asChild size="lg"><Link href={localizeHref("/guide/god-of-war-3-remastered-pc-guide", locale)}>{home.finalCta.primary}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="https://www.youtube.com/watch?v=Q0GN0JvEXBw">
<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>
{home.finalCta.secondary}</Link></Button></div></section>
    </div>
  );
}
