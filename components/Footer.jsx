"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const [year, setYear] = useState("");

    useEffect(() => {
      const frame = requestAnimationFrame(() => {
        setYear(String(new Date().getFullYear()));
      });

      return () => cancelAnimationFrame(frame);
    }, []);

    return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:px-8">

        <div>
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Layanan Pelanggan
          </h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>Bantuan</li>
            <li>Pertanyaan Umum</li>
            <li>Cara Belanja</li>
            <li>TB-Point</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Jelajahi Toko Barokah
          </h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>Tentang Toko Barokah</li>
            <li>Syarat & Ketentuan</li>
            <li>Kebijakan Privasi</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Layanan Pengiriman
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
            {["JNE", "J&T", "SiCepat", "POS", "Anteraja", "ID Express"].map(
              (service) => (
                <span
                  key={service}
                  className="rounded border border-neutral-300 bg-white px-2 py-1"
                >
                  {service}
                </span>
              )
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Ikuti Kami
          </h3>
          <div className="flex gap-2 text-sm text-neutral-600">
            <span className="rounded border border-neutral-300 bg-white px-3 py-2">
              IG
            </span>
            <span className="rounded border border-neutral-300 bg-white px-3 py-2">
              TikTok
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Hubungi Kami
          </h3>
          <p className="text-sm text-neutral-600">
            WhatsApp
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Informasi kontak toko
          </p>
        </div>

      </div>

      <div className="border-t border-neutral-200 px-4 py-5 text-center text-xs text-neutral-500">
        © {year} Toko Barokah. All rights reserved.
      </div>
    </footer>
  );
}