import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAllResearch } from "@/lib/content";
import type { Locale } from "@/lib/config";
import ResearchClient from "./ResearchClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "kz" ? "Зерттеу" : locale === "ru" ? "Исследования" : "Research",
  };
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const research = getAllResearch(locale as Locale);

  return (
    <div className="container-archival py-16 md:py-20">
      <h1 className="page-title">research</h1>
      <div className="mt-12">
        <ResearchClient research={research} />
      </div>
    </div>
  );
}
