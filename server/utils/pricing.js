/**
 * Calculate order totals from normalized order items.
 * @param {Array<{price: number, qty: number}>} items Order line items.
 * @returns {{itemsPrice: number, shippingPrice: number, taxPrice: number, totalPrice: number}}
 */
export const calculateOrderPrices = (items) => {
  const itemsPrice = Number(items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2));
  const shippingPrice = itemsPrice > 499 ? 0 : 49;
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
