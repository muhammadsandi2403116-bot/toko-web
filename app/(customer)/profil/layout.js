
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function ProfileLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("toko-user");

    if (!savedUser) {
      router.replace("/masuk");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
      setLoaded(true);
    } catch {
      localStorage.removeItem("toko-user");
      router.replace("/masuk");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("toko-user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/masuk");
  };

  if (!loaded || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Memuat profil...</p>
      </main>
    );
  }

  const menuItems = [
    { label: "Akun Saya", href: "/profil" },
    { label: "Pesanan Saya", href: "/profil/riwayat" },
    { label: "Notifikasi", href: "/profil/notifikasi" },
    { label: "Keranjang", href: "/keranjang" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[260px_1fr]">
        {/* SIDEBAR PROFIL */}
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-2xl">
              👤
            </div>

            <div className="min-w-0">
              <p className="truncate font-bold">{user.name}</p>
              <p className="truncate text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 ${
                    isActive
                      ? "bg-red-50 font-semibold text-red-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
            >
              Keluar
            </button>
          </nav>
        </aside>

        {/* KONTEN HALAMAN PROFIL */}
        <section className="min-w-0 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
