import Link from "next/link";

export default function AdminPagePlaceholder({
  title,
  description = "Halaman ini sedang disiapkan.",
  href = "/admin",
  linkLabel = "Kembali ke Dashboard",
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        {linkLabel}
      </Link>
    </section>
  );
}
