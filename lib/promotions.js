export const BUY_THREE_PAY_TWO_PRODUCT_ID = 12;
export const BUY_THREE_PAY_TWO_LABEL = "Beli 3, bayar 2";

export function getItemPricing(item) {
  const requestedQuantity = Number(item.quantity ?? 1);
  const requestedPrice = Number(item.price || 0);
  const quantity =
    Number.isFinite(requestedQuantity) && requestedQuantity > 0
      ? Math.floor(requestedQuantity)
      : 1;
  const unitPrice =
    Number.isFinite(requestedPrice) && requestedPrice > 0
      ? requestedPrice
      : 0;
  const isBuyThreePayTwo =
    String(item.id) === String(BUY_THREE_PAY_TWO_PRODUCT_ID);
  const bonusQuantity = isBuyThreePayTwo
    ? Math.floor(quantity / 3)
    : 0;
  const paidQuantity = quantity - bonusQuantity;
  const originalSubtotal = unitPrice * quantity;
  const discount = unitPrice * bonusQuantity;

  return {
    quantity,
    unitPrice,
    paidQuantity,
    bonusQuantity,
    originalSubtotal,
    discount,
    subtotal: originalSubtotal - discount,
    promotionLabel: isBuyThreePayTwo ? BUY_THREE_PAY_TWO_LABEL : "",
  };
}

export function getCartSummary(items) {
  return items.reduce(
    (summary, item) => {
      const pricing = getItemPricing(item);

      summary.quantity += pricing.quantity;
      summary.bonusQuantity += pricing.bonusQuantity;
      summary.originalSubtotal += pricing.originalSubtotal;
      summary.discount += pricing.discount;
      summary.total += pricing.subtotal;

      return summary;
    },
    {
      quantity: 0,
      bonusQuantity: 0,
      originalSubtotal: 0,
      discount: 0,
      total: 0,
    }
  );
}

export function addPricingToItems(items) {
  return items.map((item) => ({
    ...item,
    ...getItemPricing(item),
  }));
}
