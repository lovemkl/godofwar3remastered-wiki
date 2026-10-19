import type { Metadata } from "next";
import Link from "next/link";
import { getDynamicNavigation } from "@/lib/content";
import { localizeHref } from "@/components/site";
import en from "@/locales/en.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://godofwar3remastered.wiki";

export const metadata: Metadata = {
  title: `All Pages — ${en.site.name}`,
  description: `Complete page directory of ${en.site.name}: every guide, category and article in one place.`,
  alternates: { canonical: `${siteUrl}/catalog` },
};

export default async function CatalogPage() {
  const groups = await getDynamicNavigation("en");
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">All Pages</h1>
      <p className="mt-3 text-muted-foreground">The complete directory of every guide and article on {en.site.name}.</p>
      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <section key={group.slug}>
            <h2 className="text-xl font-bold text-foreground">
              <Link href={localizeHref(`/${group.slug}`, "en")} className="hover:text-[hsl(var(--nav-theme))]">{group.title}</Link>
              <span className="ml-2 text-sm font-normal text-muted-foreground">({group.count})</span>
            </h2>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={localizeHref(link.href, "en")} className="text-sm text-muted-foreground hover:text-[hsl(var(--nav-theme))]">{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
