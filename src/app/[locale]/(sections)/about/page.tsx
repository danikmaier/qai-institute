import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getAbout, markdownToHtml } from "@/lib/content";
import { BRAND } from "@/lib/config";
import type { Locale } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "kz" ? `${BRAND} туралы` : locale === "ru" ? `Об ${BRAND}` : `About ${BRAND}`,
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
    />
  );
}

function PatternBlock() {
  return (
    <svg
      viewBox="0 0 320 80"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md opacity-60"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(${i * 40}, 0)`}>
          <path d="M20 0L40 40L20 80L0 40Z" fill="none" stroke="#7C7C7C" strokeWidth="0.6" />
          <path d="M20 16L32 40L20 64L8 40Z" fill="none" stroke="#7C7C7C" strokeWidth="0.6" />
          <path d="M20 28L26 40L20 52L14 40Z" fill="none" stroke="#7C7C7C" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
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
}) {
  return (
    <div className="container-archival py-16 md:py-20">
      <h1 className="page-title">about</h1>

      <div className="mt-12 max-w-prose">
        {missionHtml ? (
          <div
            className="prose-archival"
            dangerouslySetInnerHTML={{ __html: missionHtml }}
          />
        ) : (
          <p className="prose-archival">{about.mission}</p>
        )}
      </div>

      {bioHtml || about.bio ? (
        <div className="mt-12 max-w-prose">
          {bioHtml ? (
            <div
              className="prose-archival"
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          ) : (
            <p className="prose-archival">{about.bio}</p>
          )}
        </div>
      ) : null}

      <div className="mt-16 max-w-prose">
        {about.contact_email && (
          <p className="text-base text-black break-all">
            <a
              href={`mailto:${about.contact_email}`}
              className="link-underline"
            >
              {about.contact_email}
            </a>
          </p>
        )}
        {about.social_links && about.social_links.length > 0 && (
          <ul className="bullet-list mt-4 space-y-1 text-sm">
            {about.social_links.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-24">
        <PatternBlock />
      </div>
    </div>
  );
}
