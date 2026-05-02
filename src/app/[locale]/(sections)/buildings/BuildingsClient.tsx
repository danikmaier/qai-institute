"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/config";
import type { Building } from "@/lib/content";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

const BuildingsMap = dynamic(() => import("./BuildingsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[600px] border border-grey-200 flex items-center justify-center">
      <span className="text-grey-500 text-sm">loading map…</span>
    </div>
  ),
});

const MOBILE_COLS = [1, 2, 3] as const;
const DESKTOP_COLS = [3, 6, 9] as const;

type SortKey = "location" | "style" | "year";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "location", label: "location" },
  { key: "style", label: "architectural style" },
  { key: "year", label: "year" },
];

export default function BuildingsClient({
  buildings,
  locale,
}: {
  buildings: Building[];
  locale: Locale;
}) {
  const [view, setView] = useState<"map" | "list">("list");
  const [mobileCols, setMobileCols] = useState<number>(2);
  const [desktopCols, setDesktopCols] = useState<number>(6);
  const [sort, setSort] = useState<SortKey>("location");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const sorted = useMemo(() => {
    const items = [...buildings];
    items.sort((a, b) => {
      switch (sort) {
        case "year":
          return (a.year_built ?? 0) - (b.year_built ?? 0);
        case "style":
          return (a.architectural_style || "").localeCompare(
            b.architectural_style || ""
          );
        case "location":
        default:
          return (a.location || "").localeCompare(b.location || "");
      }
    });
    return items;
  }, [buildings, sort]);

  const cols = isDesktop ? desktopCols : mobileCols;

  return (
    <div>
      <ul className="bullet-list space-y-1 mb-10 text-base">
        <li>
          <button
            onClick={() => setView("map")}
            className={`lowercase transition-colors duration-150 ${
              view === "map" ? "text-teal" : "text-black hover:text-teal"
            }`}
          >
            map
          </button>
        </li>
        <li>
          <button
            onClick={() => setView("list")}
            className={`lowercase transition-colors duration-150 ${
              view === "list" ? "text-teal" : "text-black hover:text-teal"
            }`}
          >
            list
          </button>
        </li>
      </ul>

      {view === "map" ? (
        <BuildingsMap buildings={buildings} locale={locale} />
      ) : (
        <BuildingsList
          buildings={sorted}
          cols={cols}
          mobileCols={mobileCols}
          setMobileCols={setMobileCols}
          desktopCols={desktopCols}
          setDesktopCols={setDesktopCols}
          sort={sort}
          setSort={setSort}
        />
      )}
    </div>
  );
}

function BuildingsList({
  buildings,
  cols,
  mobileCols,
  setMobileCols,
  desktopCols,
  setDesktopCols,
  sort,
  setSort,
}: {
  buildings: Building[];
  cols: number;
  mobileCols: number;
  setMobileCols: (n: number) => void;
  desktopCols: number;
  setDesktopCols: (n: number) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
}) {
  if (!buildings.length) {
    return <p className="text-grey-500 text-sm">no buildings yet.</p>;
  }

  return (
    <div>
      <div className="flex flex-col gap-6 mb-10">
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

      <div
        className="grid gap-x-4 gap-y-10"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {buildings.map((b) => {
          const cover = b.photos?.[0];
          return (
            <Link
              key={b.slug}
              href={`/buildings/${b.slug}`}
              className="block group text-left"
            >
              <div className="relative w-full aspect-[4/5] bg-off-white overflow-hidden">
                {cover ? (
                  <Image
                    src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_800,h_1000,c_fill,q_auto,f_auto/${cover}`}
                    alt={b.title}
                    fill
                    sizes={`(max-width: 768px) ${Math.round(100 / Math.max(cols, 1))}vw, ${Math.round(100 / Math.max(cols, 1))}vw`}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-grey-400 text-xs lowercase">
                    no image
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-sm text-black group-hover:text-teal transition-colors leading-snug break-words">
                  {b.title}
                </p>
                {(b.architect || b.year_built) && (
                  <p className="mt-1 text-xs text-grey-500 break-words">
                    {[b.architect, b.year_built].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
