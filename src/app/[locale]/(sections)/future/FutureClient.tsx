"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import type { FutureEntry } from "@/lib/content";
import type { Locale } from "@/lib/config";

const CATEGORIES = ["article", "project", "proposal", "manifesto"] as const;
type Category = (typeof CATEGORIES)[number];

export default function FutureClient({
  entries,
}: {
  entries: FutureEntry[];
  locale: Locale;
}) {
  const [active, setActive] = useState<Category | null>(null);

  const filtered = useMemo(
    () => (active ? entries.filter((e) => e.category === active) : entries),
    [entries, active]
  );

  if (!entries.length) {
    return <p className="text-grey-500 text-sm">no entries yet.</p>;
  }

  return (
    <div>
      <ul className="bullet-list space-y-1 mb-10 text-base">
        <li>
          <button
            onClick={() => setActive(null)}
            className={`lowercase transition-colors duration-150 ${
              !active ? "text-teal" : "text-black hover:text-teal"
            }`}
          >
            all
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => setActive(cat === active ? null : cat)}
              className={`lowercase transition-colors duration-150 ${
                cat === active ? "text-teal" : "text-black hover:text-teal"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      <ul className="bullet-list space-y-5 text-base">
        {filtered.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/future/${entry.slug}`}
              className="text-black hover:text-teal transition-colors duration-150"
            >
              {entry.title}
              {entry.author ? <span className="text-grey-600"> — {entry.author}</span> : null}
              <span className="text-grey-500 tabular-nums">
                {", "}
                {format(new Date(entry.date_published), "d MMM yyyy")}
              </span>
              <span className="text-grey-500 lowercase"> ({entry.category})</span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-grey-500 text-sm py-12">no matches.</p>
      )}
    </div>
  );
}
