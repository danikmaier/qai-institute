import { useTranslations } from "next-intl";
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

  return <GalleryPageContent gallery={gallery} locale={locale as Locale} />;
}

function GalleryPageContent({
  gallery,
}: {
  gallery: ReturnType<typeof getAllGallery>;
  locale: Locale;
}) {
  const t = useTranslations("gallery");

  return (
    <div className="pt-20">
      <div className="bg-off-white border-b border-grey-200">
        <div className="container-editorial py-16">
          <span className="text-label text-teal mb-4 block">Archive</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">{t("title")}</h1>
          <p className="text-grey-500 text-lg">{t("subtitle")}</p>
        </div>
      </div>
      <div className="container-editorial py-16">
        <GalleryClient gallery={gallery} />
      </div>
    </div>
  );
}
