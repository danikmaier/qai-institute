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
  return (
    <div className="container-archival py-16 md:py-20">
      <h1 className="page-title">buildings</h1>

      <div className="mt-12">
        <BuildingsClient buildings={buildings} locale={locale} />
      </div>
    </div>
  );
}
