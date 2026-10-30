
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// ==========================================
// DATA HOMEPAGE
// ==========================================

const categories = [
  {
    name: "Sembako",
    image: null, 
    // Ganti dengan path gambar jika sudah tersedia.
    //contoh
    //image: "/images/categories/sembako.png",
    placeholder: "🛒",
  },
  {
    name: "ATK",
    image: null,
    placeholder: "✏️",
  },
  {
    name: "Rokok",
    image: null,
    placeholder: "🚬",
  },
  {
    name: "Kardus",
    image: null,
    placeholder: "📦",
  },
  {
    name: "Minuman",
    image: null,
    placeholder: "🥤",
  },
  {
    name: "Makanan Ringan",
    image: null,
    placeholder: "🍪",
  },
];

const products = [
  { id: 1, name: "Nama Produk 1", category: "Sembako", icon: "🛍️" },
  { id: 2, name: "Nama Produk 2", category: "ATK", icon: "✏️" },
  { id: 3, name: "Nama Produk 3", category: "Minuman", icon: "🥤" },
  { id: 4, name: "Nama Produk 4", category: "Makanan Ringan", icon: "🍪" },
  { id: 5, name: "Nama Produk 5", category: "Sembako", icon: "🛒" },
  { id: 6, name: "Nama Produk 6", category: "Kardus", icon: "📦" },
];

const banners = [
  {
    title: "Promo Spesial",
    subtitle: "Temukan berbagai penawaran menarik",
    type: "promo",
  },
  {
    title: "Produk Unggulan",
    subtitle: "Pilihan produk terbaik untukmu",
    type: "featured",
  },
  {
    title: "Promo Menarik",
    subtitle: "Belanja lebih hemat setiap hari",
    type: "promo",
  },
  {
    title: "Koleksi Pilihan",
    subtitle: "Temukan produk favoritmu di sini",
    type: "featured",
  },
];

// ==========================================
// HERO CAROUSEL
// ==========================================

function HeroCarousel() {
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
            {getBanner(-1).type === "promo" ? "Special Offer" : "Featured"}
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

      {/* TOMBOL NAVIGASI */}
      <button
        type="button"
        onClick={previous}
        aria-label="Banner sebelumnya"
        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-neutral-100 md:left-3"
      >
        ←
      </button>

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

// ==========================================
// KATEGORI PRODUK
// ==========================================



function CategorySection() {
  const sliderRef = useRef(null);
  const isResetting = useRef(false);

  // Mengatur posisi awal slider agar berada di kategori asli
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const originalFirst = slider.children[categories.length];

    if (originalFirst) {
      slider.scrollLeft = originalFirst.offsetLeft;
    }
  }, []);

  // Menangani infinite looping
  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider || isResetting.current) return;

    const children = slider.children;
    const originalStart = children[categories.length]?.offsetLeft;
    const originalEnd = children[categories.length * 2]?.offsetLeft;

    if (originalStart === undefined || originalEnd === undefined) return;

    const originalWidth = originalEnd - originalStart;

    let newPosition = null;

    // Melewati kategori terakhir
    if (slider.scrollLeft >= originalStart + originalWidth - 1) {
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

  // Menggeser satu kategori setiap tombol ditekan
  const scrollCategories = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstItem = slider.children[0];
    const secondItem = slider.children[1];

    if (!firstItem || !secondItem) return;

    const scrollAmount = secondItem.offsetLeft - firstItem.offsetLeft;

    slider.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  // Duplikasi kategori untuk menciptakan efek looping
  const duplicatedCategories = [
    ...categories,
    ...categories,
    ...categories,
  ];

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
              href={`/produk?kategori=${encodeURIComponent(category.name)}`}
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



// ==========================================
// KARTU PRODUK
// ==========================================

function ProductCard({ product }) {
  return (
    <Link
      href={`/produk/${product.id}`}
      className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex aspect-square items-center justify-center bg-neutral-100 text-5xl transition group-hover:bg-neutral-200">
        {product.icon}
      </div>

      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-neutral-800">
          {product.name}
        </p>

        <p className="mt-1 text-xs text-neutral-500">
          {product.category}
        </p>

        <p className="mt-3 text-sm font-semibold text-neutral-800">
          Harga produk
        </p>
      </div>
    </Link>
  );
}

// ==========================================
// BAGIAN PRODUK
// ==========================================

function ProductSection({ title, data }) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800 sm:text-xl">
          {title}
        </h2>

        <Link
          href="/produk"
          className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900 sm:text-sm"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ==========================================
// FOOTER
// ==========================================

// ==========================================
// HALAMAN UTAMA
// ==========================================

export default function Home() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-4 py-8 sm:gap-12 sm:px-6 lg:px-8">

        {/* HERO */}
        <HeroCarousel />

        {/* KATEGORI */}
        <CategorySection />

        {/* PRODUK TERPOPULER */}
        <ProductSection
          title="Produk Terpopuler"
          data={products}
        />

        {/* PRODUK TERBARU */}
        <ProductSection
          title="Produk Terbaru"
          data={[...products].reverse()}
        />

        {/* PRODUK TERLARIS */}
        <ProductSection
          title="Produk Terlaris"
          data={products.slice(2).concat(products.slice(0, 2))}
        />

      </main>
    </>
  );
}
