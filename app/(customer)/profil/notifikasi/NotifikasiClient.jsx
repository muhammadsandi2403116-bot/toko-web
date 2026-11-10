"use client";

import { startTransition, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function NotifikasiPage() {
  const { data: session, status } = useSession();
  const currentUser = session?.user;
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [isLoaded, setIsLoaded] = useState(false);

  // Memuat notifikasi berdasarkan akun yang login
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!currentUser) {
      startTransition(() => setIsLoaded(true));
      return;
    }

    try {
      const storageKey = `toko-notifications-${currentUser.id}`;
      const savedNotifications = localStorage.getItem(storageKey);

      const loadedNotifications = savedNotifications
        ? JSON.parse(savedNotifications)
        : [];
      startTransition(() => {
        setNotifications(loadedNotifications);
        setIsLoaded(true);
      });
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
      startTransition(() => {
        setNotifications([]);
        setIsLoaded(true);
      });
    }
  }, [status, currentUser]);

  // Menyimpan notifikasi berdasarkan akun
  useEffect(() => {
    if (isLoaded && currentUser?.id) {
      localStorage.setItem(
        `toko-notifications-${currentUser.id}`,
        JSON.stringify(notifications)
      );
    }
  }, [notifications, isLoaded, currentUser]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications =
    activeFilter === "belum"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoaded) {
    return (
      <div className="py-10 text-center text-gray-500">
        Memuat notifikasi...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Notifikasi
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Informasi terbaru mengenai akun dan pesananmu.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* FILTER */}
      <div className="mb-5 flex gap-3 border-b border-neutral-200">
        <button
          onClick={() => setActiveFilter("semua")}
          className={`border-b-2 px-4 py-3 text-sm font-medium ${
            activeFilter === "semua"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-neutral-500"
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => setActiveFilter("belum")}
          className={`border-b-2 px-4 py-3 text-sm font-medium ${
            activeFilter === "belum"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-neutral-500"
          }`}
        >
          Belum dibaca

          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* DAFTAR NOTIFIKASI */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {filteredNotifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mb-3 text-4xl">🔔</div>

            <h2 className="font-semibold text-neutral-800">
              Tidak ada notifikasi
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Kamu belum memiliki notifikasi saat ini.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-4 border-b border-neutral-100 p-5 last:border-b-0 ${
                !notification.read ? "bg-blue-50/60" : "bg-white"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
                {notification.type === "order" ? "📦" : "🔔"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-neutral-900">
                    {notification.title}
                  </h2>

                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>

                <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  {formatDate(notification.date)}
                </p>

                <div className="mt-3 flex flex-wrap gap-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Tandai sudah dibaca
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-xs font-medium text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}