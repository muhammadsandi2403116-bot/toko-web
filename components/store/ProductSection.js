import Link from "next/link";

import ProductCard from "@/components/store/ProductCard";

export default function ProductSection({ title, data }) {
  return (
    <section>
      {/* JUDUL DAN LINK */}
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

      {/* DAFTAR PRODUK */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {data.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}