export const LOGO_PATH = "/logo.svg";
export const SITE_NAME = "QAI Institute";
export const SITE_DESCRIPTION = {
  en: "A digital archive of Kazakh architectural identity",
  kz: "Қазақ сәулет бірегейлігінің цифрлық мұрағаты",
  ru: "Цифровой архив казахской архитектурной идентичности",
} as const;

export const LOCALES = ["en", "kz", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  kz: "ҚЗ",
  ru: "РУ",
};

export const MAPBOX_STYLE = "mapbox://styles/mapbox/light-v11";
