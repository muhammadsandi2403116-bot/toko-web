
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("toko-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <p className="text-gray-500">Memuat informasi akun...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Profil Saya</h1>

      <p className="mt-2 text-gray-500">
        Informasi akun Toko Barokah.
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

        <div>
          <label className="text-sm text-gray-500">
            Nomor WhatsApp
          </label>
          <p className="mt-1 font-semibold">
            {user.whatsapp || "Belum ditambahkan"}
          </p>
        </div>
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
