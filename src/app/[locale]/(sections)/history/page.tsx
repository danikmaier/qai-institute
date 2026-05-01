import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAllHistory } from "@/lib/content";
import type { Locale } from "@/lib/config";
import HistoryTimeline from "./HistoryTimeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "kz" ? "Тарих" : locale === "ru" ? "История" : "Timeline",
  };
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const entries = getAllHistory(locale as Locale);

  return (
    <div className="container-archival py-16 md:py-20">
      <h1 className="page-title">timeline</h1>
      <div className="mt-12">
        <HistoryTimeline entries={entries} locale={locale as Locale} />
      </div>
    </div>
  );
}
