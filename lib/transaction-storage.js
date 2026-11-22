export const TRANSACTION_STORAGE_KEY = "toko-transactions";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function normalizeTransactionStatus(status) {
  const normalized = String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  if (
    normalized === "MENUNGGU_VERIFIKASI" ||
    normalized === "SIMULASI"
  ) {
    return "SEDANG_DISIAPKAN";
  }
  return normalized || "SEDANG_DISIAPKAN";
}

export function formatTransactionStatus(status) {
  return normalizeTransactionStatus(status)
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeTransaction(transaction) {
  if (!transaction) return null;
  const id =
    transaction.transactionCode ||
    transaction.id ||
    transaction.transactionCode;

  if (!id) return null;

  return {
    ...transaction,
    id: String(id),
    transactionCode: String(id),
    items: Array.isArray(transaction.items)
      ? transaction.items.map((item) => ({ ...item }))
      : [],
    totalPrice: Number(
      transaction.totalPrice ?? transaction.total ?? 0
    ),
    paymentStatus: normalizeTransactionStatus(
      transaction.paymentStatus ?? transaction.status
    ),
  };
}

export function hasPaymentProof(transaction) {
  return Boolean(transaction?.paymentProofData || transaction?.hasPaymentProof);
}

export function getTransactions() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const parsed = JSON.parse(
      storage.getItem(TRANSACTION_STORAGE_KEY) || "[]"
    );
    if (!Array.isArray(parsed)) return [];

    const byId = new Map();
    parsed.forEach((transaction) => {
      const normalized = normalizeTransaction(transaction);
      if (normalized) byId.set(normalized.transactionCode, normalized);
    });
    return Array.from(byId.values()).sort(
      (a, b) =>
        new Date(b.transactionDate || b.createdAt || 0) -
        new Date(a.transactionDate || a.createdAt || 0)
    );
  } catch (error) {
    console.error("Gagal membaca transaksi dari localStorage:", error);
    return [];
  }
}

export function saveTransactions(transactions) {
  const storage = getStorage();
  if (!storage) return;

  const byId = new Map();
  (Array.isArray(transactions) ? transactions : []).forEach((transaction) => {
    const normalized = normalizeTransaction(transaction);
    if (normalized) byId.set(normalized.transactionCode, normalized);
  });

  const saved = Array.from(byId.values());
  storage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(saved));
}

export function addTransaction(transaction) {
  const normalized = normalizeTransaction(transaction);
  if (!normalized) return null;

  const transactions = getTransactions().filter(hasPaymentProof);
  const existingIndex = transactions.findIndex(
    (item) => item.transactionCode === normalized.transactionCode
  );
  if (existingIndex >= 0) {
    transactions[existingIndex] = {
      ...transactions[existingIndex],
      ...normalized,
    };
  } else {
    transactions.push(normalized);
  }
  saveTransactions(transactions);
  return normalized;
}

export function getTransactionById(transactionCode) {
  const id = String(transactionCode || "");
  return getTransactions().find(
    (transaction) => transaction.transactionCode === id
  ) || null;
}

export function updateTransactionById(transactionCode, updates) {
  const id = String(transactionCode || "");
  const transactions = getTransactions();
  const index = transactions.findIndex(
    (transaction) => transaction.transactionCode === id
  );
  if (index < 0) return null;

  transactions[index] = normalizeTransaction({
    ...transactions[index],
    ...updates,
  });
  saveTransactions(transactions);
  return transactions[index];
}

export function deleteTransactionById(transactionCode) {
  const id = String(transactionCode || "");
  const transactions = getTransactions().filter(
    (transaction) => transaction.transactionCode !== id
  );
  saveTransactions(transactions);
}

export function syncRemoteTransactions(remoteOrders) {
  if (!Array.isArray(remoteOrders)) {
    return getTransactions().filter(hasPaymentProof);
  }

  const transactions = getTransactions().filter(hasPaymentProof);
  const byId = new Map(
    transactions.map((transaction) => [
      transaction.transactionCode,
      transaction,
    ])
  );

  remoteOrders.forEach((remoteOrder) => {
    const normalized = normalizeTransaction(remoteOrder);
    if (!normalized) return;
    const existing = byId.get(normalized.transactionCode);
    byId.set(normalized.transactionCode, {
      ...(existing || {}),
      ...normalized,
      items:
        normalized.items.length > 0 ? normalized.items : existing?.items || [],
      totalPrice:
        normalized.totalPrice ||
        existing?.totalPrice ||
        existing?.total ||
        0,
    });
  });

  const merged = Array.from(byId.values());
  saveTransactions(merged);
  return merged.sort(
    (a, b) =>
      new Date(b.transactionDate || b.createdAt || 0) -
      new Date(a.transactionDate || a.createdAt || 0)
  );
}
