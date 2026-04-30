"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import type { FutureEntry } from "@/lib/content";
import type { Locale } from "@/lib/config";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

const CATEGORIES = ["article", "project", "proposal", "manifesto"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  article: "bg-grey-100 text-grey-600",
  project: "bg-teal/10 text-teal",
  proposal: "bg-black/5 text-grey-700",
  manifesto: "bg-black text-white",
};

export default function FutureClient({
  entries,
}: {
  entries: FutureEntry[];
  locale: Locale;
}) {
  const t = useTranslations("future");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = activeCategory
    ? entries.filter((e) => e.category === activeCategory)
    : entries;

  if (!entries.length) {
    return <p className="text-grey-400">{t("no_future")}</p>;
  }

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs px-4 py-2 border transition-colors duration-200 ${
            !activeCategory
              ? "bg-black text-white border-black"
              : "border-grey-300 text-grey-500 hover:border-black hover:text-black"
          }`}
        >
          {t("all_categories")}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(cat === activeCategory ? null : cat)
            }
            className={`text-xs px-4 py-2 border transition-colors duration-200 capitalize ${
              cat === activeCategory
                ? "bg-teal text-white border-teal"
                : "border-grey-300 text-grey-500 hover:border-teal hover:text-teal"
            }`}
          >
            {t(`category_${cat}`)}
          </button>
        ))}
      </div>

      {/* Featured first entry (large) */}
      {filtered.length > 0 && (
        <Link
          href={`/future/${filtered[0].slug}`}
          className="group block mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-grey-200 hover:border-teal transition-colors duration-300">
            {filtered[0].featured_image ? (
              <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-grey-100">
                <Image
                  src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_800,q_auto,f_auto/${filtered[0].featured_image}`}
                  alt={filtered[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] lg:aspect-auto bg-off-white kazakh-motif min-h-64" />
            )}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`text-xs px-2 py-1 font-medium capitalize ${
                      CATEGORY_COLORS[filtered[0].category]
                    }`}
                  >
                    {t(`category_${filtered[0].category}`)}
                  </span>
                  <span className="text-xs text-grey-400">
                    {format(new Date(filtered[0].date_published), "d MMM yyyy")}
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4 group-hover:text-teal transition-colors">
                  {filtered[0].title}
                </h2>
                <p className="text-grey-500 text-sm mb-6">
                  {filtered[0].body.slice(0, 200)}…
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-grey-500">{filtered[0].author}</span>
                <span className="text-sm font-medium text-teal group-hover:underline">
                  {t("read_more")} →
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Remaining entries grid */}
      {filtered.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(1).map((entry) => (
            <Link
              key={entry.slug}
              href={`/future/${entry.slug}`}
              className="group border border-grey-200 hover:border-teal transition-colors duration-200"
            >
              {entry.featured_image ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-grey-100">
                  <Image
                    src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_600,q_auto,f_auto/${entry.featured_image}`}
                    alt={entry.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-off-white kazakh-motif" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs px-2 py-0.5 font-medium capitalize ${
                      CATEGORY_COLORS[entry.category]
                    }`}
                  >
                    {t(`category_${entry.category}`)}
                  </span>
                </div>
                <h3 className="font-serif text-xl leading-tight mb-2 group-hover:text-teal transition-colors">
                  {entry.title}
                </h3>
                <p className="text-xs text-grey-500 mt-3">{entry.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
