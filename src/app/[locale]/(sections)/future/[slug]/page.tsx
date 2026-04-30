import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getAllFuture, getFutureBySlug, markdownToHtml } from "@/lib/content";
import type { Locale } from "@/lib/config";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

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

  return <FutureDetail entry={{ ...entry, bodyHtml }} locale={locale as Locale} />;
}

function FutureDetail({
  entry,
}: {
  entry: ReturnType<typeof getFutureBySlug> & { bodyHtml?: string };
  locale: Locale;
}) {
  const t = useTranslations("future");

  if (!entry) return null;

  const categoryLabels: Record<string, string> = {
    article: t("category_article"),
    project: t("category_project"),
    proposal: t("category_proposal"),
    manifesto: t("category_manifesto"),
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      {entry.featured_image ? (
        <div className="relative h-[50vh] bg-grey-900 overflow-hidden">
          <Image
            src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_1920,h_700,c_fill/${entry.featured_image}`}
            alt={entry.title}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      ) : (
        <div className="h-32 bg-off-white kazakh-motif" />
      )}

      <div className="container-editorial py-16 max-w-4xl">
        <Link
          href="/future"
          className="text-xs text-grey-500 hover:text-teal transition-colors mb-8 inline-flex items-center gap-2"
        >
          ← {t("back_to_future")}
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-medium px-3 py-1 bg-teal/10 text-teal capitalize">
              {categoryLabels[entry.category] ?? entry.category}
            </span>
            <span className="text-xs text-grey-400">
              {format(new Date(entry.date_published), "d MMMM yyyy")}
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            {entry.title}
          </h1>

          <p className="text-sm text-grey-500 mb-12 pb-8 border-b border-grey-200">
            {t("author")}: <span className="font-medium text-black">{entry.author}</span>
          </p>

          {entry.bodyHtml && (
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-teal prose-a:no-underline hover:prose-a:underline prose-blockquote:border-teal prose-blockquote:text-grey-600"
              dangerouslySetInnerHTML={{ __html: entry.bodyHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
