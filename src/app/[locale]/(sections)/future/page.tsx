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
    <div className="pt-20">
      <div className="bg-off-white border-b border-grey-200">
        <div className="container-editorial py-16">
          <span className="text-label text-teal mb-4 block">Archive</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">
            {locale === "kz" ? "Болашақ" : locale === "ru" ? "Будущее" : "Future"}
          </h1>
          <p className="text-grey-500 text-lg max-w-2xl">
            {locale === "kz"
              ? "Қазақ сәулеті үшін идеялар, ұсыныстар және манифесттер"
              : locale === "ru"
              ? "Идеи, предложения и манифесты для казахской архитектуры"
              : "Ideas, proposals, and manifestos for Kazakh architecture"}
          </p>
        </div>
      </div>
      <div className="container-editorial py-16">
        <FutureClient entries={entries} locale={locale as Locale} />
      </div>
    </div>
  );
}
