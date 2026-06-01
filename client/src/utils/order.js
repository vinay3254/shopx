export const orderSteps = ["pending", "confirmed", "shipped", "delivered"];

export const statusIndex = (status) => {
  if (status === "cancelled") return -1;
  return orderSteps.indexOf(status);
};

export const deliveryEstimate = (postalCode) => {
  if (!postalCode || postalCode.length < 4) {
    return "Enter a valid pincode";
  }
  return Number(postalCode.slice(-1)) % 2 === 0 ? "Delivery by tomorrow" : "Delivery in 2-3 days";
};
