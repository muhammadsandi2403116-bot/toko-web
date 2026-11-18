import Link from "next/link";
import {
  BUY_THREE_PAY_TWO_PRODUCT_ID,
  BUY_THREE_PAY_TWO_LABEL,
} from "@/lib/promotions";

export default function ProductCard({ product, ...props }) {
  return (
    <Link
      href={`/produk/${product.id}`}
      {...props}
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
        {String(product.id) === String(BUY_THREE_PAY_TWO_PRODUCT_ID) && (
          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            Promo {BUY_THREE_PAY_TWO_LABEL}
          </span>
        )}

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