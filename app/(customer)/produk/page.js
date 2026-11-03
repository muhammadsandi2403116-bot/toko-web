
import { Suspense } from "react";
import ProductPageClient from "./ProductPageClient";

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-6">
          <p className="text-gray-500">Memuat produk...</p>
        </main>
      }
    >
      <ProductPageClient />
    </Suspense>
  );
}
