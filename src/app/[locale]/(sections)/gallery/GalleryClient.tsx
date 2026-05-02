"use client";

import { useState, useEffect, useMemo } from "react";
import type { GalleryEntry } from "@/lib/content";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

const MOBILE_COLS = [1, 2, 3] as const;
const DESKTOP_COLS = [3, 6, 9] as const;

type SortKey = "date" | "style" | "alpha" | "type";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "date", label: "date taken" },
  { key: "style", label: "architectural style" },
  { key: "alpha", label: "alphabetical" },
  { key: "type", label: "type" },
];

export default function GalleryClient({ gallery }: { gallery: GalleryEntry[] }) {
  const [mobileCols, setMobileCols] = useState<number>(2);
  const [desktopCols, setDesktopCols] = useState<number>(6);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [openId, setOpenId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = gallery.filter((g) => Boolean(g.image));
    if (q) {
      items = items.filter((g) => {
        const hay = [
          g.title,
          g.photographer,
          g.architectural_style,
          g.type,
          (g.tags || []).join(" "),
          g.caption,
          g.year_taken ? String(g.year_taken) : "",
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    const sorted = [...items];
    sorted.sort((a, b) => {
      switch (sort) {
        case "alpha":
          return a.title.localeCompare(b.title);
        case "style":
          return (a.architectural_style || "").localeCompare(b.architectural_style || "");
        case "type":
          return (a.type || "").localeCompare(b.type || "");
        case "date":
        default: {
          const ay = a.year_taken ?? 0;
          const by = b.year_taken ?? 0;
          if (ay !== by) return by - ay;
          return (
            new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
          );
        }
      }
    });
    return sorted;
  }, [gallery, query, sort]);

  const cols = isDesktop ? desktopCols : mobileCols;

  if (!gallery.length) {
    return <p className="text-grey-500 text-sm">no images yet.</p>;
  }

  return (
    <div>
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-end">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search..."
              className="w-full bg-transparent border border-grey-300 px-3 py-2 text-sm text-black placeholder:text-grey-400 focus:outline-none focus:border-black rounded-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-grey-500 lowercase">sort:</span>
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`lowercase transition-colors ${
                  sort === s.key
                    ? "text-teal underline underline-offset-4"
                    : "text-black hover:text-teal"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-grey-500 lowercase">columns:</span>
          <div className="flex sm:hidden items-center gap-2">
            {MOBILE_COLS.map((n, i) => (
              <span key={n} className="flex items-center gap-2">
                <button
                  onClick={() => setMobileCols(n)}
                  className={`tabular-nums lowercase transition-colors ${
                    mobileCols === n
                      ? "text-teal underline underline-offset-4"
                      : "text-black hover:text-teal"
                  }`}
                  aria-label={`${n} columns`}
                >
                  {n}
                </button>
                {i < MOBILE_COLS.length - 1 && (
                  <span className="text-grey-300">|</span>
                )}
              </span>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {DESKTOP_COLS.map((n, i) => (
              <span key={n} className="flex items-center gap-2">
                <button
                  onClick={() => setDesktopCols(n)}
                  className={`tabular-nums lowercase transition-colors ${
                    desktopCols === n
                      ? "text-teal underline underline-offset-4"
                      : "text-black hover:text-teal"
                  }`}
                  aria-label={`${n} columns`}
                >
                  {n}
                </button>
                {i < DESKTOP_COLS.length - 1 && (
                  <span className="text-grey-300">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-grey-500 text-sm">no images match.</p>
      ) : (
        <div
          style={{ columnCount: cols, columnGap: "1rem" }}
          className="[&>*]:mb-4 [&>*]:break-inside-avoid"
        >
          {filtered.map((item) => {
            const isOpen = openId === item.slug;
            const meta = [
              item.photographer,
              item.year_taken,
              item.architectural_style,
              item.type,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <figure
                key={item.slug}
                className="relative group inline-block w-full align-top"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_900,q_auto,f_auto/${item.image}`}
                  alt={item.title}
                  loading="lazy"
                  className="block w-full h-auto bg-off-white"
                />
                <figcaption
                  className={`absolute inset-0 bg-black/60 text-white p-4 flex flex-col justify-end transition-opacity duration-200 ${
                    isOpen
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                  }`}
                >
                  <p className="text-sm leading-snug">{item.title}</p>
                  {meta && (
                    <p className="mt-1 text-xs text-white/80">{meta}</p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <p className="mt-2 text-[11px] text-white/70 uppercase tracking-[0.15em]">
                      {item.tags.join(" · ")}
                    </p>
                  )}
                </figcaption>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.slug)}
                  aria-label={isOpen ? "hide info" : "show info"}
                  className="sm:hidden absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/80 text-black text-xs rounded-full"
                >
                  ⓘ
                </button>
              </figure>
            );
          })}
        </div>
      )}
    </div>
  );
}
