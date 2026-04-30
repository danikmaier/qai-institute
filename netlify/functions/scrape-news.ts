import Anthropic from "@anthropic-ai/sdk";
import type { Handler, HandlerEvent } from "@netlify/functions";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

const KEYWORDS = [
  "Kazakhstan",
  "Kazakh",
  "Almaty",
  "Astana",
  "Nur-Sultan",
  "Central Asia",
  "Uzbekistan",
  "Kyrgyzstan",
  "Tajikistan",
  "Turkmenistan",
  "steppe",
  "nomadic",
  "Silk Road",
  "Central Asian",
];

interface FeedItem {
  title: string;
  link: string;
  contentSnippet?: string;
  content?: string;
  pubDate?: string;
}

interface NewsResult {
  slug: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  date_scraped: string;
  region_tags: string[];
}

const SOURCES = [
  { name: "ArchDaily", rssUrl: "https://www.archdaily.com/feed" },
  { name: "Dezeen", rssUrl: "https://feeds.feedburner.com/dezeen" },
  {
    name: "The Architect's Newspaper",
    rssUrl: "https://archpaper.com/feed/",
  },
  { name: "vlast.kz", rssUrl: "https://vlast.kz/rss" },
];

function isRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function detectRegionTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  if (lower.includes("kazakhstan") || lower.includes("almaty") || lower.includes("astana")) {
    tags.push("Kazakhstan");
  }
  if (lower.includes("uzbekistan") || lower.includes("tashkent")) {
    tags.push("Uzbekistan");
  }
  if (lower.includes("kyrgyzstan") || lower.includes("bishkek")) {
    tags.push("Kyrgyzstan");
  }
  if (lower.includes("central asia")) {
    tags.push("Central Asia");
  }
  if (lower.includes("steppe") || lower.includes("nomadic")) {
    tags.push("Steppe Architecture");
  }
  return [...new Set(tags)];
}

async function parseFeed(rssUrl: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(rssUrl, {
      headers: { "User-Agent": "QAI-Institute-Scraper/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: FeedItem[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const block = match[1];
      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] ??
        block.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] ??
        block.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1] ?? "";
      const desc = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[1] ?? "";
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";

      if (title) {
        items.push({
          title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
          link: link.trim(),
          contentSnippet: desc.replace(/<[^>]+>/g, "").slice(0, 500),
          pubDate,
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

async function summariseArticle(
  client: Anthropic,
  title: string,
  content: string
): Promise<string> {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Summarise the following architecture news article in 2-3 sentences. Focus on the architectural significance and relevance to Kazakhstan or Central Asia. Be factual and concise.

Title: ${title}
Content: ${content}

Summary:`,
        },
      ],
    });
    const block = message.content[0];
    return block.type === "text" ? block.text.trim() : "";
  } catch {
    return content.slice(0, 300);
  }
}

function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, " ");
}

export const handler: Handler = async (_event: HandlerEvent) => {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const results: NewsResult[] = [];
  const errors: string[] = [];

  for (const source of SOURCES) {
    try {
      console.log(`Fetching ${source.name}…`);
      const items = await parseFeed(source.rssUrl);

      let processed = 0;
      for (const item of items) {
        if (processed >= 3) break;

        const text = `${item.title} ${item.contentSnippet ?? ""}`;
        if (!isRelevant(text)) continue;

        const summary = await summariseArticle(
          client,
          item.title,
          item.contentSnippet ?? item.title
        );

        const dateStr = item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString();

        const slug = `${slugify(item.title)}-${Date.now()}`;

        results.push({
          slug,
          title: item.title,
          summary,
          source_name: source.name,
          source_url: item.link,
          date_scraped: dateStr,
          region_tags: detectRegionTags(text),
        });

        processed++;

        await new Promise((r) => setTimeout(r, 500));
      }

      console.log(`${source.name}: ${processed} relevant articles`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${source.name}: ${msg}`);
      console.error(`Error fetching ${source.name}:`, msg);
    }
  }

  const markdownFiles = results.map((item) => ({
    path: `content/news/${item.slug}.md`,
    content: `---
slug: ${item.slug}
title: "${escapeYaml(item.title)}"
summary: "${escapeYaml(item.summary)}"
source_name: "${escapeYaml(item.source_name)}"
source_url: "${escapeYaml(item.source_url)}"
date_scraped: ${item.date_scraped}
region_tags:
${item.region_tags.map((t) => `  - ${t}`).join("\n")}
---
`,
  }));

  console.log(
    `Scrape complete. ${results.length} articles saved. ${errors.length} source errors.`
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      saved: results.length,
      errors,
      files: markdownFiles.map((f) => f.path),
    }),
  };
};
