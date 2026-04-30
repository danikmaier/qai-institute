"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOGO_PATH, LOCALE_LABELS } from "@/lib/config";
import type { Locale } from "@/lib/config";

const NAV_LINKS = [
  { href: "/buildings", key: "buildings" },
  { href: "/research", key: "research" },
  { href: "/gallery", key: "gallery" },
  { href: "/history", key: "history" },
  { href: "/future", key: "future" },
  { href: "/news", key: "news" },
  { href: "/about", key: "about" },
] as const;

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white border-b border-grey-200 shadow-sm" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container-editorial">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-8 h-8">
              <Image
                src={LOGO_PATH}
                alt="QAI Institute"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="font-serif text-lg tracking-tight text-black hidden sm:block">
              QAI Institute
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs font-medium tracking-widest uppercase transition-colors duration-200 ${
                  isActive(href)
                    ? "text-teal border-b border-teal pb-0.5"
                    : "text-grey-600 hover:text-teal"
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Language switcher + mobile menu */}
          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex items-center gap-1">
              {(["en", "kz", "ru"] as Locale[]).map((loc) => (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  className={`text-xs font-medium px-1.5 py-0.5 transition-colors duration-200 ${
                    locale === loc
                      ? "text-teal border-b border-teal"
                      : "text-grey-400 hover:text-black"
                  }`}
                >
                  {LOCALE_LABELS[loc]}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`w-6 h-px bg-black transition-transform duration-200 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-6 h-px bg-black transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-px bg-black transition-transform duration-200 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden border-t border-grey-200 bg-white transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="container-editorial py-6 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium tracking-widest uppercase py-2 border-b border-grey-100 ${
                isActive(href) ? "text-teal" : "text-grey-600"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
