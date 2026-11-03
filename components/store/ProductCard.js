import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/produk/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-red-300 hover:shadow-md"
    >
      {/* GAMBAR PRODUK */}
      <div className="flex aspect-square items-center justify-center bg-gray-100 p-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl">
            {product.icon || "🛍️"}
          </span>
        )}
      </div>

      {/* INFORMASI PRODUK */}
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-gray-900 transition group-hover:text-red-600">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500">
          {product.category}
        </p>

        <p className="text-base font-semibold text-red-600">
          {product.price
            ? `Rp${Number(product.price).toLocaleString("id-ID")}`
            : "Harga produk"}
        </p>
      </div>
    </Link>
  );
}