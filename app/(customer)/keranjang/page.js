
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function KeranjangPage() {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);

  // Membaca keranjang dari localStorage saat halaman dibuka
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("toko-cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      setCart(Array.isArray(parsedCart) ? parsedCart : []);
    } catch (error) {
      console.error("Gagal membaca keranjang:", error);
      setCart([]);
    }

    setIsLoaded(true);
  }, []);

  // Simpan keranjang dan perbarui state
  const saveCart = (updatedCart) => {
    localStorage.setItem("toko-cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Tambah atau kurangi jumlah produk
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Math.max(1, Number(item.quantity) + change),
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  // Hapus produk dari keranjang
  const removeProduct = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center text-gray-500">
          Memuat keranjang...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
          Keranjang Belanja
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mb-4 text-6xl">🛒</div>

            <h2 className="text-xl font-semibold text-gray-900">
              Keranjang kamu masih kosong
            </h2>

            <p className="mt-2 text-gray-500">
              Yuk, temukan produk yang kamu butuhkan!
            </p>

            <Link
              href="/produk"
              className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Daftar produk */}
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                >
                  {/* Gambar produk */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">
                        {item.icon || "📦"}
                      </span>
                    )}
                  </div>

                  {/* Informasi produk */}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="mt-1 font-semibold text-red-600">
                      {formatRupiah(item.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeProduct(item.id)}
                      className="mt-3 text-sm text-gray-500 transition hover:text-red-600"
                    >
                      Hapus
                    </button>
                  </div>

                  {/* Kontrol jumlah */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="w-6 text-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 transition hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Total harga produk */}
                  <div className="text-right sm:min-w-32">
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="font-bold text-gray-900">
                      {formatRupiah(
                        Number(item.price) * Number(item.quantity)
                      )}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href="/produk"
                className="inline-block text-sm font-medium text-red-600 hover:text-red-700"
              >
                ← Lanjut Belanja
              </Link>
            </div>

            {/* Ringkasan belanja */}
            <div className="h-fit rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Ringkasan Belanja
              </h2>

              <div className="mt-5 flex justify-between text-sm text-gray-600">
                <span>Total produk</span>

                <span>
                  {cart.reduce(
                    (total, item) => total + Number(item.quantity),
                    0
                  )}{" "}
                  item
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>

              <div className="my-4 border-t border-gray-200" />

              <div className="flex justify-between gap-3">
                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-lg font-bold text-red-600">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg bg-red-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-red-700"
              >
                Lanjut Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
