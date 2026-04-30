import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDir = path.join(process.cwd(), "content");

export type Locale = "en" | "kz" | "ru";

function getLocalizedField(
  data: Record<string, unknown>,
  field: string,
  locale: Locale
): string {
  return String(data[`${field}_${locale}`] ?? data[`${field}_en`] ?? data[field] ?? "");
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown || "");
  return result.toString();
}

export interface Building {
  slug: string;
  title: string;
  latitude: number;
  longitude: number;
  year_built: number;
  architect: string;
  architectural_style: string;
  description: string;
  descriptionHtml?: string;
  photos: string[];
  current_owner: string;
  notes_future_development?: {
    aesthetic_notes?: string;
    material_information?: string;
    details_to_preserve?: string;
    elements_to_restore?: string;
    local_community_importance?: string;
  };
  date_added: string;
}

export function getAllBuildings(locale: Locale = "en"): Building[] {
  const dir = path.join(contentDir, "buildings");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    const slug = data.slug || file.replace(".md", "");
    return {
      slug,
      title: getLocalizedField(data, "title", locale),
      latitude: data.latitude,
      longitude: data.longitude,
      year_built: data.year_built,
      architect: getLocalizedField(data, "architect", locale),
      architectural_style: getLocalizedField(data, "architectural_style", locale),
      description: getLocalizedField(data, "description", locale),
      photos: data.photos || [],
      current_owner: getLocalizedField(data, "current_owner", locale),
      notes_future_development: data.notes_future_development
        ? {
            aesthetic_notes: getLocalizedField(
              data.notes_future_development,
              "aesthetic_notes",
              locale
            ),
            material_information: getLocalizedField(
              data.notes_future_development,
              "material_information",
              locale
            ),
            details_to_preserve: getLocalizedField(
              data.notes_future_development,
              "details_to_preserve",
              locale
            ),
            elements_to_restore: getLocalizedField(
              data.notes_future_development,
              "elements_to_restore",
              locale
            ),
            local_community_importance: getLocalizedField(
              data.notes_future_development,
              "local_community_importance",
              locale
            ),
          }
        : undefined,
      date_added: data.date_added || new Date().toISOString(),
    };
  });
}

export function getBuildingBySlug(
  slug: string,
  locale: Locale = "en"
): Building | null {
  const dir = path.join(contentDir, "buildings");
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    if (data.slug === slug || file.replace(".md", "") === slug) {
      return {
        slug,
        title: getLocalizedField(data, "title", locale),
        latitude: data.latitude,
        longitude: data.longitude,
        year_built: data.year_built,
        architect: getLocalizedField(data, "architect", locale),
        architectural_style: getLocalizedField(data, "architectural_style", locale),
        description: getLocalizedField(data, "description", locale),
        photos: data.photos || [],
        current_owner: getLocalizedField(data, "current_owner", locale),
        notes_future_development: data.notes_future_development
          ? {
              aesthetic_notes: getLocalizedField(
                data.notes_future_development,
                "aesthetic_notes",
                locale
              ),
              material_information: getLocalizedField(
                data.notes_future_development,
                "material_information",
                locale
              ),
              details_to_preserve: getLocalizedField(
                data.notes_future_development,
                "details_to_preserve",
                locale
              ),
              elements_to_restore: getLocalizedField(
                data.notes_future_development,
                "elements_to_restore",
                locale
              ),
              local_community_importance: getLocalizedField(
                data.notes_future_development,
                "local_community_importance",
                locale
              ),
            }
          : undefined,
        date_added: data.date_added || new Date().toISOString(),
      };
    }
  }
  return null;
}

export interface ResearchEntry {
  slug: string;
  title: string;
  authors: string;
  year: number;
  abstract: string;
  keywords: string[];
  citation: string;
  url?: string;
  date_added: string;
}

