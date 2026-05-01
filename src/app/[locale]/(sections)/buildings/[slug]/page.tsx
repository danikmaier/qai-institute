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

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

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
  if (!building) return null;

  const meta: { label: string; value: string }[] = [
    { label: "architect", value: building.architect },
    { label: "year", value: String(building.year_built ?? "") },
    { label: "style", value: building.architectural_style },
    { label: "owner", value: building.current_owner },
  ].filter((m) => m.value);

  return (
    <div className="container-archival py-16 md:py-20">
      <Link
        href="/buildings"
        className="text-sm text-grey-500 hover:text-teal lowercase transition-colors"
      >
        ← back to buildings
      </Link>

      <h1 className="page-title mt-10 max-w-4xl">
        {building.title.toLowerCase()}
      </h1>

      <div className="mt-10 pl-6 sm:pl-7 max-w-2xl">
        {meta.map((m) => (
          <p key={m.label} className="text-sm sm:text-base text-black leading-[1.9] break-words">
            <span className="text-grey-500">{m.label}:</span> {m.value}
          </p>
        ))}
        <p className="text-sm sm:text-base text-black leading-[1.9] break-words">
          <span className="text-grey-500">coordinates:</span>{" "}
          <span className="tabular-nums">
            {building.latitude.toFixed(4)}°N, {building.longitude.toFixed(4)}°E
          </span>{" "}
          <a
            href={`https://www.google.com/maps?q=${building.latitude},${building.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            view on map
          </a>
        </p>
      </div>

      {building.descriptionHtml && (
        <div className="mt-16 max-w-prose">
          <div
            className="prose-archival"
            dangerouslySetInnerHTML={{ __html: building.descriptionHtml }}
          />
        </div>
      )}

      {building.photos && building.photos.length > 0 && (
        <div className="mt-16">
          <span className="rule mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {building.photos.map((photo, idx) => (
              <figure key={idx}>
                <div className="relative aspect-[4/3] bg-off-white">
                  <Image
                    src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_1200,h_900,c_fill/${photo}`}
                    alt={`${building.title} — ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-xs text-grey-500 tabular-nums">
                  {String(idx + 1).padStart(2, "0")} / {String(building.photos.length).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {building.notes_future_development && (
        <div className="mt-20">
          <span className="rule mb-8" />
          <FutureDevelopmentPanel
            notes={building.notes_future_development}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
