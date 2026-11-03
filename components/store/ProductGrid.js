
import ProductCard from "@/components/store/ProductCard";

export default function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-60 items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
        <div className="text-center">
          <div className="mb-3 text-4xl">📦</div>

          <p className="text-lg font-semibold text-gray-700">
            Produk belum tersedia
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Belum ada produk dalam kategori ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
