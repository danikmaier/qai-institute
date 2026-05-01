"use client";

import { useState, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import type { Building } from "@/lib/content";
import type { Locale } from "@/lib/config";
import { useTranslations } from "next-intl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function BuildingsMap({
  buildings,
}: {
  buildings: Building[];
  locale: Locale;
}) {
  const t = useTranslations("buildings");
  const router = useRouter();
  const [selected, setSelected] = useState<Building | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 48.0,
    longitude: 66.9,
    zoom: 4.5,
  });

  const handleMarkerClick = useCallback((building: Building) => {
    setSelected(building);
    setViewport((v) => ({
      ...v,
      latitude: building.latitude,
      longitude: building.longitude,
    }));
  }, []);

  return (
    <div className="w-full h-[600px] border border-grey-300">
      <Map
        {...viewport}
        onMove={(e) => setViewport(e.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {buildings.map((building) => (
          <Marker
            key={building.slug}
            latitude={building.latitude}
            longitude={building.longitude}
            anchor="bottom"
            onClick={() => handleMarkerClick(building)}
          >
            <div className="cursor-pointer">
              <div className="w-2.5 h-2.5 bg-teal border border-white" />
            </div>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            anchor="bottom"
            offset={16}
            onClose={() => setSelected(null)}
            closeButton
          >
            <div className="w-56 bg-white">
              {selected.photos?.[0] && (
                <div className="relative w-full h-28">
                  <Image
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder"}/image/upload/w_224,h_112,c_fill/${selected.photos[0]}`}
                    alt={selected.title}
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm leading-tight">{selected.title}</h3>
                <p className="mt-1 text-xs text-grey-500">
                  {selected.year_built} · {selected.architect}
                </p>
                <button
                  onClick={() => router.push(`/buildings/${selected.slug}`)}
                  className="mt-3 text-xs text-teal hover:underline underline-offset-4"
                >
                  {t("view_on_map")} →
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
