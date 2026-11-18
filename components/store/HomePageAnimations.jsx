"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function HomePageAnimations({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") return;

    const sections = document.querySelectorAll(
      "[data-home-reveal], [data-home-global-reveal]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const section = entry.target;
          observer.unobserve(section);

          animate(section, {
            opacity: [0, 1],
            y: [18, 0],
            duration: 520,
            ease: "outCubic",
          });

          const items = section.querySelectorAll("[data-home-stagger]");

          if (items.length) {
            animate(items, {
              opacity: [0, 1],
              y: [12, 0],
              delay: stagger(18, { start: 45 }),
              duration: 420,
              ease: "outCubic",
            });
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="contents">
      {children}
    </div>
  );
}
