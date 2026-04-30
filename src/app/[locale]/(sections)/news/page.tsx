import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAllNews } from "@/lib/content";
import type { Locale } from "@/lib/config";
import NewsGrid from "./NewsGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "kz" ? "Жаңалықтар" : locale === "ru" ? "Новости" : "News",
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const news = getAllNews();

  return <NewsPageContent news={news} locale={locale as Locale} />;
}

function NewsPageContent({
  news,
}: {
  news: ReturnType<typeof getAllNews>;
  locale: Locale;
}) {
  const t = useTranslations("news");

  return (
    <div className="pt-20">
      <div className="bg-off-white border-b border-grey-200">
        <div className="container-editorial py-16">
          <span className="text-label text-teal mb-4 block">Auto-curated</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">{t("title")}</h1>
          <p className="text-grey-500 text-lg">{t("subtitle")}</p>
        </div>
      </div>
      <div className="container-editorial py-16">
        <NewsGrid news={news} />
      </div>
    </div>
  );
}
