"use client";

import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/config";

interface Notes {
  aesthetic_notes?: string;
  material_information?: string;
  details_to_preserve?: string;
  elements_to_restore?: string;
  local_community_importance?: string;
}

export default function FutureDevelopmentPanel({
  notes,
}: {
  notes: Notes;
  locale: Locale;
}) {
  const t = useTranslations("buildings");

  const fields = [
    { key: "aesthetic_notes", label: t("aesthetic_notes"), value: notes.aesthetic_notes },
    { key: "material_information", label: t("material_information"), value: notes.material_information },
    { key: "details_to_preserve", label: t("details_to_preserve"), value: notes.details_to_preserve },
    { key: "elements_to_restore", label: t("elements_to_restore"), value: notes.elements_to_restore },
    { key: "community_importance", label: t("community_importance"), value: notes.local_community_importance },
  ].filter((f) => f.value);

  if (!fields.length) return null;

  return (
    <section>
      <h2 className="page-title">{t("future_development").toLowerCase()}</h2>

      <ul className="bullet-list mt-10 space-y-8 max-w-prose">
        {fields.map((field) => (
          <li key={field.key} className="text-base">
            <p className="text-grey-500 lowercase">{field.label}</p>
            <p className="mt-2 text-black leading-[1.7]">{field.value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
