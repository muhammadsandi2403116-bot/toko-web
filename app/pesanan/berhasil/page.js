
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { adminWhatsAppUrl } from "@/lib/whatsapp";
import { getCartSummary, getItemPricing } from "@/lib/promotions";
import { useNotification } from "@/components/ui/NotificationProvider";

function getTransactionQrPayload(transactionCode) {
  const transactionUrl = new URL("/pesanan/berhasil", window.location.origin);
  transactionUrl.searchParams.set("transactionCode", transactionCode);
  return transactionUrl.toString();
}

export default function ReceiptPage() {
  const { notify } = useNotification();
  const [order, setOrder] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loadError, setLoadError] = useState("");

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number || 0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadOrder() {
      try {
        const transactionCode = new URLSearchParams(window.location.search).get(
          "transactionCode"
        );
        if (!transactionCode) {
          setLoadError("Kode transaksi tidak tersedia.");
          return;
        }

        const response = await fetch(
          `/api/orders/${encodeURIComponent(transactionCode)}`,
          { cache: "no-store", signal: controller.signal }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Rincian pesanan gagal dimuat.");
        }

        setOrder(result.order);
        setPaymentProofPreview(result.order.paymentProofData || "");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Gagal mengambil data transaksi:", error);
          setLoadError(error.message || "Rincian pesanan gagal dimuat.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoaded(true);
      }
    }

    void loadOrder();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!order?.transactionCode) return undefined;

    let active = true;
    QRCode.toDataURL(getTransactionQrPayload(order.transactionCode), {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320,
    })
      .then((image) => {
        if (active) setQrImage(image);
      })
      .catch((error) => {
        console.error("Gagal membuat QR transaksi:", error);
        notify("QR transaksi gagal dibuat.", { type: "error" });
      });

    return () => {
      active = false;
    };
  }, [notify, order?.transactionCode]);

  const handleDownloadReceipt = async () => {
    if (!isLoaded) {
      notify("Data transaksi masih dimuat. Coba kembali sebentar lagi.", {
        type: "info",
      });
      return;
    }

    if (!order) {
      notify("Data transaksi tidak ditemukan.", { type: "error" });
      return;
    }

    const items = order.items || [];
    const summary = getCartSummary(items);
    const totalPrice = Number(order.totalPrice ?? summary.total);

    try {
      const doc = new jsPDF({
        unit: "mm",
        format: "a4",
      });
  
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = 15;
  
      const rupiah = (value) =>
        `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  
      const tanggal = new Date(
        order.transactionDate
      ).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      });
  
      // LOGO TOKO
      try {
        const response = await fetch("/icons/Logo.png");
  
        if (response.ok) {
          const blob = await response.blob();
  
          const logo = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
  
          doc.addImage(
            logo,
            "PNG",
            pageWidth / 2 - 12,
            y,
            24,
            24
          );
  
          y += 30;
        }
      } catch (error) {
        console.warn("Logo tidak ditemukan", error);
      }
  
      // IDENTITAS TOKO
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
  
      doc.text("TOKO BAROKAH", pageWidth / 2, y, {
        align: "center",
      });

      y += 8;
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
 
      doc.text(
        "Jl. Cakalang No.213L, Polowijen, Kec. Blimbing",
        pageWidth / 2,
        y,
        { align: "center" }
      );
  
      y += 5;
  
      doc.text(
        "Kota Malang, Jawa Timur",
        pageWidth / 2,
        y,
        { align: "center" }
      );
  
      y += 10;
 
      doc.line(margin, y, pageWidth - margin, y);
 
      y += 10;

      // JUDUL
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);

      doc.text(
        "BUKTI PEMBELIAN",
        pageWidth / 2,
        y,
        { align: "center" }
      );
  
      y += 12;
 
      // DATA TRANSAKSI
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
  
      doc.text(
        `Kode Transaksi: ${order.transactionCode || "-"}`,
        margin,
        y
      );
  
      y += 7;
  
      doc.text(`Tanggal: ${tanggal}`, margin, y);
      y += 7;
  
      doc.text(`Nama Pembeli: ${order.name || "-"}`, margin, y);
      y += 7;
  
      doc.text(`WhatsApp: ${order.whatsapp || "-"}`, margin, y);
      y += 10;

      if (order.paymentProvider) {
        doc.text(`Bank / E-Wallet: ${order.paymentProvider}`, margin, y);
        y += 7;
      }

      if (order.senderName) {
        doc.text(`Nama Pengirim: ${order.senderName}`, margin, y);
        y += 7;
      }

      doc.text(
        "Bukti pembayaran tersimpan lokal, belum diverifikasi",
        margin,
        y
      );
      y += 10;
  
      doc.line(margin, y, pageWidth - margin, y);
  
      y += 8;
  
      // HEADER PRODUK
      doc.setFont("helvetica", "bold");
 
      doc.text("Produk", margin, y);
      doc.text("Qty", 135, y);

      doc.text(
        "Subtotal",
        pageWidth - margin,
        y,
        { align: "right" }
      );

      y += 7;

      doc.line(margin, y, pageWidth - margin, y);

      y += 7;

      // DAFTAR PRODUK
      doc.setFont("helvetica", "normal");

      items.forEach((item) => {
        const quantity = Number(item.quantity || 1);
        const pricing = getItemPricing(item);
        const productDescription = [
          item.name || "Produk",
          `Diterima ${quantity}, bayar ${pricing.paidQuantity}`,
          pricing.bonusQuantity > 0
            ? `Bonus gratis ${pricing.bonusQuantity}`
            : "",
        ]
          .filter(Boolean)
          .join("\n");

        const productName = doc.splitTextToSize(
          productDescription,
          100
        );
  
        if (y + productName.length * 6 > 260) {
          doc.addPage();
          y = 20;
        }

        doc.text(productName, margin, y);
        doc.text(String(quantity), 135, y);
  
        doc.text(
          rupiah(pricing.subtotal),
          pageWidth - margin,
          y,
          { align: "right" }
        );
  
        y += Math.max(productName.length * 6, 8);
      });
  
      y += 5;

      doc.line(margin, y, pageWidth - margin, y);

      y += 10;

      // PROMO DAN TOTAL
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      if (summary.discount > 0) {
        doc.setFontSize(10);
        doc.text("Subtotal normal", margin, y);
        doc.text(
          rupiah(summary.originalSubtotal),
          pageWidth - margin,
          y,
          { align: "right" }
        );
        y += 7;

        doc.setTextColor(0, 128, 0);
        doc.text(
          `Bonus promo: ${summary.bonusQuantity} produk gratis`,
          margin,
          y
        );
        doc.text(
          `-${rupiah(summary.discount)}`,
          pageWidth - margin,
          y,
          { align: "right" }
        );
        doc.setTextColor(0, 0, 0);
        y += 8;
        doc.setFontSize(12);
      }
  
      doc.text("TOTAL PEMBAYARAN", margin, y);
  
      doc.text(
        rupiah(totalPrice),
        pageWidth - margin,
        y,
        { align: "right" }
      );
  
      y += 10;
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
  
      doc.text("Metode Pembayaran: QRIS", margin, y);
      y += 7;
  
      doc.text(`Status: ${order.paymentStatus || "Tidak tersedia"}`, margin, y);
  
      y += 12;
  
      // QR CODE TRANSAKSI
      const receiptQrImage = await QRCode.toDataURL(
        getTransactionQrPayload(order.transactionCode),
        { errorCorrectionLevel: "H", margin: 2, width: 320 }
      );

      if (y + 50 > 280) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
  
      doc.text(
        "QR CODE TRANSAKSI",
        pageWidth / 2,
        y,
        { align: "center" }
      );
  
      y += 5;
  
      doc.addImage(
        receiptQrImage,
        "PNG",
        pageWidth / 2 - 20,
        y,
        40,
        40
      );

      y += 45;
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
  
      doc.text(
        "Terima kasih telah berbelanja di Toko Barokah!",
        pageWidth / 2,
        y,
        { align: "center" }
      );
  
      // DOWNLOAD PDF
      doc.save(
        `Bukti-Pembelian-${order.transactionCode || "Toko"}.pdf`
      );
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      notify("Gagal membuat PDF. Silakan coba kembali.", {
        type: "error",
      });
    }
  };
 
  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-600">Memuat data transaksi...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600">{loadError || "Data transaksi tidak ditemukan."}</p>

          <Link
            href="/produk"
            className="mt-4 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
          >
            Kembali Belanja
          </Link>
        </div>
      </main>
    );
  }

  const items = order.items || [];
  const summary = getCartSummary(items);
  const totalPrice = Number(order.totalPrice ?? summary.total);

  const totalQuantity = items.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const transactionDate = new Date(order.transactionDate);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-red-600"
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
            Rincian Pembelian
          </h1>

          <a
            href={adminWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
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
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* GRID UTAMA */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* KOLOM KIRI */}
          <div className="space-y-6">
            {/* STATUS */}
            <section className="rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12l4 4L19 6"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-green-700 sm:text-2xl">
                    {String(order.paymentStatus || "Status tidak tersedia")
                      .split("_")
                      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                      .join(" ")}
                  </h2>

                </div>
              </div>
            </section>

            {/* INFORMASI PEMBAYARAN */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Informasi Pembayaran</h2>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">
                    Bank / E-Wallet:
                  </span>{" "}
                  {order.paymentProvider || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-800">
                    Nama Pengirim:
                  </span>{" "}
                  {order.senderName || "-"}
                </p>
              </div>
              {paymentProofPreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-800">
                    Bukti pembayaran
                  </p>
                  <a
                    href={paymentProofPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img
                      src={paymentProofPreview}
                      alt="Bukti pembayaran yang disimpan"
                      className="max-h-64 max-w-full rounded-lg border border-gray-200 object-contain"
                    />
                  </a>
                  <p className="mt-1 text-xs text-gray-500">
                    {order.paymentProofName}
                  </p>
                </div>
              )}
            </section>

            {/* RINCIAN PRODUK */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                <h2 className="text-xl font-bold">
                  Rincian Produk
                </h2>
              </div>

              <div className="divide-y divide-gray-200 px-5 sm:px-6">
                {items.map((item) => {
                  const pricing = getItemPricing(item);

                  return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-5 sm:gap-4"
                  >
                    {/* GAMBAR */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">
                          {item.icon || "📦"}
                        </span>
                      )}
                    </div>

                    {/* INFO PRODUK */}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-gray-500">
                        {formatRupiah(item.price)}
                      </p>

                      <p className="text-gray-500">
                        × {item.quantity || 1}
                      </p>
                      {pricing.bonusQuantity > 0 && (
                        <p className="mt-1 text-sm font-medium text-green-700">
                          Bonus gratis {pricing.bonusQuantity} produk
                        </p>
                      )}
                    </div>

                    {/* TOTAL PRODUK */}
                    <div className="shrink-0 text-right text-sm font-bold sm:text-base">
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
            </section>

            {/* INFORMASI PEMBELI */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">
                Informasi Pembeli
              </h2>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">
                    Nama:
                  </span>{" "}
                  {order.name || "-"}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Nomor WhatsApp:
                  </span>{" "}
                  {order.whatsapp || "-"}
                </p>
              </div>
            </section>
          </div>

          {/* KOLOM KANAN: DETAIL TRANSAKSI */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
              <h2 className="text-xl font-bold sm:text-2xl">
                Detail Transaksi
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              {/* INFORMASI TOKO */}
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center text-3xl">
                  <img
                    src="/icons/Logo.png"
                    alt="Logo Toko"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Toko Barokah
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    Jl. Cakalang No.213L, Polowijen, Kec.
                    Blimbing, Kota Malang, Jawa Timur
                  </p>
                </div>
              </div>

              <hr className="my-5 border-gray-200" />

              {/* KODE TRANSAKSI */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Kode Transaksi
                  </p>

                  <p className="break-all font-semibold">
                    #{order.transactionCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Tanggal Transaksi
                  </p>

                  <p className="font-medium">
                    {transactionDate.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    {transactionDate.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </p>
                </div>
              </div>

              <hr className="my-5 border-gray-200" />

              {/* ITEM STRUK */}
              <div className="space-y-4">
                {items.map((item) => {
                  const pricing = getItemPricing(item);

                  return (
                  <div key={item.id}>
                    <div className="flex justify-between gap-3">
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="shrink-0 font-semibold">
                        {formatRupiah(pricing.subtotal)}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Diterima {pricing.quantity} · Bayar{" "}
                      {pricing.paidQuantity}
                    </p>
                    {pricing.promotionLabel && (
                      <p className="mt-1 text-sm font-medium text-green-700">
                        Promo {pricing.promotionLabel}
                        {pricing.bonusQuantity > 0 &&
                          ` · Bonus gratis ${pricing.bonusQuantity}`}
                      </p>
                    )}
                  </div>
                  );
                })}
              </div>

              {summary.discount > 0 && (
                <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 text-sm">
                  <div className="flex justify-between gap-3 text-gray-500">
                    <span>Subtotal normal</span>
                    <span>{formatRupiah(summary.originalSubtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-3 font-medium text-green-700">
                    <span>Bonus promo ({summary.bonusQuantity} produk)</span>
                    <span>-{formatRupiah(summary.discount)}</span>
                  </div>
                </div>
              )}

              {/* SUBTOTAL */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold">
                  Sub Total
                </p>

                <p className="text-xl font-bold text-red-600">
                  {formatRupiah(totalPrice)}
                </p>
              </div>


              <hr className="my-5 border-dashed border-gray-300" />

              {/* QR PLACEHOLDER */}
              <div className="flex flex-col items-center py-2">
                <div className="flex h-52 w-52 items-center justify-center rounded-xl bg-white p-3">
                  {qrImage ? (
                    <Image
                      src={qrImage}
                      alt={`QR Code transaksi ${order.transactionCode}`}
                      width={208}
                      height={208}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">
                      Membuat QR transaksi...
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  QR Code Transaksi
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-red-700 print:hidden"
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
                d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v4h14v-4"
              />
            </svg>

            Download Bukti Pembelian
          </button>

          <Link
            href="/"
            className="block w-full rounded-xl border-2 border-red-600 px-5 py-4 text-center text-lg font-bold text-red-600 transition hover:bg-red-50 print:hidden"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
