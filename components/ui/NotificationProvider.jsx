"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { animate } from "animejs";

const NotificationContext = createContext(null);

const notificationStyles = {
  success: {
    icon: "✓",
    border: "border-green-200",
    iconColor: "text-green-600",
    role: "status",
  },
  info: {
    icon: "i",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    role: "status",
  },
  warning: {
    icon: "!",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    role: "alert",
  },
  error: {
    icon: "×",
    border: "border-red-200",
    iconColor: "text-red-600",
    role: "alert",
  },
};

function NotificationToast({ notification, onDismiss, onExited }) {
  const { id, message, title, type = "info", duration = 4000, action } =
    notification;
  const style = notificationStyles[type] || notificationStyles.info;
  const toastRef = useRef(null);
  const isExiting = Boolean(notification.isExiting);

  useEffect(() => {
    const element = toastRef.current;
    if (!element) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (isExiting) onExited(id);
      return undefined;
    }

    const animation = isExiting
      ? animate(element, {
          opacity: 0,
          y: -14,
          scale: 0.98,
          duration: 220,
          ease: "inCubic",
          onComplete: () => onExited(id),
        })
      : animate(element, {
          opacity: [0, 1],
          y: [-16, 0],
          scale: [0.98, 1],
          duration: 360,
          ease: "outCubic",
        });

    return () => animation.revert();
  }, [id, isExiting, onExited]);

  useEffect(() => {
    if (isExiting || duration <= 0) return undefined;

    const timer = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [duration, id, isExiting, onDismiss]);

  const handleAction = () => {
    action?.onClick?.();
    onDismiss(id);
  };

  return (
    <div
      ref={toastRef}
      role={style.role}
      className={`pointer-events-auto flex w-full max-w-sm gap-3 rounded-xl border ${style.border} bg-white p-4 shadow-lg`}
    >
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 font-bold ${style.iconColor}`}
      >
        {style.icon}
      </span>

      <div className="min-w-0 flex-1">
        {title && (
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        )}
        <p className="text-sm text-gray-700">{message}</p>
        {action?.label && (
          <button
            type="button"
            onClick={handleAction}
            className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Tutup notifikasi"
        className="shrink-0 text-gray-400 transition hover:text-gray-700"
      >
        ×
      </button>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification harus digunakan di dalam NotificationProvider."
    );
  }

  return context;
}

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const nextId = useRef(0);

  const notify = useCallback((message, options = {}) => {
    if (!message) return null;

    const id = ++nextId.current;
    const notification =
      typeof message === "object"
        ? { ...message, id }
        : { ...options, id, message };

    setNotifications((current) => [...current, notification]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, isExiting: true }
          : notification
      )
    );
  }, []);

  const remove = useCallback((id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      <div
        aria-label="Notifikasi"
        className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[calc(100%-2rem)] flex-col items-end gap-3 sm:right-6 sm:top-6 sm:w-auto"
      >
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
            onExited={remove}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
