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
    title: locale === "kz" ? "Тарих" : locale === "ru" ? "История" : "History",
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
    <div className="pt-20">
      <div className="bg-black text-white">
        <div className="container-editorial py-16">
          <span className="text-label text-teal mb-4 block">Archive</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">
            {locale === "kz" ? "Тарих" : locale === "ru" ? "История" : "History"}
          </h1>
          <p className="text-grey-400 text-lg max-w-2xl">
            {locale === "kz"
              ? "Көшпелі қоныстардан модернистік қалаларға дейін"
              : locale === "ru"
              ? "От кочевых поселений до модернистских городов"
              : "From nomadic settlements to modernist cities"}
          </p>
        </div>
      </div>
      <HistoryTimeline entries={entries} locale={locale as Locale} />
    </div>
  );
}
