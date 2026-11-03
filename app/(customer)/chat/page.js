
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ChatAdminPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "admin",
      text: "Halo! Selamat datang di Toko Barokah 👋",
      time: "09:00",
    },
    {
      id: 2,
      sender: "admin",
      text: "Ada yang bisa kami bantu? Silakan tanyakan mengenai produk, pesanan, atau pembayaran.",
      time: "09:00",
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: message.trim(),
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">

        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-gray-200 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
            aria-label="Kembali ke halaman utama"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">
            🏪
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">
              Admin Toko Barokah
            </h1>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm text-gray-500">
                Layanan pelanggan
              </p>
            </div>
          </div>

          <span className="hidden rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 sm:block">
            Chat Admin
          </span>
        </div>

        {/* INFO */}
        <div className="border-b border-orange-100 bg-orange-50 px-4 py-3 text-center">
          <p className="text-xs text-orange-700 sm:text-sm">
            Selamat datang di layanan pelanggan Toko Barokah.
            Kami siap membantu pertanyaanmu.
          </p>
        </div>

        {/* CHAT AREA */}
        <div className="flex h-[60vh] min-h-[400px] flex-col overflow-y-auto bg-gray-50 px-4 py-5 sm:px-6">
          <div className="mb-5 text-center">
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-500">
              Percakapan dimulai
            </span>
          </div>

          {messages.map((item) => {
            const isUser = item.sender === "user";

            return (
              <div
                key={item.id}
                className={`mb-4 flex ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm">
                    🏪
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                    isUser
                      ? "rounded-br-sm bg-orange-500 text-white"
                      : "rounded-bl-sm border border-gray-100 bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {item.text}
                  </p>

                  <p
                    className={`mt-1 text-right text-[10px] ${
                      isUser
                        ? "text-orange-100"
                        : "text-gray-400"
                    }`}
                  >
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-200 bg-white p-4 sm:p-5"
        >
          <div className="flex items-end gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Tulis pesan..."
              rows={1}
              className="max-h-32 min-h-[48px] flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />

            <button
              type="submit"
              disabled={!message.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              aria-label="Kirim pesan"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 2L11 13"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 2l-7 20-4-9-9-4 20-7z"
                />
              </svg>
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-gray-400">
            Tekan Enter untuk mengirim · Shift + Enter untuk baris baru
          </p>
        </form>

      </div>

      {/* SIMULATION NOTICE */}
      <p className="mx-auto mt-4 max-w-5xl text-center text-xs text-gray-400">
        Chat ini merupakan tampilan prototipe. Pesan belum terhubung
        dengan admin secara langsung.
      </p>
    </main>
  );
}
