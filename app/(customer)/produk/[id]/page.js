
import Link from "next/link";

import Breadcrumb from "@/components/store/Breadcrumb";
import ProductDetail from "@/components/store/ProductDetail";

import { products } from "@/data/products";

export const instant = false;

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Produk tidak ditemukan
          </h1>

          <p className="mt-2 text-gray-600">
            Produk yang kamu cari tidak tersedia.
          </p>

          <Link
            href="/produk"
            className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Produk", href: "/produk" },
              { label: product.name },
            ]}
          />
        </div>

        {/* Detail Produk */}
        <ProductDetail product={product} />

      </div>
    </main>
  );
}
