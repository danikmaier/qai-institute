"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { HistoryEntry } from "@/lib/content";
import type { Locale } from "@/lib/config";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

export default function HistoryTimeline({
  entries,
}: {
  entries: HistoryEntry[];
  locale: Locale;
}) {
  const t = useTranslations("history");
  const [activeIdx, setActiveIdx] = useState(0);

  if (!entries.length) {
    return (
      <div className="container-editorial py-24 text-grey-400">{t("no_history")}</div>
    );
  }

  const active = entries[activeIdx];

  return (
    <div className="container-editorial py-16">
      {/* Period selector — horizontal scrollable strip */}
      <div className="relative mb-16">
        <div className="flex overflow-x-auto gap-0 pb-4 scrollbar-hide">
          {entries.map((entry, idx) => (
            <button
              key={entry.slug}
              onClick={() => setActiveIdx(idx)}
              className={`group flex-shrink-0 flex flex-col items-start px-6 py-4 border-t-2 transition-all duration-300 min-w-[160px] text-left ${
                idx === activeIdx
                  ? "border-teal bg-teal/5"
                  : "border-grey-200 hover:border-grey-400"
              }`}
            >
              <span
                className={`text-xs font-mono font-medium mb-2 ${
                  idx === activeIdx ? "text-teal" : "text-grey-400"
                }`}
              >
                {entry.period_start}
                {entry.period_end ? `–${entry.period_end}` : "+"}
              </span>
              <span
                className={`font-serif text-sm leading-tight ${
                  idx === activeIdx ? "text-black" : "text-grey-500 group-hover:text-black"
                }`}
              >
                {entry.title}
              </span>
            </button>
          ))}
        </div>
        {/* Connecting timeline line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-grey-200" />
      </div>

      {/* Active entry detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 min-h-[480px]">
        {/* Text */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <span className="text-label text-teal mb-4 block">
              {active.period_start}
              {active.period_end ? `–${active.period_end}` : "–Present"}
            </span>
            <div className="divider-teal" />
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              {active.title}
            </h2>
            <p className="text-grey-600 text-base leading-relaxed">
              {active.description}
            </p>

            {active.key_buildings && active.key_buildings.length > 0 && (
              <div className="mt-8 pt-8 border-t border-grey-200">
                <span className="text-label text-grey-400 mb-4 block">
                  {t("key_buildings")}
                </span>
                <ul className="space-y-2">
                  {active.key_buildings.map((b) => (
                    <li key={b} className="text-sm text-grey-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-teal rounded-full inline-block" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="lg:col-span-7">
          {active.images && active.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {active.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative bg-grey-100 overflow-hidden ${
                    idx === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_1200,q_auto,f_auto/${img}`}
                    alt={`${active.title} image ${idx + 1}`}
                    fill
                    sizes={idx === 0 ? "100vw" : "50vw"}
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Decorative placeholder when no images */
            <div className="aspect-[4/3] bg-off-white kazakh-motif flex items-center justify-center relative overflow-hidden">
              <div className="text-center z-10">
                <span className="font-serif text-8xl text-grey-200 leading-none block">
                  {active.period_start}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-between items-center mt-16 pt-8 border-t border-grey-200">
        <button
          onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
          disabled={activeIdx === 0}
          className="text-sm text-grey-400 hover:text-teal disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          ← Previous Period
        </button>
        <span className="text-xs text-grey-400">
          {activeIdx + 1} / {entries.length}
        </span>
        <button
          onClick={() => setActiveIdx((i) => Math.min(entries.length - 1, i + 1))}
          disabled={activeIdx === entries.length - 1}
          className="text-sm text-grey-400 hover:text-teal disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          Next Period →
        </button>
      </div>
    </div>
  );
}
