
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export default function ReceiptPage() {
  const [order, setOrder] = useState(null);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number || 0);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("toko-current-order");

      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    }
  }, []);

  const handleDownloadReceipt = async () => {
    if (!order) {
      alert("Data transaksi tidak ditemukan.");
      return;
    }
  
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
        const response = await fetch("/logo-toko.png");
  
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

      order.items.forEach((item) => {
        const quantity = Number(item.quantity || 1);
        const subtotal = Number(item.price || 0) * quantity;

        const productName = doc.splitTextToSize(
          item.name || "Produk",
          100
        );
  
        if (y + productName.length * 6 > 260) {
          doc.addPage();
          y = 20;
        }

        doc.text(productName, margin, y);
        doc.text(String(quantity), 135, y);
  
        doc.text(
          rupiah(subtotal),
          pageWidth - margin,
          y,
          { align: "right" }
        );
  
        y += Math.max(productName.length * 6, 8);
      });
  
      y += 5;

      doc.line(margin, y, pageWidth - margin, y);

      y += 10;

      // TOTAL
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
  
      doc.text("TOTAL PEMBAYARAN", margin, y);
  
      doc.text(
        rupiah(order.totalPrice),
        pageWidth - margin,
        y,
        { align: "right" }
      );
  
      y += 10;
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
  
      doc.text("Metode Pembayaran: QRIS", margin, y);
      y += 7;
  
      doc.text(
        "Status: Simulasi / belum diverifikasi",
        margin,
        y
      );
  
      y += 12;
  
      // QR CODE TRANSAKSI
      const qrData = JSON.stringify({
        toko: "TOKO BAROKAH",
        kodeTransaksi: order.transactionCode,
        namaPembeli: order.name,
        total: order.totalPrice,
        tanggal: order.transactionDate,
      });

      const qrImage = await QRCode.toDataURL(qrData);

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
        qrImage,
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
      alert("Gagal membuat PDF. Silakan coba kembali.");
    }
  };
 
  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600">
            Data transaksi tidak ditemukan.
          </p>

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

          <Link
            href="/bantuan"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
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
          </Link>
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
                    Pembayaran Selesai
                  </h2>

                  <p className="mt-1 text-gray-600">
                    Terima kasih telah berbelanja!
                  </p>

                  <p className="mt-1 text-xs text-green-700">
                    Status ini masih simulasi sementara.
                  </p>
                </div>
              </div>
            </section>

            {/* RINCIAN PRODUK */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                <h2 className="text-xl font-bold">
                  Rincian Produk
                </h2>
              </div>

              <div className="divide-y divide-gray-200 px-5 sm:px-6">
                {items.map((item) => (
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
                    </div>

                    {/* TOTAL PRODUK */}
                    <p className="shrink-0 text-sm font-bold sm:text-base">
                      {formatRupiah(
                        Number(item.price || 0) *
                          Number(item.quantity || 1)
                      )}
                    </p>
                  </div>
                ))}
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
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-red-100 text-3xl">
                  🏪
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
                {items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between gap-3">
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="shrink-0 font-semibold">
                        {formatRupiah(
                          Number(item.price || 0) *
                            Number(item.quantity || 1)
                        )}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.quantity || 1} × @
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-5 border-gray-200" />

              {/* SUBTOTAL */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold">
                  Sub Total
                </p>

                <p className="text-xl font-bold text-red-600">
                  {formatRupiah(order.totalPrice)}
                </p>
              </div>

              <hr className="my-5 border-dashed border-gray-300" />

              {/* QR PLACEHOLDER */}
              <div className="flex flex-col items-center py-2">
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                  <svg
                    className="h-20 w-20 text-gray-400"
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

                  <p className="mt-2 text-xs text-gray-400">
                    QR Placeholder
                  </p>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  QR Kode
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-500">
                Bukti transaksi sementara. Pembayaran belum
                diverifikasi oleh payment gateway.
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
