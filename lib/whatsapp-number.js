export function normalizeWhatsapp(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !/^\+?[\d\s()-]+$/.test(trimmed)) {
    return null;
  }

  const normalized = trimmed.replace(/[\s()-]/g, "");
  return /^\+?\d{9,15}$/.test(normalized) ? normalized : null;
}
