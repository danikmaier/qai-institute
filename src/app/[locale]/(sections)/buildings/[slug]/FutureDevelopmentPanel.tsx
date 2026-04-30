"use client";

import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

  const fields = [
    { key: "aesthetic_notes", label: t("aesthetic_notes"), value: notes.aesthetic_notes },
    { key: "material_information", label: t("material_information"), value: notes.material_information },
    { key: "details_to_preserve", label: t("details_to_preserve"), value: notes.details_to_preserve },
    { key: "elements_to_restore", label: t("elements_to_restore"), value: notes.elements_to_restore },
    { key: "community_importance", label: t("community_importance"), value: notes.local_community_importance },
  ].filter((f) => f.value);

  if (!fields.length) return null;

  return (
    <div className="border border-teal/30 bg-teal/5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-teal/10 transition-colors"
      >
        <div>
          <span className="text-label text-teal block mb-1">Conservation</span>
          <h3 className="font-serif text-xl">{t("future_development")}</h3>
        </div>
        <span className="text-teal text-2xl ml-4 shrink-0">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-teal/20">
          {fields.map((field) => (
            <div key={field.key} className="pt-6">
              <h4 className="text-xs font-medium text-teal tracking-widest uppercase mb-3">
                {field.label}
              </h4>
              <p className="text-sm text-grey-700 leading-relaxed">{field.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
