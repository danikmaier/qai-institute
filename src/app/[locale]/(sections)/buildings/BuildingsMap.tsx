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
    <div className="w-full h-[600px] border border-grey-200">
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
            <div className="group cursor-pointer">
              <div className="w-3 h-3 bg-teal rounded-full border-2 border-white shadow-md group-hover:scale-150 transition-transform duration-200" />
            </div>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            anchor="bottom"
            offset={20}
            onClose={() => setSelected(null)}
            closeButton
          >
            <div className="w-56">
              {selected.photos?.[0] && (
                <div className="relative w-full h-32">
                  <Image
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder"}/image/upload/w_224,h_128,c_fill/${selected.photos[0]}`}
                    alt={selected.title}
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <h3 className="font-serif text-sm leading-tight mb-1">
                  {selected.title}
                </h3>
                <p className="text-xs text-grey-500 mb-3">
                  {selected.year_built} · {selected.architect}
                </p>
                <button
                  onClick={() => router.push(`/buildings/${selected.slug}`)}
                  className="text-xs font-medium text-teal hover:underline"
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
