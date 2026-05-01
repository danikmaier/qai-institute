import Image from "next/image";
import { useTranslations } from "next-intl";
import type { HistoryEntry } from "@/lib/content";
import type { Locale } from "@/lib/config";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder";

export default function HistoryTimeline({
  entries,
}: {
  entries: HistoryEntry[];
  locale: Locale;
}) {
  const t = useTranslations("history");

  if (!entries.length) {
    return <p className="text-grey-500 text-sm">no entries yet.</p>;
  }

  return (
    <div className="relative">
      <span className="absolute left-[3px] top-2 bottom-2 w-px bg-teal opacity-60" />

      <ul className="bullet-list space-y-16 marker:text-teal">
        {entries.map((entry) => (
          <li key={entry.slug} className="text-base">
            <p className="text-black leading-snug">
              <span className="tabular-nums text-teal">
                {entry.period_start}
                {entry.period_end ? `–${entry.period_end}` : "—"}
              </span>
              {" — "}
              <span className="text-black">{entry.title}</span>
            </p>

            {entry.description && (
              <p className="mt-3 text-sm text-grey-600 leading-[1.8] max-w-prose">
                {entry.description}
              </p>
            )}

            {entry.key_buildings && entry.key_buildings.length > 0 && (
              <p className="mt-3 text-xs text-grey-500 lowercase">
                {t("key_buildings").toLowerCase()}: {entry.key_buildings.join(", ")}
              </p>
            )}

            {entry.images && entry.images.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {entry.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-40 h-28 bg-off-white"
                  >
                    <Image
                      src={`https://res.cloudinary.com/${CLOUD}/image/upload/w_400,q_auto,f_auto/${img}`}
                      alt={`${entry.title} ${idx + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
