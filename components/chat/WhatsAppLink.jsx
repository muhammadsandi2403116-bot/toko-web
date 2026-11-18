import { adminWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppLink() {
  return (
    <a
      href={adminWhatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi admin melalui WhatsApp"
      data-home-global-reveal
      className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 rounded-full bg-green-600 px-5 py-4 text-white shadow-xl transition hover:bg-green-700 hover:shadow-2xl"
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.55 0 .22 5.32.22 11.87c0 2.09.55 4.13 1.59 5.93L.12 24l6.36-1.67a11.9 11.9 0 0 0 5.62 1.43h.01c6.54 0 11.87-5.33 11.87-11.88 0-3.17-1.23-6.15-3.46-8.4ZM12.1 21.74a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.77.99 1.01-3.67-.24-.38a9.82 9.82 0 0 1-1.51-5.22c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.03 2.91 9.86 9.86 0 0 1 2.9 7.03c0 5.47-4.45 9.92-9.93 9.92Zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.63-.93-2.23-.25-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.03-1.06 2.5s1.09 2.9 1.24 3.1c.15.2 2.14 3.27 5.2 4.59.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>
      <span className="font-semibold">WhatsApp</span>
    </a>
  );
}
