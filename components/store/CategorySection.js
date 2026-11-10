"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { categories } from "@/data/categories";

export default function CategorySection() {
  const sliderRef = useRef(null);
  const isResetting = useRef(false);

  // Posisi awal slider
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const originalFirst = slider.children[categories.length];

    if (originalFirst) {
      slider.scrollLeft = originalFirst.offsetLeft;
    }
  }, []);

  // Infinite scrolling
  const handleScroll = () => {
    const slider = sliderRef.current;

    if (!slider || isResetting.current) return;

    const children = slider.children;

    const originalStart =
      children[categories.length]?.offsetLeft;

    const originalEnd =
      children[categories.length * 2]?.offsetLeft;

    if (
      originalStart === undefined ||
      originalEnd === undefined
    ) {
      return;
    }

    const originalWidth = originalEnd - originalStart;

    let newPosition = null;

    // Melewati kategori terakhir
    if (
      slider.scrollLeft >=
      originalStart + originalWidth - 1
    ) {
      newPosition = slider.scrollLeft - originalWidth;
    }

    // Melewati kategori pertama
    if (slider.scrollLeft < originalStart - 1) {
      newPosition = slider.scrollLeft + originalWidth;
    }

    if (newPosition !== null) {
      isResetting.current = true;

      slider.style.scrollBehavior = "auto";
      slider.scrollLeft = newPosition;

      requestAnimationFrame(() => {
        slider.style.scrollBehavior = "";
        isResetting.current = false;
      });
    }
  };

  // Menggeser kategori
  const scrollCategories = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstItem = slider.children[0];
    const secondItem = slider.children[1];

    if (!firstItem || !secondItem) return;

    const scrollAmount =
      secondItem.offsetLeft - firstItem.offsetLeft;

    slider.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  // Duplikasi kategori
  const duplicatedCategories = [
    ...categories,
    ...categories,
    ...categories,
  ];

  if (categories.length === 0) {
    return null;
  }

  return (
    <section>
      {/* JUDUL */}
      <h2 className="mb-6 text-lg font-semibold text-neutral-800 sm:text-xl">
        Kategori Produk
      </h2>

      {/* AREA SLIDER */}
      <div className="relative px-10 sm:px-12">

        {/* TOMBOL KIRI */}
        <button
          type="button"
          onClick={() => scrollCategories(-1)}
          aria-label="Kategori sebelumnya"
          className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-neutral-100"
        >
          ←
        </button>

        {/* DAFTAR KATEGORI */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
        >
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`${category.name}-${index}`}
              href={`/produk?category=${encodeURIComponent(
                category.name
              )}`}
              className="group flex shrink-0 snap-start basis-[calc((100%-1rem)/2)] cursor-pointer flex-col items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-50 hover:shadow-md sm:basis-[calc((100%-2.5rem)/3)] lg:basis-[calc((100%-5rem)/5)] 2xl:basis-[calc((100%-6.25rem)/6)]"
            >
              <div className="relative flex aspect-square w-full max-w-24 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 transition-colors duration-300 group-hover:bg-neutral-200">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                    {category.placeholder}
                  </span>
                )}
              </div>

              <span className="text-center text-sm font-medium text-neutral-700 transition-colors group-hover:text-neutral-950">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* TOMBOL KANAN */}
        <button
          type="button"
          onClick={() => scrollCategories(1)}
          aria-label="Kategori berikutnya"
          className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-neutral-100"
        >
          →
        </button>
      </div>
    </section>
  );
}