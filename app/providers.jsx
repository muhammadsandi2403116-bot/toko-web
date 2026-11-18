"use client";

import { SessionProvider } from "next-auth/react";
import NotificationProvider from "@/components/ui/NotificationProvider";

export default function Providers({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <NotificationProvider>{children}</NotificationProvider>
    </SessionProvider>
  );
}
