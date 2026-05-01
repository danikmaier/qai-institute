import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAllFuture } from "@/lib/content";
import type { Locale } from "@/lib/config";
import FutureClient from "./FutureClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "kz" ? "Болашақ" : locale === "ru" ? "Будущее" : "Future",
  };
}

export default async function FuturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const entries = getAllFuture(locale as Locale);

  return (
    <div className="container-archival py-16 md:py-20">
      <h1 className="page-title">future</h1>
      <div className="mt-12">
        <FutureClient entries={entries} locale={locale as Locale} />
      </div>
    </div>
  );
}
