"use client";

import { BRAND } from "@/lib/config";
import { usePathname } from "@/i18n/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-grey-200 mt-32">
      <div className="px-10 md:px-16 py-6 flex items-center justify-between">
        <span className="text-xs tracking-[0.25em] uppercase">{BRAND}</span>
        <span className="text-xs text-grey-500 tabular-nums">© {year}</span>
      </div>
    </footer>
  );
}
