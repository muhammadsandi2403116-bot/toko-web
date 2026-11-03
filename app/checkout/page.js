
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showQris, setShowQris] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);

  useEffect(() => {
    try {
      // Ambil data keranjang
      const savedCart = localStorage.getItem("toko-cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      setCart(Array.isArray(parsedCart) ? parsedCart : []);

      // Cek data pengguna yang login
      const savedUser = localStorage.getItem("toko-user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setIsLoggedIn(true);
        setName(user.name || user.fullName || user.nama || "");
        setWhatsapp(
          user.whatsapp || user.phone || user.nomorWhatsapp || ""
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data checkout:", error);
    }

    setIsLoaded(true);
  }, []);

  const totalQuantity = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      alert("Keranjang kamu masih kosong.");
      return;
    }

    // Validasi data untuk pengguna yang belum login
    if (!isLoggedIn && !name.trim()) {
      alert("Silakan isi nama terlebih dahulu.");
      return;
    }

    if (!isLoggedIn && !whatsapp.trim()) {
      alert("Silakan isi nomor WhatsApp terlebih dahulu.");
      return;
    }

    if (
      !isLoggedIn &&
      !/^[0-9+]{9,15}$/.test(whatsapp.replace(/\s/g, ""))
    ) {
      alert("Nomor WhatsApp tidak valid.");
      return;
    }

    // Ambil data pengguna yang sedang login
    const savedUser = localStorage.getItem("toko-user");
    const user = savedUser ? JSON.parse(savedUser) : null;

    const transactionCode = `TRX${Date.now()}`;

    const orderData = {
      transactionCode,
      transactionDate: new Date().toISOString(),

      // Identitas akun untuk riwayat transaksi
      userId: user?.id || null,
      userEmail: user?.email || null,

      // Data pembeli
      name: user?.name || name,
      whatsapp: user?.whatsapp || whatsapp,

      // Detail transaksi
      items: cart,
      totalPrice,
      paymentMethod: "QRIS",
      paymentStatus: "SIMULASI",
    };

    // Simpan transaksi terbaru untuk halaman bukti pembelian
    localStorage.setItem(
      "toko-current-order",
      JSON.stringify(orderData)
    );

    // Simpan transaksi ke riwayat jika pengguna login
    if (user?.id) {
      const savedOrders = localStorage.getItem("toko-orders");
      const orders = savedOrders ? JSON.parse(savedOrders) : [];

      const updatedOrders = [
        orderData,
        ...orders.filter(
          (order) => order.transactionCode !== transactionCode
        ),
      ];

      localStorage.setItem(
        "toko-orders",
        JSON.stringify(updatedOrders)
      );
    }

    // Tampilkan QRIS simulasi
    setShowQris(true);
  };

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat halaman pembayaran...</p>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-xl font-bold text-gray-800">
          Keranjang kamu kosong
        </h1>

        <p className="mt-2 text-gray-500">
          Silakan pilih produk terlebih dahulu.
        </p>

        <Link
          href="/produk"
          className="mt-5 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Belanja Sekarang
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/keranjang"
            className="flex items-center gap-2 text-gray-700 transition hover:text-red-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>

            <span className="hidden sm:inline">Kembali</span>
          </Link>

          <h1 className="text-lg font-bold sm:text-2xl">
            Pembayaran
          </h1>

          <Link
            href="/bantuan"
            className="flex items-center gap-2 rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 hover:text-red-600"
            aria-label="Chat admin"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-4-.9L3 21l1.9-5.5a8.4 8.4 0 01-.9-4A8.5 8.5 0 0112.5 3h.5a8.5 8.5 0 018 8v.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01"
              />
            </svg>

            <span className="hidden sm:inline">Chat Admin</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* FORM DATA PENGGUNA */}
        {!isLoggedIn && (
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold sm:text-2xl">
              Silahkan Isi Data Berikut
            </h2>

            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label
                  htmlFor="checkout-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nama
                </label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                  <svg
                    className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                    />
                  </svg>

                  <input
                    id="checkout-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Silahkan isi nama anda"
                    className="w-full border-0 bg-transparent py-4 outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="checkout-whatsapp"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nomor WA
                </label>

                <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                  <svg
                    className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-4-.9L3 21l1.9-5.5a8.4 8.4 0 01-.9-4A8.5 8.5 0 0112.5 3h.5a8.5 8.5 0 018 8v.5z"
                    />
                  </svg>

                  <input
                    id="checkout-whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Silahkan isi nomor WA anda"
                    className="w-full border-0 bg-transparent py-4 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DATA PENGGUNA LOGIN */}
        {isLoggedIn && (
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold">Informasi Pengguna</h2>

            <p className="mt-2 text-gray-600">
              {name || "Pengguna"}
            </p>

            <p className="text-gray-500">
              {whatsapp || "Nomor WhatsApp belum tersedia"}
            </p>
          </section>
        )}

        {/* AREA PEMBAYARAN */}
        <section className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2">
          {/* PANEL QRIS */}
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-gray-100 p-6 sm:min-h-[400px]">
            {showQris ? (
              <>
                <div className="flex h-56 w-56 items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-white p-4 sm:h-64 sm:w-64">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14h2M14 19h3M19 19h2"
                      />
                    </svg>

                    <p className="mt-3 text-sm font-semibold text-gray-500">
                      QRIS akan ditampilkan di sini
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-center font-semibold text-gray-700">
                  Silakan scan QRIS untuk melakukan pembayaran
                </p>

                <p className="mt-2 text-center text-sm text-gray-500">
                  QRIS asli akan terhubung setelah integrasi payment gateway.
                </p>
              </>
            ) : (
              <>
                <div className="flex h-56 w-56 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 sm:h-64 sm:w-64">
                  <svg
                    className="h-16 w-16 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14h2M14 19h3M19 19h2"
                    />
                  </svg>

                  <p className="mt-3 text-center text-sm font-medium text-gray-400">
                    QRIS akan muncul setelah konfirmasi
                  </p>
                </div>

                <p className="mt-5 text-center text-gray-500">
                  Kode QR pembayaran belum ditampilkan
                </p>
              </>
            )}
          </div>

          {/* PANEL RINGKASAN */}
          <div className="flex flex-col gap-5">
            {/* TOTAL */}
            <div className="rounded-2xl bg-blue-600 p-5 text-white sm:p-6">
              <p className="text-lg">Total</p>

              <p className="mt-1 break-words text-3xl font-bold sm:text-4xl">
                {formatRupiah(totalPrice)}
              </p>
            </div>

            {/* METODE PEMBAYARAN */}
            <div className="border-b border-gray-200 pb-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">
                  Pilih metode pembayaran
                </p>

                <button
                  type="button"
                  className="font-semibold text-red-600"
                  onClick={() =>
                    alert("Saat ini metode pembayaran hanya QRIS.")
                  }
                >
                  Ganti
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-700">
                    QR
                  </div>

                  <span className="font-semibold">QRIS</span>
                </div>

                <span className="text-sm text-gray-500">
                  Terpilih
                </span>
              </div>
            </div>

            {/* RINGKASAN PESANAN */}
            <div className="rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setShowSummary(!showSummary)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="font-semibold">
                    Jumlah ({totalQuantity})
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {showSummary
                      ? "Sembunyikan detail produk"
                      : "Lihat produk yang dibeli"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {formatRupiah(totalPrice)}
                  </span>

                  <svg
                    className={`h-5 w-5 transition-transform ${
                      showSummary ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* PRODUK YANG DIBELI */}
              {showSummary && (
                <div className="border-t border-gray-200 px-4 py-3">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">
                              {item.icon || "📦"}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {item.quantity || 1} ×{" "}
                            {formatRupiah(item.price)}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold">
                          {formatRupiah(
                            Number(item.price || 0) *
                              Number(item.quantity || 1)
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOTAL HARGA */}
              <div className="flex items-center justify-between border-t border-gray-200 p-4">
                <span className="font-semibold">Total Harga</span>

                <span className="text-lg font-bold text-red-600">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* KONFIRMASI */}
        <section>
        {!showQris ? (
            <>
            <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full rounded-xl bg-red-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-red-700"
            >
                Konfirmasi Pesanan
            </button>

            <p className="mt-3 text-center text-sm text-gray-500">
                QRIS akan ditampilkan setelah kamu mengonfirmasi pesanan.
            </p>
            </>
        ) : (
            <div className="space-y-3">
            <div className="rounded-lg bg-green-50 p-4 text-center text-green-700">
                Pesanan berhasil dikonfirmasi!
            </div>

            <Link
                href="/pesanan/berhasil"
                onClick={() => {
                  localStorage.setItem("toko-cart", JSON.stringify([]));
                }}
                className="block w-full rounded-xl bg-red-600 px-5 py-4 text-center text-lg font-bold text-white transition hover:bg-red-700"
            >
                Lanjut
            </Link>
            </div>
        )}
        </section>
      </div>
    </main>
  );
}
