import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const paymentProviders = new Set([
  "Bank BCA",
  "Bank Mandiri",
  "Bank BRI",
  "Bank BNI",
  "Bank BSI",
  "Bank BTN",
  "Bank CIMB Niaga",
  "Bank Danamon",
  "Bank Permata",
  "Bank Mega",
  "Bank Jago",
  "Bank Neo Commerce",
  "SeaBank",
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "LinkAja",
  "i.Saku",
  "Lainnya",
]);

export async function GET(_request, { params }) {
  const { transactionCode } = await params;
  const session = await auth();

  try {
    const order = await prisma.order.findUnique({
      where: { transactionCode },
    });

    if (!order || (order.userId && order.userId !== session?.user?.id)) {
      return Response.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    return Response.json({
      order: {
        transactionCode: order.transactionCode,
        transactionDate: order.createdAt,
        name: order.name,
        whatsapp: order.whatsapp,
        items: order.items,
        totalPrice: order.totalPrice,
        originalTotal: order.originalTotal,
        promotionDiscount: order.promotionDiscount,
        bonusQuantity: order.bonusQuantity,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentProvider: order.paymentProvider,
        senderName: order.senderName,
        paymentProofName: order.paymentProofName,
        paymentProofData: order.paymentProofData,
      },
    });
  } catch (error) {
    console.error("Gagal mengambil rincian pesanan:", error);
    return Response.json({ error: "Rincian pesanan gagal dimuat." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { transactionCode } = await params;
  const session = await auth();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const provider = String(body?.paymentProvider || "").trim();
  const senderName = String(body?.senderName || "").trim();
  const paymentProofData = body?.paymentProofData;
  if (
    !paymentProviders.has(provider) ||
    senderName.length < 2 ||
    senderName.length > 100 ||
    typeof paymentProofData !== "string" ||
    paymentProofData.length > 1_500_000 ||
    (body?.paymentProofName !== undefined &&
      (typeof body.paymentProofName !== "string" ||
        body.paymentProofName.length > 255))
  ) {
    return Response.json({ error: "Informasi pembayaran tidak valid." }, { status: 400 });
  }

  const proofMatch = paymentProofData.match(
    /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/
  );
  if (!proofMatch) {
    return Response.json({ error: "Format bukti pembayaran tidak valid." }, { status: 400 });
  }

  const bytes = Buffer.from(proofMatch[2], "base64");
  const isPng =
    proofMatch[1] === "png" &&
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg =
    proofMatch[1] === "jpeg" &&
    bytes.length >= 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255;
  const isWebp =
    proofMatch[1] === "webp" &&
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP";
  if (bytes.length > 1024 * 1024 || !(isPng || isJpeg || isWebp)) {
    return Response.json({ error: "Bukti harus berupa gambar PNG, JPG, atau WebP maksimal 1 MB." }, { status: 400 });
  }

  try {
    const result = await prisma.order.updateMany({
      where: {
        transactionCode,
        userId: session?.user?.id || null,
      },
      data: {
        paymentProvider: provider,
        senderName,
        paymentProofName: body.paymentProofName || null,
        paymentProofData,
        paymentStatus: "SEDANG_DISIAPKAN",
      },
    });

    if (result.count !== 1) {
      return Response.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    const order = await prisma.order.findUnique({ where: { transactionCode } });
    return Response.json({
      order: {
        transactionCode: order.transactionCode,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Gagal menyimpan detail pembayaran:", error);
    return Response.json({ error: "Detail pembayaran gagal disimpan." }, { status: 500 });
  }
}
