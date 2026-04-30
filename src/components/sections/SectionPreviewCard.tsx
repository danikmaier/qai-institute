import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/config";

interface PreviewItem {
  title: string;
  subtitle?: string;
  href: string;
  image?: string;
  external?: boolean;
}

export default function SectionPreviewCard({
  items,
}: {
  items: PreviewItem[];
  locale: Locale;
}) {
  if (!items.length) {
    return (
      <div className="bg-off-white p-8 text-centre text-grey-400 text-sm">
        No entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-px">
      {items.map((item, idx) => {
        const content = (
          <div className="flex gap-4 items-start p-5 bg-white border border-grey-200 hover:border-teal group transition-colors duration-200">
            {item.image && (
              <div className="relative w-16 h-16 shrink-0 bg-grey-100 overflow-hidden">
                <Image
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder"}/image/upload/w_128,h_128,c_fill/${item.image}`}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs text-grey-400 font-medium tracking-wide">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-base leading-tight mt-1 group-hover:text-teal transition-colors truncate">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-xs text-grey-500 mt-1 truncate">{item.subtitle}</p>
              )}
            </div>
            <span className="text-grey-300 group-hover:text-teal transition-colors text-sm mt-1">
              →
            </span>
          </div>
        );

        if (item.external) {
          return (
            <a key={item.href + idx} href={item.href} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          );
        }

        return (
          <Link key={item.href + idx} href={item.href}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
