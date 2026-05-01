import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAllNews } from "@/lib/content";
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

  return (
    <div className="container-archival py-16 md:py-20">
      <h1 className="page-title">news</h1>
      <div className="mt-12">
        <NewsGrid news={news} />
      </div>
    </div>
  );
}
