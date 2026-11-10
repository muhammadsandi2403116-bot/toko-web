"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function AuthForm({ mode, callbackUrl, hasError }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const signInStarted = useRef(false);
  const isRegister = mode === "register";

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await signIn("google", {
        redirectTo: callbackUrl || "/profil",
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setMessage("Login Google gagal. Silakan coba lagi.");
      setIsLoading(false);
      signInStarted.current = false;
    }
  }, [callbackUrl]);

  useEffect(() => {
    if (signInStarted.current || hasError) {
      return;
    }

    signInStarted.current = true;
    const timer = window.setTimeout(() => {
      void handleGoogleSignIn();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [handleGoogleSignIn, hasError]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-3 py-4 text-neutral-900 sm:px-6">
      <section className="relative flex min-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col rounded-xl border-2 border-neutral-800 p-4 sm:p-6">
        <Link
          href="/"
          aria-label="Logo Toko, kembali ke beranda"
          className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-neutral-800 text-[10px] font-bold leading-tight"
        >
          <span>Logo</span>
          <span>Toko</span>
        </Link>

        <div className="mx-auto my-auto w-full max-w-md py-10 text-center">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {isRegister ? "Daftar Akun" : "Login Akun"}
          </h1>

          <p className="mb-7 text-sm text-neutral-600">
            {isLoading
              ? "Menghubungkan ke Google..."
              : "Gunakan akun Google untuk melanjutkan."}
          </p>

          <button
            type="button"
            onClick={() => void handleGoogleSignIn()}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-800 text-base font-extrabold transition hover:bg-neutral-100 disabled:cursor-wait disabled:opacity-60 sm:text-lg"
          >
            <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
              <path
                fill="#FFC107"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
              />
              <path
                fill="#1976D2"
                d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18Z"
              />
              <path
                fill="#EA4335"
                d="M24 12.1c3 0 5.6 1 7.7 3l5.8-5.8C34 6 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.2 11.4-8.2Z"
              />
            </svg>
            {isRegister ? "Daftar dengan Google" : "Login dengan Google"}
          </button>

          {(message || (hasError && "Login Google gagal. Silakan coba lagi.")) && (
            <p role="status" className="mt-4 text-sm text-red-600">
              {message || "Login Google gagal. Silakan coba lagi."}
            </p>
          )}

          <p className="mt-5 text-sm">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <Link
              href={isRegister ? "/masuk" : "/daftar"}
              className="font-bold underline underline-offset-2"
            >
              {isRegister ? "Masuk" : "Daftar"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
