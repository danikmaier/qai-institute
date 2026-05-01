"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/config";
import type { Building } from "@/lib/content";

const BuildingsMap = dynamic(() => import("./BuildingsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[640px] border border-grey-200 flex items-center justify-center">
      <span className="text-grey-500 text-sm">loading map…</span>
    </div>
  ),
});

export default function BuildingsClient({
  buildings,
  locale,
}: {
  buildings: Building[];
  locale: Locale;
}) {
  const [view, setView] = useState<"map" | "list">("list");

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
        <BuildingsList buildings={buildings} />
      )}
    </div>
  );
}

function BuildingsList({ buildings }: { buildings: Building[] }) {
  if (!buildings.length) {
    return <p className="text-grey-500 text-sm">no buildings yet.</p>;
  }

  return (
    <ul className="bullet-list space-y-3 text-base">
      {buildings.map((b) => (
        <li key={b.slug}>
          <Link
            href={`/buildings/${b.slug}`}
            className="text-black hover:text-teal transition-colors duration-150"
          >
            {b.title}
            {b.architect ? <span className="text-grey-600"> — {b.architect}</span> : null}
            {b.year_built ? <span className="text-grey-600">, {b.year_built}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
