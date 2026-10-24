import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Cinzel } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Cinzel({ weight: "400", subsets: ["latin"], variable: "--font-display" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CID = process.env.NEXT_PUBLIC_CLARITY_ID;
const AD_KEY = process.env.NEXT_PUBLIC_AD_NATIVE_BANNER;
const AD_HOST = process.env.NEXT_PUBLIC_ADSTERRA_HOST;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://godofwar3remastered.wiki";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const image = `${siteUrl}/images/hero.webp`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "God of War 3 Remastered PC Wiki", template: "%s" },
    description: "Fan wiki for the unofficial God of War 3 Remastered PC port — install guides, 4K/240FPS performance settings, FSR, mods and cheats, and how it compares to RPCS3 emulation.",
    openGraph: { type: "website", locale, url: siteUrl, siteName: "God of War 3 Remastered PC Wiki", images: [{ url: image }] },
    twitter: { card: "summary_large_image", images: [image] },
    alternates: { canonical: siteUrl, languages: { en: siteUrl, es: siteUrl + "/es", pt: siteUrl + "/pt", de: siteUrl + "/de", "x-default": siteUrl } },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "God of War 3 Remastered PC Wiki",
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    image: `${siteUrl}/images/hero.webp`,
  };

  return (
    <html lang={locale} className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={organization} />
            <SiteHeader locale={locale} />
            {children}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>

      {GA_ID && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /><Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script></>}
      {CID && <Script id="clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CID}");`}</Script>}
      {AD_KEY && AD_HOST && <div id={`container-${AD_KEY}`} className="container max-w-2xl mx-auto my-6 min-h-[90px]" />}
      {AD_KEY && AD_HOST && <Script id="ad-native" strategy="afterInteractive" src={`https://bauval.org/21/${AD_KEY}`} />}
    </body>
    </html>
  );
}
