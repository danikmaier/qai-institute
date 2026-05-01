"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
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

export default function Navigation({ locale }: { locale: string }) {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="border-b border-grey-200 bg-white">
      <div className="px-10 md:px-16 py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: nav links */}
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-base lowercase transition-colors duration-150 ${
                isActive(href) ? "text-teal" : "text-black hover:text-teal"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: logo + lang */}
        <div className="flex items-center gap-6 md:gap-8 shrink-0">
          <div className="flex items-center gap-3">
            {(["en", "kz", "ru"] as Locale[]).map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                className={`text-xs uppercase tracking-[0.2em] transition-colors duration-150 ${
                  locale === l ? "text-teal" : "text-grey-500 hover:text-teal"
                }`}
              >
                {LOCALE_LABELS[l]}
              </Link>
            ))}
          </div>
          <Link href="/" aria-label="QAI INSTITUTE" className="block">
            <span className="relative block w-[110px] h-[28px] md:w-[140px] md:h-[36px]">
              <Image
                src={LOGO_PATH}
                alt="QAI INSTITUTE"
                fill
                sizes="140px"
                className="object-contain object-right"
                priority
              />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
