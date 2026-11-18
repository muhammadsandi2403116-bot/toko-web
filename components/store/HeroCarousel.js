"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { animate } from "animejs";
import { banners } from "@/data/banners";

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const panelsRef = useRef(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const panels = panelsRef.current?.querySelectorAll(
      "[data-carousel-panel]"
    );

    if (panels?.length) {
      animate(panels, {
        opacity: [0, 1],
        y: [10, 0],
        duration: 340,
        ease: "outCubic",
      });
    }
  }, [active]);

  if (!banners.length) return null;

  const currentBanner = banners[active];
  const previousBanner = banners[
    (active - 1 + banners.length) % banners.length
  ];
  const nextBanner = banners[(active + 1) % banners.length];

  const previous = () => {
    setActive((current) =>
      (current - 1 + banners.length) % banners.length
    );
  };

  const next = () => {
    setActive((current) =>
      (current + 1) % banners.length
    );
  };

  return (
    <section data-home-reveal className="relative">
      <div
        ref={panelsRef}
        className="grid grid-cols-1 items-center gap-4 md:grid-cols-[0.85fr_1.5fr_0.85fr]"
      >

        {/* PROMO KIRI */}
        <div data-carousel-panel className="relative hidden min-h-[17rem] w-full overflow-hidden rounded-xl p-5 transition-all duration-500 md:flex md:flex-col md:justify-center">
          <div className="relative mb-4 aspect-[16/9] w-full shrink-0 overflow-hidden rounded-lg">
            <Image
              src={previousBanner.image}
              alt={previousBanner.title}
              fill
              sizes="(max-width: 1024px) 20vw, 15vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* BANNER UTAMA */}
        <div data-carousel-panel className="relative aspect-[16/10] w-full overflow-hidden rounded-xl md:aspect-auto md:min-h-[24rem]">
          <Link
            href={currentBanner.href || "/produk"}
            aria-label={`Lihat produk ${currentBanner.title}`}
            className="absolute inset-0 block"
          >
            <Image
              src={currentBanner.image}
              alt={currentBanner.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain"
            />
          </Link>
        </div>

        {/* PROMO KANAN */}
        <div data-carousel-panel className="relative hidden min-h-[17rem] w-full overflow-hidden rounded-xl p-5 transition-all duration-500 md:flex md:flex-col md:justify-center">
          <div className="relative mb-4 aspect-[16/9] w-full shrink-0 overflow-hidden rounded-lg bg-white/70">
            <Image
              src={nextBanner.image}
              alt={nextBanner.title}
              fill
              sizes="(max-width: 1024px) 20vw, 15vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* TOMBOL SEBELUMNYA */}
      <button
        type="button"
        onClick={previous}
        aria-label="Banner sebelumnya"
        className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-neutral-100 md:left-3"
      >
        ←
      </button>

      {/* TOMBOL BERIKUTNYA */}
      <button
        type="button"
        onClick={next}
        aria-label="Banner berikutnya"
        className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-neutral-100 md:right-3"
      >
        →
      </button>

      {/* INDIKATOR */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.title}
            type="button"
            aria-label={`Pilih banner ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${
              active === index
                ? "w-6 bg-neutral-800"
                : "w-2.5 bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
