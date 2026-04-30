"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/config";

export default function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const timer = setTimeout(() => el.classList.add("is-visible"), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end bg-black overflow-hidden">
      {/* Architectural hero background — geometric Kazakh pattern overlay on dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-grey-700 to-grey-600" />
      <div className="absolute inset-0 kazakh-motif opacity-30" style={{ backgroundSize: "80px 80px" }} />

      {/* Vertical accent line */}
      <div className="absolute left-16 top-24 bottom-24 w-px bg-teal opacity-40 hidden lg:block" />

      {/* Hero content */}
      <div className="relative z-10 container-editorial pb-24 pt-40">
        <div className="max-w-4xl">
          <div
            ref={scrollRef}
            className="animate-on-scroll"
          >
            <span className="text-label text-teal mb-8 block tracking-widest-xl">
              {locale === "kz" ? "Цифрлық мұрағат" : locale === "ru" ? "Цифровой архив" : "Digital Archive"}
            </span>

            <h1 className="font-serif text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-tight mb-8">
              {t("hero_title")}
            </h1>

            <p className="text-grey-300 text-xl md:text-2xl font-sans font-light leading-relaxed max-w-2xl mb-12">
              {t("hero_subtitle")}
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/buildings"
                className="btn-primary bg-teal hover:bg-teal-dark"
              >
                {t("hero_cta")}
              </Link>
              <Link href="/about" className="text-sm text-grey-300 hover:text-white transition-colors">
                {locale === "kz" ? "Туралы" : locale === "ru" ? "О проекте" : "About the Project"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-xs text-grey-400 tracking-widest uppercase">
          {t("scroll_to_explore")}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-teal to-transparent animate-pulse" />
      </div>

      {/* Bottom edge geometric accent */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  );
}
