import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/config";
import {
  getAllBuildings,
  getAllResearch,
  getAllGallery,
  getAllNews,
} from "@/lib/content";
import HeroSection from "@/components/sections/HeroSection";
import SectionPreviewCard from "@/components/sections/SectionPreviewCard";
import ScrollObserver from "@/components/ui/ScrollObserver";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const buildings = getAllBuildings(loc).slice(0, 3);
  const research = getAllResearch(loc).slice(0, 2);
  const gallery = getAllGallery(loc).slice(0, 1);
  const news = getAllNews().slice(0, 3);

  return (
    <>
      <HeroSection locale={loc} />
      <HomeSections
        buildings={buildings}
        research={research}
        gallery={gallery}
        news={news}
        locale={loc}
      />
    </>
  );
}

function HomeSections({
  buildings,
  research,
  gallery,
  news,
  locale,
}: {
  buildings: ReturnType<typeof getAllBuildings>;
  research: ReturnType<typeof getAllResearch>;
  gallery: ReturnType<typeof getAllGallery>;
  news: ReturnType<typeof getAllNews>;
  locale: Locale;
}) {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  const sections = [
    {
      key: "buildings",
      title: t("section_buildings"),
      desc: t("section_buildings_desc"),
      href: "/buildings",
      label: t("latest_buildings"),
      items: buildings.map((b) => ({
        title: b.title,
        subtitle: `${b.year_built} · ${b.architect}`,
        href: `/buildings/${b.slug}`,
        image: b.photos?.[0],
      })),
      accent: true,
    },
    {
      key: "research",
      title: t("section_research"),
      desc: t("section_research_desc"),
      href: "/research",
      label: t("latest_research"),
      items: research.map((r) => ({
        title: r.title,
        subtitle: `${r.authors}, ${r.year}`,
        href: "/research",
      })),
    },
    {
      key: "gallery",
      title: t("section_gallery"),
      desc: t("section_gallery_desc"),
      href: "/gallery",
      label: t("featured_gallery"),
      items: gallery.map((g) => ({
        title: g.title,
        subtitle: g.photographer || "",
        href: "/gallery",
        image: g.image,
      })),
    },
    {
      key: "news",
      title: t("section_news"),
      desc: t("section_news_desc"),
      href: "/news",
      label: t("latest_news"),
      items: news.map((n) => ({
        title: n.title,
        subtitle: n.source_name,
        href: n.source_url,
        external: true,
      })),
    },
  ];

  return (
    <div className="bg-white pt-24 pb-32">
      <div className="container-editorial">
        {/* Section grid */}
        <div className="space-y-32">
          {sections.map((section, idx) => (
            <ScrollObserver key={section.key}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start ${
                  idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`lg:col-span-4 ${idx % 2 === 1 ? "lg:col-start-9" : ""}`}>
                  <span className="text-label text-teal mb-3 block">{section.label}</span>
                  <div className="divider-teal" />
                  <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
                    {section.title}
                  </h2>
                  <p className="text-grey-500 text-base leading-relaxed mb-8">
                    {section.desc}
                  </p>
                  <Link
                    href={section.href}
                    className="text-sm font-medium text-teal tracking-wide hover:underline inline-flex items-center gap-2"
                  >
                    {t("view_all")} →
                  </Link>
                </div>

                <div
                  className={`lg:col-span-7 ${
                    idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-6"
                  }`}
                >
                  <SectionPreviewCard items={section.items} locale={locale} />
                </div>
              </div>
            </ScrollObserver>
          ))}
        </div>

        {/* Bottom nav strip */}
        <div className="mt-32 pt-16 border-t border-grey-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {(["buildings", "research", "gallery", "history", "future", "news", "about"] as const).map(
              (key) => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className="group flex flex-col gap-2 p-4 hover:bg-off-white transition-colors duration-200"
                >
                  <span className="text-label text-grey-400 group-hover:text-teal transition-colors">
                    {tNav(key)}
                  </span>
                  <span className="w-6 h-px bg-grey-200 group-hover:bg-teal group-hover:w-10 transition-all duration-300" />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
