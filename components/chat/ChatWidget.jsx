
"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
      text: "Ada yang bisa kami bantu?",
      time: "09:00",
    },
  ]);

  const chatEndRef = useRef(null);

  // Membuka popup dari tombol Chat di Navbar
  useEffect(() => {
    const openChat = () => {
      setIsOpen(true);
      setIsExpanded(false);
    };

    window.addEventListener("open-chat-widget", openChat);

    return () => {
      window.removeEventListener("open-chat-widget", openChat);
    };
  }, []);

  // Scroll otomatis ke pesan terbaru
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: trimmedMessage,
        time: getCurrentTime(),
      },
    ]);

    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  // Popup belum dibuka: tampilkan tombol launcher
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Buka chat admin"
        className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 rounded-full bg-orange-500 px-5 py-4 text-white shadow-xl transition hover:bg-orange-600 hover:shadow-2xl"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-.9L3 21l1.9-5.5a8.4 8.4 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z" />
        </svg>
        <span className="font-semibold">Chat Admin</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-[100] flex flex-col overflow-hidden bg-white shadow-2xl ${
        isExpanded
          ? "inset-0 rounded-none"
          : "bottom-5 right-5 h-[min(600px,calc(100vh-40px))] w-[380px] max-w-[calc(100vw-24px)] rounded-2xl"
      }`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between bg-orange-500 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-.9L3 21l1.9-5.5a8.4 8.4 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z" />
            </svg>
          </div>

          <div>
            <p className="font-semibold">Admin Toko Barokah</p>
            <p className="text-xs text-orange-100">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-300" />
              Layanan pelanggan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Minimize */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsExpanded(false);
            }}
            title="Minimize chat"
            className="rounded-lg p-2 transition hover:bg-white/20"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
            </svg>
          </button>

          {/* Expand / Restore */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            title={isExpanded ? "Perkecil chat" : "Perbesar chat"}
            className="rounded-lg p-2 transition hover:bg-white/20"
          >
            {isExpanded ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="7" y="7" width="10" height="10" rx="1" />
                <path d="M7 7 3 3m4 4V3H3m14 4 4-4m-4 0h4v4m-4 10 4 4m0-4v4h-4M7 17l-4 4m4 0H3v-4" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" />
              </svg>
            )}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            title="Tutup chat"
            className="rounded-lg p-2 transition hover:bg-white/20"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Informasi chat */}
      <div className="shrink-0 border-b bg-orange-50 px-4 py-2 text-center text-xs text-gray-500">
        Anda sedang terhubung dengan layanan pelanggan Toko Barokah
      </div>

      {/* Area pesan */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`flex ${
              item.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                item.sender === "user"
                  ? "rounded-br-sm bg-orange-500 text-white"
                  : "rounded-bl-sm border bg-white text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap break-words text-sm">
                {item.text}
              </p>
              <p
                className={`mt-1 text-right text-[10px] ${
                  item.sender === "user"
                    ? "text-orange-100"
                    : "text-gray-400"
                }`}
              >
                {item.time}
              </p>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input pesan */}
      <form
        onSubmit={handleSendMessage}
        className="shrink-0 border-t bg-white p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Ketik pesan..."
            rows={1}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            aria-label="Kirim pesan"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
