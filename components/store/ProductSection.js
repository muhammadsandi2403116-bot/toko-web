"use client";

import { useState } from "react";
import Link from "next/link";

import ProductCard from "@/components/store/ProductCard";

const INITIAL_PRODUCT_COUNT = 4;
const MAX_VISIBLE_PRODUCT_COUNT = 16;

export default function ProductSection({
  title,
  data,
  sortBy = "popular",
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll
    ? data.slice(0, MAX_VISIBLE_PRODUCT_COUNT)
    : data.slice(0, INITIAL_PRODUCT_COUNT);

  return (
    <section data-home-reveal>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800 sm:text-xl">
          {title}
        </h2>

        <Link
          href={`/produk?sort=${sortBy}`}
          className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900 sm:text-sm"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            data-home-stagger
          />
        ))}
      </div>

      {data.length > INITIAL_PRODUCT_COUNT && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
            className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-green-700 hover:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            {showAll ? "Tampilkan lebih sedikit" : "Tampilkan lebih banyak"}
          </button>
        </div>
      )}
    </section>
  );
}