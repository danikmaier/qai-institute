"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/config";
import type { Building } from "@/lib/content";

const BuildingsMap = dynamic(() => import("./BuildingsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-grey-100 flex items-center justify-center">
      <span className="text-grey-400 text-sm">Loading map...</span>
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
  const t = useTranslations("buildings");
  const [view, setView] = useState<"map" | "list">("list");

  return (
    <div className="container-editorial py-12">
      {/* View toggle */}
      <div className="flex gap-1 mb-8 border border-grey-200 w-fit">
        <button
          onClick={() => setView("list")}
          className={`px-5 py-2 text-xs font-medium tracking-wide transition-colors duration-200 ${
            view === "list"
              ? "bg-black text-white"
              : "bg-white text-grey-500 hover:text-black"
          }`}
        >
          {t("list_view")}
        </button>
        <button
          onClick={() => setView("map")}
          className={`px-5 py-2 text-xs font-medium tracking-wide transition-colors duration-200 ${
            view === "map"
              ? "bg-black text-white"
              : "bg-white text-grey-500 hover:text-black"
          }`}
        >
          {t("map_view")}
        </button>
      </div>

      {view === "map" ? (
        <BuildingsMap buildings={buildings} locale={locale} />
      ) : (
        <BuildingsList buildings={buildings} locale={locale} />
      )}
    </div>
  );
}

function BuildingsList({
  buildings,
}: {
  buildings: Building[];
  locale: Locale;
}) {
  const t = useTranslations("buildings");

  if (!buildings.length) {
    return <p className="text-grey-400">{t("no_buildings")}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {buildings.map((building) => (
        <Link
          key={building.slug}
          href={`/buildings/${building.slug}`}
          className="group border border-grey-200 hover:border-teal transition-colors duration-200"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] bg-grey-100 overflow-hidden">
            {building.photos?.[0] ? (
              <Image
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder"}/image/upload/w_600,h_450,c_fill/${building.photos[0]}`}
                alt={building.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-grey-200 flex items-center justify-center kazakh-motif">
                <span className="text-grey-400 text-xs uppercase tracking-wider">No image</span>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-white/90 px-2 py-1">
              <span className="text-xs font-medium text-grey-600">{building.year_built}</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-5">
            <h2 className="font-serif text-xl leading-tight mb-2 group-hover:text-teal transition-colors">
              {building.title}
            </h2>
            <p className="text-xs text-grey-500 mb-1">{building.architect}</p>
            <p className="text-xs text-grey-400">{building.architectural_style}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
