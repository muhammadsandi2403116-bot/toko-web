
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { categories as productCategories } from "@/data/categories";

const topMenus = [
  { label: "Keranjang", icon: "cart", href: "/keranjang" },
  { label: "Chat Admin", icon: "chat", action: "open-chat" },
  { label: "Notifikasi", icon: "bell", href: "/profil/notifikasi" },
  { label: "Kunjungan", icon: "history", href: "/profil/riwayat" },
];

const categories = productCategories.map((category) => category.name);

function MenuIcon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "cart":
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <path d="M2 3h2l2.5 12h12l3-9H5" />
        </svg>
      );

    case "help":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.6 2.6 0 1 1 4.4 1.9c-1.2 1-1.9 1.4-1.9 3" />
          <path d="M12 17h.01" />
        </svg>
      );

    case "chat":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "history":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    default:
      return null;
  }
}

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { data: session, status } = useSession();
  const currentUser = session?.user ?? null;

  function handleSearch(e) {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    window.location.href = `/produk?q=${encodeURIComponent(query)}`;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white text-neutral-800 shadow-sm">
      {/* BARIS ATAS */}
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-x-2 gap-y-3 px-3 py-3 sm:gap-x-4 sm:px-5 lg:flex-nowrap lg:gap-5 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          aria-label="Beranda toko"
          className="order-1 flex h-12 w-[76px] shrink-0 flex-col items-center justify-center rounded-xl border border-neutral-300 text-sm font-semibold leading-tight transition hover:bg-neutral-50 sm:h-14 sm:w-[88px] sm:text-base"
        >
          <span>Logo</span>
          <span>Toko</span>
        </Link>

        {/* PENCARIAN */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="order-2 flex h-10 min-w-0 flex-1 items-center rounded-xl border border-neutral-300 px-1.5 transition focus-within:border-neutral-500 focus-within:ring-2 focus-within:ring-neutral-100 sm:h-11 sm:px-2 lg:order-2"
        >
          <input
            type="search"
            name="q"
            placeholder="Cari produk..."
            aria-label="Cari produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-neutral-400 sm:px-2 sm:text-base"
          />

          <button
            type="submit"
            aria-label="Cari"
            className="flex h-8 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-neutral-100 sm:w-10"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
        </form>

        {/* MENU AKUN DESKTOP */}
        <div className="order-4 ml-auto hidden shrink-0 md:flex lg:ml-0">
          {status === "loading" ? null : currentUser ? (
            <Link
              href="/profil"
              className="flex flex-col items-center gap-1 rounded-xl px-3 py-1 transition hover:bg-neutral-100"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-100">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-neutral-600">
                    {currentUser.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <span className="max-w-24 truncate text-xs font-medium">
                {currentUser.name || "Pengguna"}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 border-l border-neutral-300 pl-4 text-sm font-medium">
              <Link
                href="/daftar"
                className="rounded-md px-2 py-2 hover:text-neutral-500"
              >
                Daftar
              </Link>

              <span className="h-5 w-px bg-neutral-300" />

              <Link
                href="/masuk"
                className="rounded-md px-2 py-2 hover:text-neutral-500"
              >
                Masuk
              </Link>
            </div>
          )}
        </div>

        {/* MENU AKUN MOBILE */}
        <div className="relative order-3 shrink-0 md:hidden">
          <button
            type="button"
            aria-label="Buka menu akun"
            aria-expanded={showAccountMenu}
            aria-controls="account-menu"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 transition hover:bg-neutral-50 sm:h-11 sm:w-11"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {showAccountMenu && (
            <div
              id="account-menu"
              className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-neutral-200 bg-white p-2 text-sm font-medium shadow-lg"
            >
              {status === "loading" ? null : currentUser ? (
                <Link
                  href="/profil"
                  onClick={() => setShowAccountMenu(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-neutral-100"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-100">
                    {currentUser.image ? (
                      <img
                        src={currentUser.image}
                        alt="Foto profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-neutral-600">
                        {currentUser.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500">Profil</p>
                    <p className="truncate font-semibold">
                      {currentUser.name || "Pengguna"}
                    </p>
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    href="/daftar"
                    onClick={() => setShowAccountMenu(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                  >
                    Daftar
                  </Link>

                  <Link
                    href="/masuk"
                    onClick={() => setShowAccountMenu(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                  >
                    Masuk
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* MENU PENGGUNA */}
        <nav
          aria-label="Menu pengguna"
          className="order-4 flex w-full shrink-0 items-center justify-evenly gap-1 pb-1 md:justify-between lg:order-3 lg:w-auto lg:justify-start lg:gap-2 lg:pb-0"
        >
          {topMenus.map((menu) => {
            const menuClassName =
              "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg border border-neutral-200 px-1 py-1 transition hover:border-neutral-400 hover:bg-neutral-50 sm:px-2 lg:min-w-[58px] lg:flex-none lg:border-transparent lg:px-1";

            const menuContent = (
              <>
                <MenuIcon name={menu.icon} className="h-5 w-5" />

                <span className="text-[10px] leading-tight sm:text-[11px]">
                  {menu.label}
                </span>
              </>
            );

            // Chat Admin membuka popup
            if (menu.action === "open-chat") {
              return (
                <button
                  key={menu.label}
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new Event("open-chat-widget"));
                  }}
                  className={menuClassName}
                >
                  {menuContent}
                </button>
              );
            }

            // Menu lainnya tetap menggunakan Link
            return (
              <Link
                key={menu.label}
                href={menu.href}
                className={menuClassName}
              >
                {menuContent}
              </Link>
            );
          })}
        </nav>
      </div>

      
      {categories.length > 0 && (
        <nav
          aria-label="Kategori produk"
          className="relative border-t border-neutral-100"
        >
        <div className="relative mx-auto flex max-w-screen-2xl items-center gap-4 px-3 py-2.5 sm:gap-6 sm:px-5 lg:gap-8 lg:px-8">

          {/* DROPDOWN KATEGORI */}
          <div className="relative shrink-0">
            <button
              type="button"
              aria-expanded={showCategories}
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 whitespace-nowrap text-sm font-medium transition hover:text-neutral-500 sm:text-base"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="2" y="2" width="9" height="9" rx="2" />
                <rect x="13" y="2" width="9" height="9" rx="2" />
                <rect x="2" y="13" width="9" height="9" rx="2" />
                <rect x="13" y="13" width="9" height="9" rx="2" />
              </svg>

              Kategori

              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${
                  showCategories ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* PANEL DROPDOWN */}
            {showCategories && (
              <div className="absolute left-0 top-full z-60 mt-2.5 w-40 max-w-[calc(100vw-2rem)] rounded-b-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/produk?category=${encodeURIComponent(category)}`}
                    onClick={() => setShowCategories(false)}
                    className="flex items-center justify-between rounded-lg px-1 py-3 text-sm transition hover:bg-neutral-100"
                  >
                    <span>{category}</span>
                    <span className="text-neutral-400">›</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <span className="h-6 w-px shrink-0 bg-neutral-300" />

          {/* DAFTAR KATEGORI HORIZONTAL */}
          <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 lg:gap-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/produk?category=${encodeURIComponent(category)}`}
                className="shrink-0 whitespace-nowrap text-sm transition hover:text-neutral-500 sm:text-base"
              >
                {category}
              </Link>
            ))}
          </div>

        </div>
        </nav>
      )}

    </header>
  );
}
