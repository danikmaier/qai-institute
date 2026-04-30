"use client";

import { useEffect, useRef } from "react";

export default function ScrollObserver({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".animate-on-scroll").forEach((child) => {
            child.classList.add("is-visible");
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="animate-on-scroll">{children}</div>
    </div>
  );
}
