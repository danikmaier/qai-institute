import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LOGO_PATH, LOCALE_LABELS } from "@/lib/config";
import type { Locale } from "@/lib/config";
import { getAbout } from "@/lib/content";

const NAV_LINKS = [
  { href: "/buildings", key: "buildings" },
  { href: "/research", key: "research" },
  { href: "/gallery", key: "gallery" },
  { href: "/history", key: "history" },
  { href: "/future", key: "future" },
  { href: "/news", key: "news" },
  { href: "/about", key: "about" },
] as const;

function KazakhPattern() {
  return (
    <div className="w-full py-4 overflow-hidden opacity-20">
      <svg
        viewBox="0 0 400 40"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        aria-hidden="true"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i} transform={`translate(${i * 40}, 0)`}>
            <path d="M20 0L40 20L20 40L0 20Z" fill="#1A5C5A" />
            <path d="M20 8L32 20L20 32L8 20Z" fill="white" />
            <path d="M20 14L26 20L20 26L14 20Z" fill="#1A5C5A" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const tAbout = useTranslations("about");
  const about = getAbout(locale as Locale);

  return (
    <footer className="bg-black text-white">
      <KazakhPattern />

      <div className="container-editorial py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Logo + mission */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8 invert">
                <Image
                  src={LOGO_PATH}
                  alt="QAI Institute"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg text-white">QAI Institute</span>
            </Link>
            <p className="text-grey-400 text-sm leading-relaxed max-w-xs">
              {about.mission.split("\n")[0] ||
                "A digital archive of Kazakh architectural identity."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-label text-grey-500 mb-6">Archive</h3>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map(({ href, key }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-grey-400 hover:text-white transition-colors duration-200"
                >
                  {t(key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact + language */}
          <div>
            <h3 className="text-label text-grey-500 mb-6">{tAbout("contact")}</h3>
            {about.contact_email && (
              <a
                href={`mailto:${about.contact_email}`}
                className="text-sm text-grey-400 hover:text-teal transition-colors duration-200 block mb-6"
              >
                {about.contact_email}
              </a>
            )}

            {about.social_links && about.social_links.length > 0 && (
              <div className="flex flex-col gap-2 mb-8">
                {about.social_links.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-grey-400 hover:text-white transition-colors duration-200"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}

            <div>
              <h3 className="text-label text-grey-500 mb-3">Language</h3>
              <div className="flex gap-3">
                {(["en", "kz", "ru"] as Locale[]).map((loc) => (
                  <Link
                    key={loc}
                    href="/"
                    locale={loc}
                    className={`text-xs font-medium transition-colors duration-200 ${
                      locale === loc ? "text-teal" : "text-grey-500 hover:text-white"
                    }`}
                  >
                    {LOCALE_LABELS[loc]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-grey-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-grey-600">
            © {new Date().getFullYear()} QAI Institute. All rights reserved.
          </p>
          <Link href="/admin" className="text-xs text-grey-700 hover:text-grey-500 transition-colors">
            CMS Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
