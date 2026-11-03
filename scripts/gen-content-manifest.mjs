// Generates src/content-manifest.json — a build-time index of all content MDX
// files (slug, metadata title/badge/date, headings). Cloudflare Workers have no
// filesystem, so the app reads this manifest instead of scanning content/ at
// runtime. Run before every build: `node scripts/gen-content-manifest.mjs`.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_ROOT = path.join(ROOT, "content", "en");
const OUT = path.join(ROOT, "src", "content-manifest.json");

const fileNameToSlug = (name) =>
  name
    .replace(/\.mdx$/, "")
    .replace(/[^a-zA-Z0-9\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const extractHeadings = (source) => {
  const headings = [];
  for (const line of source.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\{[^}]*\}/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      headings.push({ id, text, level });
    }
  }
  return headings;
};

const grab = (source, key) => source.match(new RegExp(`${key}:\\s*["'](.+?)["']`))?.[1];

const items = [];
for (const contentType of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
  if (!contentType.isDirectory()) continue;
  const dir = path.join(CONTENT_ROOT, contentType.name);
  const walk = (d, base = []) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full, [...base, entry.name]);
      } else if (entry.name.endsWith(".mdx")) {
        const source = fs.readFileSync(full, "utf-8");
        const fileName = entry.name.replace(/\.mdx$/, "");
        items.push({
          contentType: contentType.name,
          slug: [...base, fileNameToSlug(fileName)].join("/"),
          title: grab(source, "title") || fileName.replace(/-/g, " "),
          badge: grab(source, "badge"),
          date: grab(source, "date"),
          category: grab(source, "category"),
          headings: extractHeadings(source),
        });
      }
    }
  };
  walk(dir);
}

items.sort((a, b) => (a.contentType + a.slug).localeCompare(b.contentType + b.slug));
fs.writeFileSync(
  OUT,
  JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 1) + "\n"
);
console.log(`content-manifest.json: ${items.length} articles across ${new Set(items.map((i) => i.contentType)).size} types`);
