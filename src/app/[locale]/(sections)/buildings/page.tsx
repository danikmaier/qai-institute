import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAllBuildings } from "@/lib/content";
import type { Locale } from "@/lib/config";
import BuildingsClient from "./BuildingsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "kz" ? "Ғимараттар" : locale === "ru" ? "Здания" : "Buildings",
  };
}

export default async function BuildingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const buildings = getAllBuildings(locale as Locale);

  return <BuildingsPageContent buildings={buildings} locale={locale as Locale} />;
}

function BuildingsPageContent({
  buildings,
  locale,
}: {
  buildings: ReturnType<typeof getAllBuildings>;
  locale: Locale;
}) {
  const t = useTranslations("buildings");

  return (
    <div className="pt-20">
      {/* Page header */}
      <div className="bg-off-white border-b border-grey-200">
        <div className="container-editorial py-16">
          <span className="text-label text-teal mb-4 block">Archive</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">{t("title")}</h1>
          <p className="text-grey-500 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <BuildingsClient buildings={buildings} locale={locale} />
    </div>
  );
}
