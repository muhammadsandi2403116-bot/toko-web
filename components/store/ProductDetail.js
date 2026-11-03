
"use client";

import { useEffect, useState } from "react";

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({
    text: "",
    id: 0,
  });
  // Reset pesan berhasil setelah 3 detik
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage({
        text: "",
        id: 0,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [message.id]);
  const formattedPrice = `Rp${Number(product.price).toLocaleString("id-ID")}`;

  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("toko-cart") || "[]"
      );

      const existingProduct = existingCart.find(
        (item) => item.id === product.id
      );

      let updatedCart;

      if (existingProduct) {
        updatedCart = existingCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      } else {
        updatedCart = [
          ...existingCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            icon: product.icon,
            quantity,
          },
        ];
      }

      localStorage.setItem("toko-cart", JSON.stringify(updatedCart));

      setMessage({
        text: `${product.name} berhasil ditambahkan ke keranjang.`,
        id: Date.now(),
      });
    } catch (error) {
      console.error("Gagal menambahkan produk ke keranjang:", error);
      setMessage({
        text: "Terjadi kesalahan. Silakan coba lagi.",
        id: Date.now(),
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-2 md:p-8">

      {/* Gambar Produk */}
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 p-6">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-8xl">
            {product.icon || "🛍️"}
          </span>
        )}
      </div>

      {/* Informasi Produk */}
      <div className="flex flex-col">
        <p className="mb-2 text-sm font-medium text-red-600">
          {product.category}
          {product.subcategory && ` / ${product.subcategory}`}
        </p>

        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          {product.name}
        </h1>

        <p className="mt-4 text-3xl font-bold text-red-600">
          {formattedPrice}
        </p>

        <div className="my-6 border-t border-gray-200" />

        <h2 className="mb-2 font-semibold text-gray-900">
          Deskripsi Produk
        </h2>

        <p className="leading-relaxed text-gray-600">
          {product.description ||
            `${product.name} merupakan produk ${product.category.toLowerCase()} yang tersedia di Toko Barokah. Produk ini dapat dipesan melalui website dan ditambahkan ke keranjang belanja.`}
        </p>

        <div className="my-6 border-t border-gray-200" />

        {/* Jumlah Produk */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Jumlah
          </span>

          <div className="flex items-center overflow-hidden rounded-md border border-gray-300">
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
              className="px-4 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              −
            </button>

            <span className="min-w-12 text-center text-sm">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) => current + 1)
              }
              className="px-4 py-2 text-gray-700 transition hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Harga */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Total harga
          </span>

          <span className="text-lg font-semibold text-gray-900">
            Rp{(Number(product.price) * quantity).toLocaleString("id-ID")}
          </span>
        </div>

        {/* Tombol Keranjang */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-6 w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Tambah ke Keranjang
        </button>

        {message.text && (
          <p
            key={message.id}
            role="status"
            className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700"
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
