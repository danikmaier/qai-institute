"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { GalleryEntry } from "@/lib/content";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

export default function GalleryClient({ gallery }: { gallery: GalleryEntry[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!gallery.length) {
    return <p className="text-grey-500 text-sm">no images yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {gallery.map((item, idx) => (
          <figure key={item.slug} className="text-left">
            <button
              onClick={() => setOpen(idx)}
              className="block w-full text-left group"
            >
              <div className="relative aspect-[4/3] bg-off-white overflow-hidden">
                {item.image ? (
                  <Image
                    src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_900,q_auto,f_auto/${item.image}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <figcaption className="mt-3 text-sm text-black group-hover:text-teal transition-colors">
                {item.title}
              </figcaption>
            </button>
            {(item.photographer || item.year_taken) && (
              <p className="mt-1 text-xs text-grey-500">
                {[item.photographer, item.year_taken].filter(Boolean).join(" · ")}
              </p>
            )}
          </figure>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6 md:p-12"
          onClick={() => setOpen(null)}
        >
          <button
            onClick={() => setOpen(null)}
            aria-label="close"
            className="absolute top-6 right-6 text-sm text-grey-500 hover:text-teal lowercase tracking-[0.2em]"
          >
            close ×
          </button>
          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {gallery[open].image && (
              <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_1800,q_auto,f_auto/${gallery[open].image}`}
                  alt={gallery[open].title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            )}
            <div className="mt-4 text-left">
              <p className="text-base text-black">{gallery[open].title}</p>
              {(gallery[open].photographer || gallery[open].year_taken) && (
                <p className="mt-1 text-xs text-grey-500">
                  {[gallery[open].photographer, gallery[open].year_taken]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {gallery[open].caption && (
                <p className="mt-2 text-sm text-grey-600 max-w-prose">
                  {gallery[open].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