export function getAllResearch(locale: Locale = "en"): ResearchEntry[] {
  const dir = path.join(contentDir, "research");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: data.slug || file.replace(".md", ""),
      title: getLocalizedField(data, "title", locale),
      authors: data.authors,
      year: data.year,
      abstract: getLocalizedField(data, "abstract", locale),
      keywords: data.keywords || [],
      citation: data.citation,
      url: data.url,
      date_added: data.date_added || new Date().toISOString(),
    };
  });
}

export interface GalleryEntry {
  slug: string;
  title: string;
  image: string;
  caption: string;
  building_ref?: string;
  photographer?: string;
  year_taken?: number;
  date_added: string;
}

export function getAllGallery(locale: Locale = "en"): GalleryEntry[] {
  const dir = path.join(contentDir, "gallery");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: data.slug || file.replace(".md", ""),
      title: getLocalizedField(data, "title", locale),
      image: data.image,
      caption: getLocalizedField(data, "caption", locale),
      building_ref: data.building_ref,
      photographer: data.photographer,
      year_taken: data.year_taken,
      date_added: data.date_added || new Date().toISOString(),
    };
  });
}

export interface HistoryEntry {
  slug: string;
  title: string;
  period_start: number;
  period_end?: number;
  description: string;
  key_buildings?: string[];
  images: string[];
  order: number;
}

export function getAllHistory(locale: Locale = "en"): HistoryEntry[] {
  const dir = path.join(contentDir, "history");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const entries = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: data.slug || file.replace(".md", ""),
      title: getLocalizedField(data, "title", locale),
      period_start: data.period_start as number,
      period_end: data.period_end as number | undefined,
      description: getLocalizedField(data, "description", locale),
      key_buildings: data.key_buildings as string[] | undefined,
      images: (data.images || []) as string[],
      order: (data.order || 0) as number,
    };
  });
  return entries.sort((a, b) => a.order - b.order);
}

export interface FutureEntry {
  slug: string;
  title: string;
  author: string;
  body: string;
  bodyHtml?: string;
  category: "article" | "project" | "proposal" | "manifesto";
  featured_image?: string;
  date_published: string;
}

export function getAllFuture(locale: Locale = "en"): FutureEntry[] {
  const dir = path.join(contentDir, "future");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug || file.replace(".md", ""),
        title: getLocalizedField(data, "title", locale),
        author: getLocalizedField(data, "author", locale),
        body: getLocalizedField(data, "body", locale),
        category: data.category as FutureEntry["category"],
        featured_image: data.featured_image,
        date_published: data.date_published || new Date().toISOString(),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.date_published).getTime() -
        new Date(a.date_published).getTime()
    );
}

export function getFutureBySlug(
  slug: string,
  locale: Locale = "en"
): FutureEntry | null {
  const all = getAllFuture(locale);
  return all.find((e) => e.slug === slug) ?? null;
}

export interface NewsEntry {
  slug: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  date_scraped: string;
  region_tags: string[];
}

export function getAllNews(): NewsEntry[] {
  const dir = path.join(contentDir, "news");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug || file.replace(".md", ""),
        title: data.title,
        summary: data.summary,
        source_name: data.source_name,
        source_url: data.source_url,
        date_scraped: data.date_scraped || new Date().toISOString(),
        region_tags: data.region_tags || [],
      };
    })
    .sort(
      (a, b) =>
        new Date(b.date_scraped).getTime() - new Date(a.date_scraped).getTime()
    );
}

export interface AboutContent {
  mission: string;
  bio: string;
  contact_email: string;
  social_links: { platform: string; url: string }[];
}

export function getAbout(locale: Locale = "en"): AboutContent {
  const file = path.join(contentDir, "about.md");
  if (!fs.existsSync(file)) {
    return {
      mission: "Documenting and preserving Kazakh architectural heritage.",
      bio: "The QAI Institute is dedicated to the study and preservation of Kazakhstan's rich architectural tradition.",
      contact_email: "info@qai-institute.org",
      social_links: [],
    };
  }
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  return {
    mission: getLocalizedField(data, "mission", locale),
    bio: getLocalizedField(data, "bio", locale),
    contact_email: data.contact_email,
    social_links: data.social_links || [],
  };
}
