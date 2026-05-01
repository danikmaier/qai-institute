"use client";

import { useState, useMemo } from "react";
import type { ResearchEntry } from "@/lib/content";

export default function ResearchClient({
  research,
}: {
  research: ResearchEntry[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return research;
    const q = query.toLowerCase();
    return research.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.authors.toLowerCase().includes(q) ||
        r.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (r.abstract && r.abstract.toLowerCase().includes(q))
    );
  }, [research, query]);

  if (!research.length) {
    return <p className="text-grey-500 text-sm">no research yet.</p>;
  }

  return (
    <div>
      <div className="max-w-md mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="filter by keyword, author, title…"
          className="w-full bg-transparent border-b border-grey-300 focus:border-teal outline-none py-2 text-base placeholder:text-grey-400 lowercase"
        />
      </div>

      <ul className="bullet-list space-y-8">
        {filtered.map((entry, idx) => (
          <li key={entry.slug} className="text-base">
            <p className="text-black leading-snug break-words">
              {entry.authors}. &ldquo;{entry.title}.&rdquo;{" "}
              <span className="text-grey-600 tabular-nums">{entry.year}</span>
              {entry.url && (
                <>
                  {" — "}
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm"
                  >
                    read paper
                  </a>
                </>
              )}
            </p>

            {entry.abstract && (
              <p className="mt-3 ml-0 text-sm text-grey-500 leading-[1.8] max-w-prose">
                {entry.abstract}
              </p>
            )}

            {entry.keywords.length > 0 && (
              <p className="mt-3 text-xs text-grey-500 lowercase break-words">
                keywords: {entry.keywords.join(", ")}
              </p>
            )}

            {idx < filtered.length - 1 && (
              <span className="block h-px bg-grey-200 mt-8 -ml-6 sm:-ml-7" style={{ width: "calc(100% + 1.5rem)" }} />
            )}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-grey-500 text-sm py-12">no matches.</p>
      )}
    </div>
  );
}
