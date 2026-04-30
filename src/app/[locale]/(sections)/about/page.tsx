import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAbout, markdownToHtml } from "@/lib/content";
import type { Locale } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "kz" ? "QAI Институты туралы" : locale === "ru" ? "Об институте QAI" : "About QAI Institute",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const about = getAbout(loc);
  const missionHtml = await markdownToHtml(about.mission || "");
  const bioHtml = await markdownToHtml(about.bio || "");

  return (
    <AboutContent
      about={about}
      missionHtml={missionHtml}
      bioHtml={bioHtml}
      locale={loc}
    />
  );
}

function AboutContent({
  about,
  missionHtml,
  bioHtml,
}: {
  about: ReturnType<typeof getAbout>;
  missionHtml: string;
  bioHtml: string;
  locale: Locale;
}) {
  const t = useTranslations("about");

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-black text-white">
        <div className="container-editorial py-24">
          <div className="max-w-3xl">
            <span className="text-label text-teal mb-6 block">QAI Institute</span>
            <div className="divider-teal" />
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-8">
              {t("title")}
            </h1>
          </div>
        </div>
      </div>

      {/* Kazakh geometric divider */}
      <div className="w-full overflow-hidden bg-black">
        <svg viewBox="0 0 1200 40" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <g key={i} transform={`translate(${i * 40}, 0)`}>
              <path d="M20 0L40 20L20 40L0 20Z" fill="#1A5C5A" fillOpacity="0.4" />
              <path d="M20 8L32 20L20 32L8 20Z" fill="black" />
              <path d="M20 14L26 20L20 26L14 20Z" fill="#1A5C5A" fillOpacity="0.3" />
            </g>
          ))}
        </svg>
      </div>

      <div className="container-editorial py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Mission */}
          <div className="lg:col-span-7">
            <span className="text-label text-teal mb-6 block">{t("mission")}</span>
            <div className="divider-teal" />
            {missionHtml ? (
              <div
                className="prose prose-lg max-w-none font-sans prose-headings:font-serif prose-a:text-teal"
                dangerouslySetInnerHTML={{ __html: missionHtml }}
              />
            ) : (
              <p className="text-grey-600 leading-relaxed text-lg">
                The QAI Institute is dedicated to documenting, preserving, and
                celebrating Kazakhstan&apos;s rich architectural heritage. We believe
                that architecture is the most tangible expression of a culture&apos;s
                identity — its materials, forms, and spatial logic carry the
                accumulated wisdom of generations.
              </p>
            )}

            {/* Bio */}
            <div className="mt-16 pt-16 border-t border-grey-200">
              <span className="text-label text-teal mb-6 block">{t("bio")}</span>
              <div className="divider-teal" />
              {bioHtml ? (
                <div
                  className="prose prose-lg max-w-none font-sans prose-headings:font-serif prose-a:text-teal"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              ) : (
                <p className="text-grey-600 leading-relaxed">
                  Founded by architects, historians, and cultural researchers, the QAI
                  Institute operates as a trilingual digital archive — making
                  Kazakhstan&apos;s architectural legacy accessible in Kazakh, Russian, and
                  English.
                </p>
              )}
            </div>
          </div>

          {/* Contact sidebar */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-28 space-y-8">
              {/* Contact */}
              <div className="border border-grey-200 p-6">
                <span className="text-label text-grey-400 mb-4 block">{t("contact")}</span>
                {about.contact_email && (
                  <a
                    href={`mailto:${about.contact_email}`}
                    className="text-teal hover:underline text-sm block mb-2"
                  >
                    {about.contact_email}
                  </a>
                )}
              </div>

              {/* Social */}
              {about.social_links && about.social_links.length > 0 && (
                <div className="border border-grey-200 p-6">
                  <span className="text-label text-grey-400 mb-4 block">{t("social")}</span>
                  <div className="space-y-3">
                    {about.social_links.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm text-grey-600 hover:text-teal transition-colors group"
                      >
                        <span>{link.platform}</span>
                        <span className="text-grey-300 group-hover:text-teal">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CMS admin link */}
              <div className="bg-teal/5 border border-teal/20 p-6">
                <span className="text-label text-teal mb-3 block">Content Management</span>
                <p className="text-xs text-grey-600 mb-4">
                  Administrators can manage site content via the Decap CMS interface.
                </p>
                <a
                  href="/admin"
                  className="text-xs font-medium text-teal hover:underline"
                >
                  Open CMS Admin →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
