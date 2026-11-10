"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Akun Saya", href: "/profil" },
  { label: "Pesanan Saya", href: "/profil/riwayat" },
  { label: "Notifikasi", href: "/profil/notifikasi" },
  { label: "Keranjang", href: "/keranjang" },
];

export default function ProfileSidebar({ user }) {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 border-b pb-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-100 text-2xl">
          {user.image ? (
            <img src={user.image} alt="" className="h-full w-full object-cover" />
          ) : (
            "👤"
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate font-bold">{user.name || "Pengguna"}</p>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
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
          type="button"
          onClick={() => void signOut({ redirectTo: "/" })}
          className="w-full rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-50"
        >
          Keluar
        </button>
      </nav>
    </aside>
  );
}
