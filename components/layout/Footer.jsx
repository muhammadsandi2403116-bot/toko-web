"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminWhatsAppUrl } from "@/lib/whatsapp";

const customerLinks = [
  { label: "Bantuan", slug: "bantuan" },
  { label: "Pertanyaan Umum", slug: "pertanyaan-umum" },
  { label: "Cara Belanja", slug: "cara-belanja" },
  { label: "TB-Point", slug: "tb-point" },
];

const storeLinks = [
  { label: "Tentang Toko Barokah", slug: "tentang-toko-barokah" },
  { label: "Syarat & Ketentuan", slug: "syarat-ketentuan" },
  { label: "Kebijakan Privasi", slug: "kebijakan-privasi" },
];

export default function Footer() {
    const [year, setYear] = useState("");

    useEffect(() => {
      const frame = requestAnimationFrame(() => {
        setYear(String(new Date().getFullYear()));
      });

      return () => cancelAnimationFrame(frame);
    }, []);

    return (
    <footer data-home-global-reveal className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="min-w-0">
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Layanan Pelanggan
          </h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            {customerLinks.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  href={`/informasi/${slug}`}
                  className="transition-colors hover:text-green-700"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Jelajahi Toko Barokah
          </h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            {storeLinks.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  href={`/informasi/${slug}`}
                  className="transition-colors hover:text-green-700"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Ikuti Kami
          </h3>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/um.menfess"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Toko Barokah"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-pink-300 hover:text-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <p className="space-y-2 text-sm text-neutral-600">
            Instagram
            </p>
            <a
              href="https://www.tiktok.com/@universitasnegerimalang"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Toko Barokah"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-500 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M14 4v11.2a3.5 3.5 0 1 1-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 4c.5 2.6 2 4.1 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <p className="space-y-2 text-sm text-neutral-600">
              TikTok
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Hubungi Kami
          </h3>
          <a
            href={adminWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-600 hover:text-green-700"
          >
            WhatsApp: +62 896-8155-8303
          </a>
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