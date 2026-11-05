"use client";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 md:px-8">
      {/* Kiri */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-gray-200 p-2 text-gray-600 lg:hidden"
          aria-label="Buka menu"
        >
          ☰
        </button>

        <div className="relative w-full max-w-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            ⌕
          </span>

          <input
            type="search"
            placeholder="Cari sesuatu..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          className="hidden rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:block"
        >
          Scan QR
        </button>

        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-lg hover:bg-gray-50"
          aria-label="Notifikasi"
        >
          ♧
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-lg hover:bg-gray-50"
          aria-label="Chat"
        >
          ▣
        </button>

        <div className="hidden h-10 w-px bg-gray-200 sm:block" />

        {/* Profil */}
        <button className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
            A
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-gray-800">
              Admin Toko
            </p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </button>
      </div>
    </header>
  );
}