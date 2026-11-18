import HeroCarousel from "@/components/store/HeroCarousel";
import CategorySection from "@/components/store/CategorySection";
import ProductSection from "@/components/store/ProductSection";
import HomePageAnimations from "@/components/store/HomePageAnimations";

import { products } from "@/data/products";

const mostPopularProducts = [...products].sort(
  (a, b) => b.popularity - a.popularity
);
const newestProducts = [...products].sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);
const bestSellingProducts = [...products].sort(
  (a, b) => b.sales - a.sales
);

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-4 py-8 sm:gap-12 sm:px-6 lg:px-8">
      <HomePageAnimations>
        <HeroCarousel />
        <CategorySection />

        {products.length > 0 ? (
          <>
            <ProductSection
              title="Produk Terpopuler"
              data={mostPopularProducts}
              sortBy="popular"
            />
            <ProductSection
              title="Produk Terbaru"
              data={newestProducts}
              sortBy="newest"
            />
            <ProductSection
              title="Produk Terlaris"
              data={bestSellingProducts}
              sortBy="bestseller"
            />
          </>
        ) : (
          <section
            data-home-reveal
            className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center"
          >
            <h1 className="text-xl font-semibold text-gray-800">
              Produk belum tersedia
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Katalog akan ditampilkan setelah data produk tersedia.
            </p>
          </section>
        )}
      </HomePageAnimations>
    </main>
  );
}