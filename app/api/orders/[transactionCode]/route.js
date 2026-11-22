import { auth } from "@/auth";
import { validatePaymentDetails } from "@/lib/payment-proof";
import { prisma } from "@/lib/prisma";

export async function GET(_request, { params }) {
  const { transactionCode } = await params;
  const session = await auth();

  try {
    const order = await prisma.order.findUnique({
      where: { transactionCode },
    });

    if (
      !order ||
      !order.paymentProofData ||
      (order.userId && order.userId !== session?.user?.id)
    ) {
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

  const paymentDetails = validatePaymentDetails(body);
  if (paymentDetails.error) {
    return Response.json({ error: paymentDetails.error }, { status: 400 });
  }

  try {
    const result = await prisma.order.updateMany({
      where: {
        transactionCode,
        userId: session?.user?.id || null,
      },
      data: {
        ...paymentDetails,
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
