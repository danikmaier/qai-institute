import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAllGallery } from "@/lib/content";
import type { Locale } from "@/lib/config";
import GalleryClient from "./GalleryClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "kz" ? "Галерея" : locale === "ru" ? "Галерея" : "Gallery",
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const gallery = getAllGallery(locale as Locale);

  return (
    <div className="container-archival py-16 md:py-20">
      <h1 className="page-title">gallery</h1>
      <div className="mt-12">
        <GalleryClient gallery={gallery} />
      </div>
    </div>
  );
}
