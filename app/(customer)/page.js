import HeroCarousel from "@/components/store/HeroCarousel";
import CategorySection from "@/components/store/CategorySection";
import ProductSection from "@/components/store/ProductSection";

import { products } from "@/data/products";

export default function HomePage() {
  return (
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
  );
}