import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  getAllBuildings,
  getBuildingBySlug,
  markdownToHtml,
} from "@/lib/content";
import type { Locale } from "@/lib/config";
import FutureDevelopmentPanel from "./FutureDevelopmentPanel";

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const buildings = getAllBuildings(locale as Locale);
  return buildings.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const building = getBuildingBySlug(slug, locale as Locale);
  if (!building) return {};
  return { title: building.title };
}

export default async function BuildingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const building = getBuildingBySlug(slug, locale as Locale);
  if (!building) notFound();

  const descriptionHtml = await markdownToHtml(building.description || "");

  return (
    <BuildingDetail
      building={{ ...building, descriptionHtml }}
      locale={locale as Locale}
    />
  );
}

function BuildingDetail({
  building,
  locale,
}: {
  building: ReturnType<typeof getBuildingBySlug> & { descriptionHtml?: string };
  locale: Locale;
}) {
  const t = useTranslations("buildings");

  if (!building) return null;

  return (
    <div className="pt-20">
      {/* Hero image */}
      <div className="relative h-[60vh] bg-grey-900 overflow-hidden">
        {building.photos?.[0] ? (
          <Image
            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder"}/image/upload/w_1920,h_800,c_fill/${building.photos[0]}`}
            alt={building.title}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-grey-800 kazakh-motif" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-editorial pb-12">
          <span className="text-label text-teal mb-3 block">{building.year_built}</span>
          <h1 className="font-serif text-white text-4xl md:text-6xl leading-tight">
            {building.title}
          </h1>
        </div>
      </div>

      <div className="container-editorial py-16">
        {/* Back link */}
        <Link
          href="/buildings"
          className="text-xs text-grey-500 hover:text-teal transition-colors mb-12 inline-flex items-center gap-2"
        >
          ← {t("back_to_buildings")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            {building.descriptionHtml && (
              <div
                className="prose prose-lg max-w-none font-sans text-grey-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: building.descriptionHtml }}
              />
            )}

            {/* Photo grid */}
            {building.photos && building.photos.length > 1 && (
              <div className="mt-12">
                <h2 className="font-serif text-2xl mb-6">Photography</h2>
                <div className="grid grid-cols-2 gap-3">
                  {building.photos.slice(1).map((photo, idx) => (
                    <div key={idx} className="relative aspect-[4/3] bg-grey-100 overflow-hidden">
                      <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder"}/image/upload/w_800,h_600,c_fill/${photo}`}
                        alt={`${building.title} photo ${idx + 2}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Future development */}
            {building.notes_future_development && (
              <div className="mt-16">
                <FutureDevelopmentPanel
                  notes={building.notes_future_development}
                  locale={locale}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="border border-grey-200 p-6">
                <h2 className="text-label text-grey-400 mb-6">Details</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-grey-400 mb-1">{t("year_built")}</dt>
                    <dd className="font-serif text-lg">{building.year_built}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-grey-400 mb-1">{t("architect")}</dt>
                    <dd className="text-sm font-medium">{building.architect}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-grey-400 mb-1">{t("style")}</dt>
                    <dd className="text-sm">{building.architectural_style}</dd>
                  </div>
                  {building.current_owner && (
                    <div>
                      <dt className="text-xs text-grey-400 mb-1">{t("owner")}</dt>
                      <dd className="text-sm">{building.current_owner}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-grey-400 mb-1">Coordinates</dt>
                    <dd className="text-xs font-mono text-grey-600">
                      {building.latitude.toFixed(4)}°N,{" "}
                      {building.longitude.toFixed(4)}°E
                    </dd>
                  </div>
                </dl>
              </div>

              <a
                href={`https://www.google.com/maps?q=${building.latitude},${building.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center text-xs"
              >
                View on Google Maps →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
