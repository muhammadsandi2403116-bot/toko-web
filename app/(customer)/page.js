import HeroCarousel from "@/components/store/HeroCarousel";
import CategorySection from "@/components/store/CategorySection";
import ProductSection from "@/components/store/ProductSection";

import { products } from "@/data/products";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-4 py-8 sm:gap-12 sm:px-6 lg:px-8">
      <HeroCarousel />
      <CategorySection />

      {products.length > 0 ? (
        <>
          <ProductSection title="Produk Terpopuler" data={products} />
          <ProductSection
            title="Produk Terbaru"
            data={[...products].reverse()}
          />
          <ProductSection title="Produk Terlaris" data={products} />
        </>
      ) : (
        <section className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Produk belum tersedia
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Katalog akan ditampilkan setelah data produk tersedia.
          </p>
        </section>
      )}
    </main>
  );
}