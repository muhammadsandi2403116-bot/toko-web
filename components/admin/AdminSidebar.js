"use client";

const menuItems = [
  { label: "Dashboard", icon: "▦", href: "/admin" },
  { label: "Orders", icon: "▤", href: "/admin/orders" },
  { label: "Chat", icon: "▣", href: "/admin/chat" },
  { label: "Manajemen Produk", icon: "▧", href: "/admin/produk" },
  { label: "Laporan Penjualan", icon: "▥", href: "/admin/laporan" },
  { label: "WA & Pesan", icon: "◉", href: "/admin/pesan" },
  { label: "Pengaturan Toko", icon: "⚙", href: "/admin/pengaturan" },
];

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <a href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-xl font-bold text-white">
              T
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Toko Admin
              </h1>
              <p className="text-xs text-gray-400">Management Panel</p>
            </div>
          </a>

          <button
            onClick={onClose}
            className="text-gray-500 lg:hidden"
            aria-label="Tutup sidebar"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu Utama
          </p>

          {menuItems.map((item, index) => {
            const active = index === 0;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center text-lg">
                  {item.icon}
                </span>

                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-gray-100 p-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-700">
              Toko Dashboard
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Admin Panel v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}