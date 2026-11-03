"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthForm({ mode }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const isRegister = mode === "register";

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailValue = email.trim().toLowerCase();

    if (!emailValue || !password.trim()) {
      setMessage("Email dan password wajib diisi.");
      return;
    }

    const savedUsers = localStorage.getItem("toko-users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    if (isRegister) {
      if (!name.trim()) {
        setMessage("Nama wajib diisi.");
        return;
      }

      const existingUser = users.find(
        (user) => user.email === emailValue
      );

      if (existingUser) {
        setMessage("Email sudah terdaftar. Silakan login.");
        return;
      }

      const newUser = {
        id: `USER-${Date.now()}`,
        name: name.trim(),
        email: emailValue,
        password: password.trim(),
        whatsapp: "",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "toko-users",
        JSON.stringify([...users, newUser])
      );

      // Langsung login setelah registrasi
      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        whatsapp: newUser.whatsapp,
      };

      localStorage.setItem(
        "toko-user",
        JSON.stringify(sessionUser)
      );

      window.dispatchEvent(new Event("auth-change"));
      window.location.href = "/profil";
      return;
    }

    const foundUser = users.find(
      (user) =>
        user.email === emailValue &&
        user.password === password
    );

    if (!foundUser) {
      setMessage("Email atau password salah.");
      return;
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      whatsapp: foundUser.whatsapp || "",
    };

    localStorage.setItem(
      "toko-user",
      JSON.stringify(sessionUser)
    );

    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/profil";
  };

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

        <div className="mx-auto my-auto w-full max-w-md py-10">
          <h1 className="mb-7 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            {isRegister ? "Daftar Akun" : "Login Akun"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-semibold"
                >
                  Nama
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-10 w-full border-b-2 border-neutral-800 bg-transparent px-1 outline-none focus:border-neutral-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-semibold"
              >
                {isRegister ? "Email" : "Username atau Email"}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-10 w-full border-b-2 border-neutral-800 bg-transparent px-1 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-semibold"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-10 w-full border-b-2 border-neutral-800 bg-transparent px-1 outline-none focus:border-neutral-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="h-12 w-full rounded-xl border-2 border-neutral-800 text-base font-extrabold transition hover:bg-neutral-100 sm:text-lg"
              >
                {isRegister ? "Buat Akun" : "Masuk"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setMessage("Login Google tersedia setelah OAuth backend dikonfigurasi.")
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-800 text-base font-extrabold transition hover:bg-neutral-100 sm:text-lg"
              >
                <svg
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
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
            </div>
          </form>

          {message && (
            <p role="status" className="mt-4 text-center text-sm text-neutral-600">
              {message}
            </p>
          )}

          <p className="mt-5 text-center text-sm">
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
