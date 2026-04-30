"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import type { NewsEntry } from "@/lib/content";

const SOURCE_COLORS: Record<string, string> = {
  ArchDaily: "bg-grey-100 text-grey-600",
  Dezeen: "bg-black text-white",
  "Architectural Review": "bg-grey-800 text-white",
  "The Architect's Newspaper": "bg-teal/10 text-teal",
  "vlast.kz": "bg-teal text-white",
};

function getSourceColor(name: string): string {
  return SOURCE_COLORS[name] ?? "bg-grey-100 text-grey-600";
}

export default function NewsGrid({ news }: { news: NewsEntry[] }) {
  const t = useTranslations("news");

  if (!news.length) {
    return (
      <div className="py-24 text-center">
        <p className="text-grey-400 mb-2">{t("no_news")}</p>
        <p className="text-xs text-grey-300">
          News articles are auto-generated daily by the scraper function.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <a
          key={item.slug}
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-grey-200 hover:border-teal transition-colors duration-200 flex flex-col"
        >
          {/* Source badge + date */}
          <div className="p-5 pb-0 flex items-start justify-between gap-3">
            <span
              className={`text-xs font-medium px-2 py-1 shrink-0 ${getSourceColor(
                item.source_name
              )}`}
            >
              {item.source_name}
            </span>
            <span className="text-xs text-grey-400 shrink-0">
              {format(new Date(item.date_scraped), "d MMM yyyy")}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h2 className="font-serif text-lg leading-tight mb-3 group-hover:text-teal transition-colors line-clamp-3">
              {item.title}
            </h2>
            <p className="text-sm text-grey-500 leading-relaxed flex-1 line-clamp-4">
              {item.summary}
            </p>

            {/* Tags */}
            {item.region_tags && item.region_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-grey-100">
                {item.region_tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-off-white text-grey-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-medium text-teal group-hover:underline">
                {t("read_original")} →
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
