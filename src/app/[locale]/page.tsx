import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LOGO_PATH, LOCALE_LABELS } from "@/lib/config";
import type { Locale } from "@/lib/config";

const NAV_LINKS = [
  { href: "/research", label: "research" },
  { href: "/buildings", label: "buildings" },
  { href: "/gallery", label: "gallery" },
  { href: "/history", label: "timeline" },
  { href: "/future", label: "future" },
  { href: "/news", label: "news" },
  { href: "/about", label: "about" },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-white">
      {/* Top-left: navigation list with bullets */}
      <nav className="absolute top-6 left-6 sm:top-10 sm:left-10 md:top-16 md:left-16">
        <ul className="list-disc list-outside pl-6 sm:pl-7 space-y-1.5 sm:space-y-2 marker:text-black">
          {NAV_LINKS.map(({ href, label }) => (
            <li
              key={href}
              className="text-[22px] sm:text-[28px] md:text-[32px] leading-[1.35]"
            >
              <Link
                href={href}
                className="lowercase text-black hover:text-teal transition-colors duration-150"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Top-right: language switcher */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 md:top-16 md:right-16 flex items-center gap-3">
        {(["en", "kz", "ru"] as Locale[]).map((l) => (
          <Link
            key={l}
            href="/"
            locale={l}
            className={`text-xs uppercase tracking-[0.2em] transition-colors duration-150 ${
              loc === l ? "text-teal" : "text-grey-500 hover:text-teal"
            }`}
          >
            {LOCALE_LABELS[l]}
          </Link>
        ))}
      </div>

      {/* Bottom-right: logo */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 md:bottom-16 md:right-16 w-[170px] h-[105px] sm:w-[260px] sm:h-[160px] md:w-[320px] md:h-[200px]">
        <Image
          src={LOGO_PATH}
          alt="QAI INSTITUTE"
          fill
          sizes="(max-width: 640px) 170px, (max-width: 768px) 260px, 320px"
          priority
          className="object-contain"
          style={{ objectPosition: "right bottom" }}
        />
      </div>
    </section>
  );
}
