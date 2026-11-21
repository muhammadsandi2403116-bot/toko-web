import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizeWhatsapp } from "@/lib/whatsapp-number";

export async function PUT(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const whatsapp = normalizeWhatsapp(body?.whatsapp);
  if (!whatsapp) {
    return Response.json({ error: "Format nomor WhatsApp tidak valid." }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { whatsapp },
      select: { id: true, whatsapp: true },
    });

    return Response.json({ whatsapp: user.whatsapp });
  } catch (error) {
    console.error("Gagal memperbarui nomor WhatsApp profil:", error);
    return Response.json({ error: "Nomor WhatsApp gagal disimpan." }, { status: 500 });
  }
}
