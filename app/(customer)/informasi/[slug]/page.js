import Link from "next/link";
import { notFound } from "next/navigation";

const pages = {
  bantuan: {
    title: "Bantuan",
    description:
      "Kami siap membantu jika Anda memiliki pertanyaan tentang produk atau proses belanja di Toko Barokah.",
    sections: [
      {
        title: "Hubungi kami",
        paragraphs: [
          "Untuk bantuan pesanan, ketersediaan produk, atau pertanyaan lainnya, hubungi tim Toko Barokah melalui WhatsApp yang tercantum di bagian Hubungi Kami.",
          "Sertakan informasi yang relevan, seperti nama produk atau nomor pesanan jika tersedia, agar kami dapat membantu dengan lebih tepat.",
        ],
      },
      {
        title: "Sebelum menghubungi",
        paragraphs: [
          "Pastikan informasi pesanan yang Anda sampaikan sudah benar. Jangan mengirimkan kata sandi, PIN, atau kode verifikasi kepada siapa pun.",
        ],
      },
    ],
  },
  "pertanyaan-umum": {
    title: "Pertanyaan Umum",
    description:
      "Jawaban singkat untuk pertanyaan yang sering muncul saat berbelanja.",
    sections: [
      {
        title: "Bagaimana cara memastikan stok dan harga?",
        paragraphs: [
          "Katalog menampilkan informasi produk yang tersedia di situs. Untuk memastikan stok atau harga terbaru sebelum memesan, silakan hubungi Toko Barokah melalui WhatsApp.",
        ],
      },
      {
        title: "Bagaimana cara menanyakan pesanan?",
        paragraphs: [
          "Hubungi kami melalui WhatsApp dan sertakan nomor pesanan jika Anda sudah memilikinya.",
        ],
      },
      {
        title: "Apakah semua layanan pengiriman tersedia untuk setiap pesanan?",
        paragraphs: [
          "Pilihan pengiriman dapat bergantung pada lokasi dan pesanan. Konfirmasikan pilihan yang tersedia kepada toko sebelum menyelesaikan transaksi.",
        ],
      },
    ],
  },
  "cara-belanja": {
    title: "Cara Belanja",
    description:
      "Ikuti langkah berikut untuk berbelanja melalui situs Toko Barokah.",
    sections: [
      {
        title: "Langkah berbelanja",
        items: [
          "Jelajahi katalog dan pilih produk yang Anda butuhkan.",
          "Tambahkan produk ke keranjang, lalu periksa kembali pilihan dan jumlahnya.",
          "Lanjutkan ke proses checkout dan lengkapi informasi yang diminta.",
          "Tinjau ringkasan pesanan sebelum mengirimkan pesanan.",
          "Hubungi toko jika Anda perlu memastikan stok, pembayaran, atau pengiriman.",
        ],
      },
      {
        title: "Periksa kembali pesanan",
        paragraphs: [
          "Pastikan produk, jumlah, dan informasi kontak sudah sesuai sebelum menyelesaikan pesanan.",
        ],
      },
    ],
  },
  "tb-point": {
    title: "TB-Point",
    description:
      "Informasi mengenai program TB-Point Toko Barokah.",
    sections: [
      {
        title: "Informasi program",
        paragraphs: [
          "Ketentuan perolehan dan penggunaan TB-Point dapat berubah mengikuti informasi resmi dari Toko Barokah. Silakan konfirmasikan ketersediaan program, saldo, dan cara penukaran kepada tim toko sebelum melakukan transaksi.",
        ],
      },
    ],
  },
  "tentang-toko-barokah": {
    title: "Tentang Toko Barokah",
    description:
      "Toko Barokah membantu Anda menemukan kebutuhan sehari-hari melalui katalog belanja online.",
    sections: [
      {
        title: "Belanja lebih mudah",
        paragraphs: [
          "Situs ini menyediakan katalog produk dan fitur keranjang agar Anda dapat melihat pilihan belanja dalam satu tempat.",
          "Jika membutuhkan informasi lebih lanjut tentang produk atau pesanan, silakan hubungi kami melalui WhatsApp yang tersedia di footer.",
        ],
      },
    ],
  },
  "syarat-ketentuan": {
    title: "Syarat & Ketentuan",
    description:
      "Ketentuan umum penggunaan situs dan proses pemesanan di Toko Barokah.",
    sections: [
      {
        title: "Penggunaan situs",
        paragraphs: [
          "Gunakan situs secara wajar dan berikan informasi yang benar saat membuat pesanan. Anda bertanggung jawab untuk memeriksa kembali produk dan detail pesanan sebelum mengirimkannya.",
        ],
      },
      {
        title: "Informasi produk dan pesanan",
        paragraphs: [
          "Informasi katalog dapat diperbarui. Ketersediaan produk, total pembayaran, dan pilihan pengiriman perlu dikonfirmasi kepada toko sebelum pesanan diproses.",
          "Ketentuan pembayaran, perubahan, atau pembatalan pesanan mengikuti konfirmasi langsung dari Toko Barokah.",
        ],
      },
      {
        title: "Pembaruan ketentuan",
        paragraphs: [
          "Ketentuan pada halaman ini merupakan informasi umum dan dapat diperbarui. Untuk pertanyaan mengenai pesanan tertentu, hubungi Toko Barokah.",
        ],
      },
    ],
  },
  "kebijakan-privasi": {
    title: "Kebijakan Privasi",
    description:
      "Informasi umum mengenai privasi saat Anda menggunakan situs Toko Barokah.",
    sections: [
      {
        title: "Informasi yang Anda berikan",
        paragraphs: [
          "Saat menggunakan fitur situs atau menghubungi toko, Anda mungkin memberikan informasi yang diperlukan untuk menanggapi pertanyaan atau membantu proses pesanan.",
          "Hindari mengirimkan informasi sensitif seperti kata sandi, PIN, atau kode verifikasi melalui pesan.",
        ],
      },
      {
        title: "Penggunaan informasi",
        paragraphs: [
          "Informasi yang Anda sampaikan digunakan untuk memahami permintaan dan membantu komunikasi terkait layanan atau pesanan Anda.",
        ],
      },
      {
        title: "Pertanyaan privasi",
        paragraphs: [
          "Untuk pertanyaan mengenai informasi yang Anda sampaikan, silakan hubungi Toko Barokah melalui kontak WhatsApp yang tercantum di situs.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages[slug];

  return {
    title: page ? `${page.title} | Toko Barokah` : "Informasi | Toko Barokah",
  };
}

export default async function InformationPage({ params }) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-green-700">
          Beranda
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-neutral-700">{page.title}</span>
      </nav>

      <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
        <header className="border-b border-neutral-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Toko Barokah
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">
            {page.title}
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-neutral-600">
            {page.description}
          </p>
        </header>

        <div className="divide-y divide-neutral-100">
          {page.sections.map((section) => (
            <section key={section.title} className="py-6">
              <h2 className="text-lg font-semibold text-neutral-800">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 leading-7 text-neutral-600"
                >
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ol className="mt-3 list-inside list-decimal space-y-2 leading-7 text-neutral-600">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <Link
          href="/"
          className="mt-2 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
        >
          Kembali ke Beranda
        </Link>
      </article>
    </main>
  );
}
