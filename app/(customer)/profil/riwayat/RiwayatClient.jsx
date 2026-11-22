"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  formatTransactionStatus,
  getTransactions,
  hasPaymentProof,
  syncRemoteTransactions,
} from "@/lib/transaction-storage";

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number || 0);
}

export default function PurchaseHistoryPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const [orders, setOrders] = useState([]);
  const [loadedForUserId, setLoadedForUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return undefined;
    if (!userId) return undefined;

    const controller = new AbortController();
    async function loadOrders() {
      try {
        const localOrders = getTransactions().filter(hasPaymentProof);
        if (localOrders.length > 0) {
          setOrders(localOrders);
        }
        const response = await fetch("/api/orders", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Riwayat pesanan gagal dimuat.");
        }
        setOrders(syncRemoteTransactions(result.orders));
        setError("");
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          console.error("Gagal memuat riwayat pembelian:", loadError);
          const localOrders = getTransactions().filter(hasPaymentProof);
          if (localOrders.length > 0) {
            setOrders(localOrders);
            setError("");
          } else {
            setError(loadError.message || "Riwayat pesanan gagal dimuat.");
          }
        }
      } finally {
        if (!controller.signal.aborted) setLoadedForUserId(userId);
      }
    }

    void loadOrders();
    return () => controller.abort();
  }, [status, userId]);

  if (status === "unauthenticated") {
    return <p className="text-gray-500">Silakan masuk untuk melihat riwayat pembelian.</p>;
  }

  if (status === "loading" || loadedForUserId !== userId || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Memuat riwayat pembelian...</p>
      </main>
    );
  }

  return (
    <div className="min-w-0">
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Riwayat Pembelian</h1>
          <p className="mt-2 text-gray-500">
            Daftar transaksi yang pernah kamu lakukan.
          </p>
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="text-5xl">🛍️</div>
            <h2 className="mt-4 text-lg font-bold">Belum ada transaksi</h2>
            <p className="mt-2 text-gray-500">
              Transaksi yang kamu lakukan akan muncul di sini.
            </p>
            <Link
              href="/produk"
              className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const date = new Date(order.transactionDate);

              return (
                <article
                  key={order.transactionCode}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-gray-50 px-5 py-4">
                    <div>
                      <p className="text-sm text-gray-500">Kode Transaksi</p>
                      <p className="font-bold">#{order.transactionCode}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                      {formatTransactionStatus(order.paymentStatus)}
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">{item.icon || "📦"}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.quantity || 1} × {formatRupiah(item.price)}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold">
                          {formatRupiah(
                            item.subtotal ??
                              Number(item.price || 0) *
                                Number(item.quantity || 1)
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Pembelian</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatRupiah(order.totalPrice)}
                      </p>
                    </div>
                    <Link
                      href={`/pesanan/berhasil?transactionCode=${encodeURIComponent(
                        order.transactionCode
                      )}`}
                      className="rounded-lg border border-red-600 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Lihat Detail Transaksi
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
