import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getAllFuture, getFutureBySlug, markdownToHtml } from "@/lib/content";
import type { Locale } from "@/lib/config";

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getAllFuture(locale as Locale).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = getFutureBySlug(slug, locale as Locale);
  if (!entry) return {};
  return { title: entry.title };
}

export default async function FutureDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = getFutureBySlug(slug, locale as Locale);
  if (!entry) notFound();

  const bodyHtml = await markdownToHtml(entry.body || "");

  return <FutureDetail entry={{ ...entry, bodyHtml }} />;
}

function FutureDetail({
  entry,
}: {
  entry: ReturnType<typeof getFutureBySlug> & { bodyHtml?: string };
}) {
  if (!entry) return null;

  return (
    <div className="container-archival py-16 md:py-20">
      <Link
        href="/future"
        className="text-sm text-grey-500 hover:text-teal lowercase transition-colors"
      >
        ← back to future
      </Link>

      <article className="mt-10" style={{ maxWidth: 680 }}>
        <h1 className="page-title">{entry.title.toLowerCase()}</h1>

        <p className="mt-6 text-sm text-grey-500">
          {entry.author}
          {", "}
          <span className="tabular-nums">
            {format(new Date(entry.date_published), "d MMMM yyyy")}
          </span>
          <span className="lowercase"> ({entry.category})</span>
        </p>

        <span className="rule mt-8" />

        {entry.bodyHtml && (
          <div
            className="prose-archival mt-10"
            dangerouslySetInnerHTML={{ __html: entry.bodyHtml }}
          />
        )}
      </article>
    </div>
  );
}
