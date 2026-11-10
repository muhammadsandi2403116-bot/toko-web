"use client";

import { useState } from "react";
import Link from "next/link";
import { banners } from "@/data/banners";

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

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

  const getBanner = (offset) => {
    return banners[
      (active + offset + banners.length) % banners.length
    ];
  };

  return (
    <section className="relative">
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[0.85fr_1.5fr_0.85fr]">

        {/* PROMO KIRI */}
        <div className="relative hidden min-h-[17rem] w-full overflow-hidden rounded-xl bg-orange-100 p-5 transition-all duration-500 md:flex md:flex-col md:justify-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
            {getBanner(-1).type === "promo"
              ? "Special Offer"
              : "Featured"}
          </span>

          <h2 className="mt-2 text-2xl font-bold text-neutral-800">
            {getBanner(-1).title}
          </h2>

          <p className="mt-2 text-sm text-neutral-600">
            {getBanner(-1).subtitle}
          </p>
        </div>

        {/* BANNER UTAMA */}
        <div className="flex min-h-[24rem] w-full flex-col items-center justify-center rounded-xl bg-neutral-900 px-6 py-8 text-center text-white transition-all duration-500">
          <span className="mb-3 rounded-full bg-white/15 px-4 py-1 text-xs font-medium">
            Toko Barokah
          </span>

          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            {banners[active].title}
          </h1>

          <p className="mt-3 max-w-sm text-sm text-neutral-300 sm:text-base">
            {banners[active].subtitle}
          </p>

          <Link
            href="/produk"
            className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
          >
            Lihat Produk
          </Link>
        </div>

        {/* PROMO KANAN */}
        <div className="relative hidden min-h-[17rem] w-full overflow-hidden rounded-xl bg-blue-100 p-5 transition-all duration-500 md:flex md:flex-col md:justify-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Promo
          </span>

          <h2 className="mt-2 text-2xl font-bold text-neutral-800">
            {getBanner(1).title}
          </h2>

          <p className="mt-2 text-sm text-neutral-600">
            {getBanner(1).subtitle}
          </p>
        </div>
      </div>

      {/* TOMBOL SEBELUMNYA */}
      <button
        type="button"
        onClick={previous}
        aria-label="Banner sebelumnya"
        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-neutral-100 md:left-3"
      >
        ←
      </button>

      {/* TOMBOL BERIKUTNYA */}
      <button
        type="button"
        onClick={next}
        aria-label="Banner berikutnya"
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-neutral-100 md:right-3"
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