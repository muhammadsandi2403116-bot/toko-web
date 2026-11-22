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

export function validatePaymentDetails(body) {
  const paymentProvider = String(body?.paymentProvider || "").trim();
  const senderName = String(body?.senderName || "").trim();
  const paymentProofData = body?.paymentProofData;
  const paymentProofName = body?.paymentProofName;

  if (
    !paymentProviders.has(paymentProvider) ||
    senderName.length < 2 ||
    senderName.length > 100 ||
    typeof paymentProofData !== "string" ||
    paymentProofData.length > 1_500_000 ||
    (paymentProofName !== undefined &&
      (typeof paymentProofName !== "string" || paymentProofName.length > 255))
  ) {
    return { error: "Informasi pembayaran tidak valid." };
  }

  const proofMatch = paymentProofData.match(
    /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/
  );
  if (!proofMatch) {
    return { error: "Format bukti pembayaran tidak valid." };
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
    return {
      error: "Bukti harus berupa gambar PNG, JPG, atau WebP maksimal 1 MB.",
    };
  }

  return {
    paymentProvider,
    senderName,
    paymentProofName: paymentProofName || null,
    paymentProofData,
  };
}
