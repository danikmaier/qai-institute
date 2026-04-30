"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryEntry } from "@/lib/content";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

export default function GalleryClient({ gallery }: { gallery: GalleryEntry[] }) {
  const t = useTranslations("gallery");
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!gallery.length) {
    return <p className="text-grey-400">{t("no_gallery")}</p>;
  }

  const closeLightbox = () => setLightbox(null);
  const prevImage = () =>
    setLightbox((i) => (i !== null ? (i - 1 + gallery.length) % gallery.length : null));
  const nextImage = () =>
    setLightbox((i) => (i !== null ? (i + 1) % gallery.length : null));

  return (
    <>
      {/* Masonry-style editorial grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {gallery.map((item, idx) => (
          <div
            key={item.slug}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setLightbox(idx)}
          >
            <div className="relative overflow-hidden bg-grey-100">
              {item.image ? (
                <Image
                  src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_800,q_auto,f_auto/${item.image}`}
                  alt={item.title}
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="aspect-[4/3] bg-grey-200 kazakh-motif flex items-center justify-center">
                  <span className="text-grey-400 text-xs">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm font-serif">{item.title}</p>
                {item.photographer && (
                  <p className="text-white/70 text-xs mt-0.5">{item.photographer}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {gallery[lightbox].image && (
              <div className="relative">
                <Image
                  src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_1600,q_auto,f_auto/${gallery[lightbox].image}`}
                  alt={gallery[lightbox].title}
                  width={1600}
                  height={1200}
                  sizes="100vw"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            )}
            <div className="mt-4 text-center">
              <p className="text-white font-serif text-lg">{gallery[lightbox].title}</p>
              {gallery[lightbox].caption && (
                <p className="text-grey-400 text-sm mt-1">{gallery[lightbox].caption}</p>
              )}
              {gallery[lightbox].photographer && (
                <p className="text-grey-500 text-xs mt-1">
                  {t("photographer")}: {gallery[lightbox].photographer}
                </p>
              )}
            </div>

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/60 hover:text-white text-3xl p-2"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/60 hover:text-white text-3xl p-2"
            >
              →
            </button>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm tracking-wider"
            >
              {t("close")} ×
            </button>

            {/* Counter */}
            <div className="absolute -top-10 left-0 text-white/40 text-xs">
              {lightbox + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
