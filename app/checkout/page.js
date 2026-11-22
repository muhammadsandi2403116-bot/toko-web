
"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { adminWhatsAppUrl } from "@/lib/whatsapp";
import {
  getCartSummary,
  getItemPricing,
} from "@/lib/promotions";
import { useNotification } from "@/components/ui/NotificationProvider";
import { addTransaction } from "@/lib/transaction-storage";

const PAYMENT_PROVIDERS = [
  {
    label: "Bank",
    options: [
      "Bank BCA",
      "Bank Mandiri",
      "Bank BRI",
      "Bank BNI",
      "Bank BSI",
      "Bank BTN",
      "Bank CIMB Niaga",
      "Bank Danamon",
      "Bank Permata",
      "Bank Mega",
      "Bank Jago",
      "Bank Neo Commerce",
      "SeaBank",
      "Lainnya",
    ],
  },
  {
    label: "E-Wallet",
    options: ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja", "i.Saku", "Lainnya"],
  },
];

const MAX_PROOF_SIZE = 1024 * 1024;
const ALLOWED_PROOF_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File bukti pembayaran gagal dibaca."));
    reader.readAsDataURL(file);
  });
}

async function hasValidImageSignature(file) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isPng =
    bytes.length >= 8 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every(
      (value, index) => bytes[index] === value
    );
  const isJpeg = bytes.length >= 3 && bytes[0] === 255 &&
    bytes[1] === 216 && bytes[2] === 255;
  const isWebp =
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

  return isPng || isJpeg || isWebp;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { notify } = useNotification();
  const user = session?.user;
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showQris, setShowQris] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState("");
  const [senderName, setSenderName] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isValidatingProof, setIsValidatingProof] = useState(false);
  const paymentRequestRef = useRef(false);

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

      startTransition(() => {
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
        setName(user?.name || "");
        setWhatsapp(String(user?.whatsapp || ""));
      });
    } catch (error) {
      console.error("Gagal mengambil data checkout:", error);
    }

    startTransition(() => setIsLoaded(status !== "loading"));
  }, [status, user]);

  const isLoggedIn = status === "authenticated" && Boolean(user);

  const cartSummary = getCartSummary(cart);
  const totalQuantity = cartSummary.quantity;
  const totalPrice = cartSummary.total;

  useEffect(() => {
    if (!proofPreview) return undefined;
    return () => URL.revokeObjectURL(proofPreview);
  }, [proofPreview]);

  const handleConfirmOrder = () => {
    const whatsappValue = String(user?.whatsapp || whatsapp).trim();
    const normalizedWhatsapp = whatsappValue.replace(/[\s()-]/g, "");

    if (cart.length === 0) {
      notify("Keranjang kamu masih kosong.", { type: "warning" });
      return;
    }

    // Validasi data untuk pengguna yang belum login
    if (!isLoggedIn && !name.trim()) {
      notify("Silakan isi nama terlebih dahulu.", { type: "warning" });
      return;
    }

    if (!whatsappValue) {
      notify("Silakan isi nomor WhatsApp terlebih dahulu.", {
        type: "warning",
      });
      return;
    }

    if (!/^\+?\d{9,15}$/.test(normalizedWhatsapp)) {
      notify("Nomor WhatsApp tidak valid.", { type: "error" });
      return;
    }

    setShowQris(true);
  };

  const handleProofFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setProofFile(null);
      setProofPreview("");
      return;
    }

    if (!ALLOWED_PROOF_TYPES.includes(file.type)) {
      setProofFile(null);
      setProofPreview("");
      event.target.value = "";
      notify("Format bukti harus PNG, JPG, atau WebP.", { type: "error" });
      return;
    }

    if (file.size > MAX_PROOF_SIZE) {
      setProofFile(null);
      setProofPreview("");
      event.target.value = "";
      notify("Ukuran gambar bukti maksimal 1 MB.", { type: "error" });
      return;
    }

    setIsValidatingProof(true);
    try {
      if (!(await hasValidImageSignature(file))) {
        setProofFile(null);
        setProofPreview("");
        event.target.value = "";
        notify("Isi file tidak sesuai format gambar PNG, JPG, atau WebP.", {
          type: "error",
        });
        return;
      }

      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Gagal memvalidasi gambar bukti:", error);
      setProofFile(null);
      setProofPreview("");
      event.target.value = "";
      notify("Gambar bukti tidak dapat dibaca. Pilih file gambar lain.", {
        type: "error",
      });
    } finally {
      setIsValidatingProof(false);
    }
  };

  const handleSubmitPaymentDetails = async () => {
    if (paymentRequestRef.current) return;

    if (!paymentProvider) {
      notify("Pilih bank atau e-wallet yang digunakan.", {
        type: "warning",
      });
      return;
    }

    if (!senderName.trim()) {
      notify("Isi nama pengirim sesuai rekening atau e-wallet.", {
        type: "warning",
      });
      return;
    }

    if (!proofFile) {
      notify("Unggah bukti pembayaran terlebih dahulu.", {
        type: "warning",
      });
      return;
    }

    if (isValidatingProof) {
      notify("Tunggu sampai validasi gambar selesai.", { type: "info" });
      return;
    }

    paymentRequestRef.current = true;
    setIsSavingPayment(true);
    try {
      const proofData = await readFileAsDataUrl(proofFile);
      const checkoutItems = cart.map(({ id, quantity }) => ({ id, quantity }));
      const cartFingerprint = JSON.stringify(checkoutItems);
      let checkoutKey = localStorage.getItem("toko-checkout-key");
      const savedFingerprint = localStorage.getItem("toko-checkout-fingerprint");
      if (checkoutKey && savedFingerprint !== cartFingerprint) {
        localStorage.removeItem("toko-checkout-key");
        localStorage.removeItem("toko-checkout-fingerprint");
        checkoutKey = null;
      }
      if (!checkoutKey) {
        checkoutKey = crypto.randomUUID();
        localStorage.setItem("toko-checkout-key", checkoutKey);
        localStorage.setItem("toko-checkout-fingerprint", cartFingerprint);
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutKey,
          name: user?.name || name.trim(),
          whatsapp: String(user?.whatsapp || whatsapp).trim(),
          items: checkoutItems,
          paymentProvider,
          senderName: senderName.trim(),
          paymentProofName: proofFile.name,
          paymentProofData: proofData,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Pesanan gagal disimpan.");
      }

      addTransaction({
        ...result.order,
        transactionDate:
          result.order.transactionDate || new Date().toISOString(),
        paymentProvider,
        senderName: senderName.trim(),
        paymentProofName: proofFile.name,
        paymentProofData: proofData,
        paymentStatus: "SEDANG_DISIAPKAN",
      });
      localStorage.removeItem("toko-checkout-key");
      localStorage.removeItem("toko-checkout-fingerprint");
      localStorage.setItem("toko-cart", JSON.stringify([]));

      const receiptUrl = new URL(
        `/pesanan/berhasil?transactionCode=${encodeURIComponent(
          result.order.transactionCode
        )}`,
        window.location.origin
      );
      window.location.assign(receiptUrl);
    } catch (error) {
      console.error("Gagal menyimpan detail pembayaran:", error);
      notify(error.message || "Gagal menyimpan bukti pembayaran.", {
        type: "error",
        duration: 6000,
      });
    } finally {
      paymentRequestRef.current = false;
      setIsSavingPayment(false);
    }
  };

  if (!isLoaded || status === "loading") {
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
            href={adminWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 hover:text-red-600"
            aria-label="Hubungi admin melalui WhatsApp"
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

            <span className="hidden sm:inline">WhatsApp</span>
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

            {user?.whatsapp ? (
              <p className="text-gray-500">{String(user.whatsapp)}</p>
            ) : (
              <div className="mt-4">
                <label
                  htmlFor="checkout-whatsapp"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nomor WA
                </label>
                <input
                  id="checkout-whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  placeholder="Silahkan isi nomor WA anda"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
            )}
          </section>
        )}

        {/* AREA PEMBAYARAN */}
        <section className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2">
          {/* PANEL QRIS */}
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-gray-100 p-4 sm:min-h-[400px] sm:p-6">
            {showQris ? (
              <>
                <div className="relative aspect-square w-full max-w-80 overflow-hidden rounded-xl bg-white p-3 shadow-sm sm:p-4">
                  <Image
                    src="/images/Qris.png"
                    alt="Kode pembayaran QRIS Toko Barokah"
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 320px"
                    className="object-contain p-3 sm:p-4"
                    priority
                  />
                </div>

                <p className="mt-5 text-center font-semibold text-gray-700">
                  Silakan scan QRIS untuk melakukan pembayaran
                </p>
                <a
                  href="/images/Qris.png"
                  download="QRIS-Toko-Barokah.png"
                  className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Unduh QRIS
                </a>
              </>
            ) : (
              <>
                <div className="flex aspect-square w-full max-w-80 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-5">
                  <p className="text-center text-sm font-medium text-gray-400">
                    QRIS akan ditampilkan setelah konfirmasi pesanan
                  </p>
                </div>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Konfirmasi pesanan untuk menampilkan kode pembayaran.
                </p>
              </>
            )}
          </div>

          {/* PANEL RINGKASAN */}
          <div className="flex flex-col gap-5">
            {/* TOTAL */}
            <div className="rounded-2xl bg-blue-600 p-5 text-white sm:p-6">
              <p className="text-lg">Total pembayaran</p>

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
                    notify("Saat ini metode pembayaran hanya QRIS.", {
                      type: "info",
                    })
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

            {showQris && (
              <form
                id="payment-details-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmitPaymentDetails();
                }}
                className="space-y-4 rounded-xl border border-gray-200 p-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Konfirmasi pembayaran
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Pilih sumber pembayaran dan lampirkan bukti pembayaran.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="payment-provider"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Bank atau e-wallet
                  </label>
                  <select
                    id="payment-provider"
                    required
                    value={paymentProvider}
                    onChange={(event) => setPaymentProvider(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Pilih bank atau e-wallet</option>
                    {PAYMENT_PROVIDERS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((provider) => (
                          <option key={`${group.label}-${provider}`} value={provider}>
                            {provider}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="payment-sender-name"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Nama pengirim
                  </label>
                  <input
                    id="payment-sender-name"
                    type="text"
                    required
                    maxLength={100}
                    value={senderName}
                    onChange={(event) => setSenderName(event.target.value)}
                    placeholder="Nama sesuai rekening atau e-wallet"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="payment-proof"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Bukti pembayaran
                  </label>
                  <input
                    id="payment-proof"
                    type="file"
                    required
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleProofFileChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-3 file:border-0 file:bg-gray-100 file:px-3 file:py-2.5 file:font-medium"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Format PNG, JPG, atau WebP. Ukuran maksimal 1 MB.
                  </p>
                  {isValidatingProof && (
                    <p className="mt-2 text-sm text-gray-500">
                      Memvalidasi gambar...
                    </p>
                  )}
                  {proofPreview && proofFile && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg bg-gray-50 p-2">
                      <img
                        src={proofPreview}
                        alt="Pratinjau bukti pembayaran"
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {proofFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(proofFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </form>
            )}

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
                    {cart.map((item) => {
                      const pricing = getItemPricing(item);

                      return (
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
                            Diterima {pricing.quantity} · Bayar{" "}
                            {pricing.paidQuantity}
                            {pricing.bonusQuantity > 0 &&
                              ` · Bonus gratis ${pricing.bonusQuantity}`}
                          </p>
                          {pricing.promotionLabel && (
                            <p className="mt-1 text-xs font-medium text-green-700">
                              Promo {pricing.promotionLabel}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-right text-sm font-semibold">
                          {pricing.discount > 0 && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatRupiah(pricing.originalSubtotal)}
                            </p>
                          )}
                          <p>{formatRupiah(pricing.subtotal)}</p>
                        </div>
                        </div>
                      );
                    })}
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

            <button
                type="submit"
                form="payment-details-form"
                disabled={isSavingPayment || isValidatingProof}
                className="block w-full rounded-xl bg-red-600 px-5 py-4 text-center text-lg font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
                {isSavingPayment ? "Menyimpan..." : "Simpan Bukti & Lanjut"}
            </button>
            </div>
        )}
        </section>
      </div>
    </main>
  );
}
