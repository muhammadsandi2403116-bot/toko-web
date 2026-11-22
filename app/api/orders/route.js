import { randomUUID } from "node:crypto";
import { auth } from "@/auth";
import { products } from "@/data/products";
import { prisma } from "@/lib/prisma";
import { addPricingToItems, getCartSummary } from "@/lib/promotions";
import { normalizeWhatsapp } from "@/lib/whatsapp-number";

const productById = new Map(products.map((product) => [String(product.id), product]));
const checkoutKeyPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function serializeOrder(order) {
  return {
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
  };
}

async function findExistingOrder(checkoutKey, userId) {
  const order = await prisma.order.findUnique({ where: { checkoutKey } });
  if (!order) {
    return null;
  }

  if (order.userId !== (userId || null)) {
    return false;
  }

  return order;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        transactionCode: true,
        createdAt: true,
        name: true,
        whatsapp: true,
        items: true,
        totalPrice: true,
        paymentMethod: true,
        paymentStatus: true,
      },
    });

    return Response.json({
      orders: orders.map(({ createdAt, ...order }) => ({
        ...order,
        transactionDate: createdAt,
      })),
    });
  } catch (error) {
    console.error("Gagal mengambil riwayat pesanan:", error);
    return Response.json({ error: "Riwayat pesanan gagal dimuat." }, { status: 500 });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  if (!checkoutKeyPattern.test(body?.checkoutKey || "")) {
    return Response.json({ error: "Identitas checkout tidak valid." }, { status: 400 });
  }

  if (!Array.isArray(body?.items) || body.items.length === 0 || body.items.length > 100) {
    return Response.json({ error: "Daftar produk tidak valid." }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id || null;
  const nameInput = String(body?.name || "").trim();
  if (nameInput.length > 191 || (!userId && !nameInput)) {
    return Response.json({ error: "Nama pembeli tidak valid." }, { status: 400 });
  }

  const whatsapp = normalizeWhatsapp(body?.whatsapp);
  if (!whatsapp) {
    return Response.json({ error: "Format nomor WhatsApp tidak valid." }, { status: 400 });
  }

  const seenProductIds = new Set();
  const items = [];
  for (const entry of body.items) {
    const id = String(entry?.id ?? "");
    const quantity = Number(entry?.quantity);
    const product = productById.get(id);
    if (
      !product ||
      seenProductIds.has(id) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return Response.json({ error: "Produk atau jumlah pesanan tidak valid." }, { status: 400 });
    }

    seenProductIds.add(id);
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image.startsWith("/") ? product.image : `/${product.image}`,
      icon: product.icon,
      quantity,
    });
  }

  const pricedItems = addPricingToItems(items);
  const summary = getCartSummary(pricedItems);

  try {
    const existing = await findExistingOrder(body.checkoutKey, userId);
    if (existing === false) {
      return Response.json({ error: "Identitas checkout tidak dapat digunakan." }, { status: 409 });
    }
    if (existing) {
      return Response.json({ order: serializeOrder(existing) });
    }

    const order = await prisma.$transaction(async (transaction) => {
      let buyerName = nameInput;
      let userEmail = null;
      let orderWhatsapp = whatsapp;

      if (userId) {
        const account = await transaction.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true, whatsapp: true },
        });
        if (!account) {
          throw new Error("Akun pengguna tidak ditemukan.");
        }
        buyerName = account.name || nameInput;
        userEmail = account.email;
        if (!buyerName) {
          throw new Error("Nama pada profil belum tersedia.");
        }

        await transaction.user.updateMany({
          where: {
            id: userId,
            OR: [{ whatsapp: null }, { whatsapp: "" }],
          },
          data: { whatsapp },
        });

        const updatedAccount = await transaction.user.findUnique({
          where: { id: userId },
          select: { whatsapp: true },
        });
        orderWhatsapp = updatedAccount.whatsapp || whatsapp;
      }

      return transaction.order.create({
        data: {
          transactionCode: `TRX-${randomUUID()}`,
          checkoutKey: body.checkoutKey,
          userId,
          userEmail,
          name: buyerName,
          whatsapp: orderWhatsapp,
          items: pricedItems,
          totalPrice: summary.total,
          originalTotal: summary.originalSubtotal,
          promotionDiscount: summary.discount,
          bonusQuantity: summary.bonusQuantity,
          paymentMethod: "QRIS",
          paymentStatus: "SEDANG_DISIAPKAN",
        },
      });
    });

    return Response.json({ order: serializeOrder(order) }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") {
      const existing = await findExistingOrder(body.checkoutKey, userId);
      if (existing && existing !== false) {
        return Response.json({ order: serializeOrder(existing) });
      }
      if (existing === false) {
        return Response.json({ error: "Identitas checkout tidak dapat digunakan." }, { status: 409 });
      }
    }

    console.error("Gagal membuat pesanan:", error);
    return Response.json({ error: "Pesanan gagal disimpan. Silakan coba kembali." }, { status: 500 });
  }
}
