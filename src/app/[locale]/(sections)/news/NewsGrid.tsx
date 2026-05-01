"use client";

import { format } from "date-fns";
import type { NewsEntry } from "@/lib/content";

export default function NewsGrid({ news }: { news: NewsEntry[] }) {
  if (!news.length) {
    return <p className="text-grey-500 text-sm">no news yet.</p>;
  }

  return (
    <ul className="bullet-list space-y-8">
      {news.map((item) => (
        <li key={item.slug} className="text-base">
          <p className="text-black leading-snug break-words">
            {item.title}
            <span className="text-grey-600">
              {" — "}
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                {item.source_name}
              </a>
              <span className="text-grey-500 tabular-nums">
                {", "}
                {format(new Date(item.date_scraped), "d MMM yyyy")}
              </span>
            </span>
          </p>

          {item.summary && (
            <p className="mt-3 text-sm text-grey-600 leading-[1.8] max-w-prose">
              {item.summary}
            </p>
          )}

          {item.region_tags && item.region_tags.length > 0 && (
            <p className="mt-2 text-xs text-grey-500 lowercase">
              {item.region_tags.join(", ")}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
