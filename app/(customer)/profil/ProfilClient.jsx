
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const user = session?.user;
  const [whatsapp, setWhatsapp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const whatsappValue = whatsapp ?? String(user?.whatsapp || "");

  const saveWhatsapp = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile/whatsapp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: whatsappValue }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Nomor WhatsApp gagal disimpan.");
      }

      setWhatsapp(result.whatsapp);
      setMessageType("success");
      setMessage("Nomor WhatsApp berhasil disimpan.");
      try {
        await update();
      } catch (sessionError) {
        console.error("Sesi gagal diperbarui setelah menyimpan WhatsApp:", sessionError);
        setMessage("Nomor berhasil disimpan. Muat ulang halaman untuk memperbarui sesi.");
      }
    } catch (error) {
      console.error("Gagal menyimpan nomor WhatsApp:", error);
      setMessageType("error");
      setMessage(error.message || "Nomor WhatsApp gagal disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || !user) {
    return <p className="text-gray-500">Memuat informasi akun...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Profil Saya</h1>

      <p className="mt-2 text-gray-500">
        Informasi User Website Toko barokah.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="text-sm text-gray-500">
            Nama Pengguna
          </label>
          <p className="mt-1 font-semibold">{user.name}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="mt-1 font-semibold">{user.email}</p>
        </div>

        <form onSubmit={saveWhatsapp}>
          <label
            htmlFor="profile-whatsapp"
            className="text-sm text-gray-500"
          >
            Nomor WhatsApp
          </label>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <input
              id="profile-whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              value={whatsappValue}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="shrink-0 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan Nomor"}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Masukkan 9–15 digit; spasi, tanda kurung, tanda hubung, dan awalan +
            diperbolehkan.
          </p>
          {message && (
            <p
              role={messageType === "error" ? "alert" : "status"}
              className={`mt-2 text-sm ${
                messageType === "error" ? "text-red-600" : "text-green-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <Link
        href="/profil/riwayat"
        className="mt-8 inline-block rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
      >
        Lihat Riwayat Pembelian
      </Link>
    </div>
  );
}
