"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ResearchEntry } from "@/lib/content";

export default function ResearchClient({
  research,
}: {
  research: ResearchEntry[];
}) {
  const t = useTranslations("research");
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(new Set());

  const allKeywords = Array.from(
    new Set(research.flatMap((r) => r.keywords))
  ).sort();

  const filtered = activeKeyword
    ? research.filter((r) => r.keywords.includes(activeKeyword))
    : research;

  const toggleAbstract = (slug: string) => {
    setExpandedAbstracts((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  if (!research.length) {
    return <p className="text-grey-400">{t("no_research")}</p>;
  }

  return (
    <div>
      {/* Keyword filter */}
      {allKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActiveKeyword(null)}
            className={`text-xs px-3 py-1.5 border transition-colors duration-200 ${
              !activeKeyword
                ? "bg-black text-white border-black"
                : "border-grey-300 text-grey-500 hover:border-black hover:text-black"
            }`}
          >
            {t("all_keywords")}
          </button>
          {allKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setActiveKeyword(kw === activeKeyword ? null : kw)}
              className={`text-xs px-3 py-1.5 border transition-colors duration-200 ${
                kw === activeKeyword
                  ? "bg-teal text-white border-teal"
                  : "border-grey-300 text-grey-500 hover:border-teal hover:text-teal"
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      )}

      {/* Research list */}
      <div className="space-y-0">
        {filtered.map((entry, idx) => (
          <div
            key={entry.slug}
            className="border-t border-grey-200 py-8 last:border-b"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Number */}
              <div className="lg:col-span-1 text-grey-300 font-serif text-2xl">
                {String(idx + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="lg:col-span-9">
                <h2 className="font-serif text-2xl leading-tight mb-2">
                  {entry.title}
                </h2>
                <p className="text-sm text-grey-500 mb-1">
                  {entry.authors}
                </p>
                <p className="text-xs text-teal font-medium mb-4">{entry.year}</p>

                {/* Keywords */}
                {entry.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {entry.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-2 py-0.5 bg-off-white text-grey-500 border border-grey-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Abstract toggle */}
                {entry.abstract && (
                  <div>
                    <button
                      onClick={() => toggleAbstract(entry.slug)}
                      className="text-xs text-teal hover:underline mb-3"
                    >
                      {expandedAbstracts.has(entry.slug)
                        ? t("hide_abstract")
                        : t("show_abstract")}
                    </button>
                    {expandedAbstracts.has(entry.slug) && (
                      <p className="text-sm text-grey-600 leading-relaxed bg-off-white p-4 border-l-2 border-teal">
                        {entry.abstract}
                      </p>
                    )}
                  </div>
                )}

                {/* Citation */}
                {entry.citation && (
                  <p className="text-xs text-grey-400 font-mono mt-4 leading-relaxed">
                    {entry.citation}
                  </p>
                )}
              </div>

              {/* Link */}
              <div className="lg:col-span-2 flex items-start">
                {entry.url && (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-teal hover:underline inline-flex items-center gap-1"
                  >
                    {t("read_paper")} →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
