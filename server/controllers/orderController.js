import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateOrderPrices } from "../utils/pricing.js";
import { getStripe } from "../utils/stripe.js";

const orderPopulate = [
  { path: "user", select: "name email" },
  { path: "items.product", select: "name slug images price stock" },
  { path: "items.seller", select: "name email" }
];

const normalizeItems = async (items) => {
  const normalized = [];

  for (const item of items) {
    const productId = item.productId || item.product;
    const product = await Product.findOne({ _id: productId, isActive: true });

    if (!product) {
      throw new ApiError(404, "One or more products were not found");
    }

    const qty = Number(item.qty);

    if (qty < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    if (product.stock < qty) {
      throw new ApiError(400, `${product.name} has only ${product.stock} units left`);
    }

    normalized.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || "",
      qty,
      price: product.price,
      seller: product.seller
    });
  }

  return normalized;
};

const decrementStock = async (order) => {
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty, sold: item.qty }
      })
    )
  );
};

const restoreStock = async (order) => {
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty, sold: -item.qty }
      })
    )
  );
};

/**
 * Create an order after verifying stock and create a Stripe PaymentIntent.
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "stripe" } = req.body;
  let orderItems = req.body.items;

  if (!orderItems?.length) {
    const cart = await Cart.findOne({ user: req.user._id });
    orderItems = cart?.items.filter((item) => !item.savedForLater) || [];
  }

  if (!orderItems.length) {
    throw new ApiError(400, "No order items provided");
  }

  const items = await normalizeItems(orderItems);
  const prices = calculateOrderPrices(items);
  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    ...prices
  });

  let clientSecret = null;
  if (paymentMethod === "stripe") {
    const stripe = getStripe();
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: "inr",
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString()
        },
        automatic_payment_methods: { enabled: true }
      });

      order.paymentResult = { stripeId: paymentIntent.id, status: paymentIntent.status };
      await order.save();
      clientSecret = paymentIntent.client_secret;
    }
  }

  res.status(201).json({ success: true, order, clientSecret });
});

/**
 * Return an order when owned by the user, seller, or admin.
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(orderPopulate);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isSeller = order.items.some((item) => item.seller._id.toString() === req.user._id.toString());

  if (!isOwner && !isSeller && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot view this order");
  }

  res.json({ success: true, order });
});

/**
 * Confirm payment and mark an order as paid.
 */
export const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot pay this order");
  }

  if (!order.isPaid) {
    const stripe = getStripe();
    let paymentStatus = req.body.status || "succeeded";
    let stripeId = req.body.stripeId || order.paymentResult?.stripeId || "";

    if (stripe && order.paymentResult?.stripeId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentResult.stripeId);
      paymentStatus = paymentIntent.status;
      stripeId = paymentIntent.id;
    }

    if (paymentStatus !== "succeeded") {
      throw new ApiError(400, `Payment is ${paymentStatus}`);
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.orderStatus = "confirmed";
    order.paymentResult = { stripeId, status: paymentStatus };
    await decrementStock(order);
  }

  await order.save();
  await Cart.findOneAndUpdate({ user: order.user }, { $pull: { items: { savedForLater: false } } });
  res.json({ success: true, order });
});

/**
 * Cancel an order when it has not been delivered.
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot cancel this order");
  }

  if (order.isDelivered || order.orderStatus === "delivered") {
    throw new ApiError(400, "Delivered orders cannot be cancelled");
  }

  if (order.isPaid && order.orderStatus !== "cancelled") {
    await restoreStock(order);
  }

  order.orderStatus = "cancelled";
  await order.save();
  res.json({ success: true, order });
});

/**
 * Return all orders for admin users.
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, paid, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status) filter.orderStatus = status;
  if (paid !== undefined) filter.isPaid = paid === "true";

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate(orderPopulate)
      .sort("-createdAt")
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Order.countDocuments(filter)
  ]);

  res.json({ success: true, orders, page: currentPage, pages: Math.ceil(total / pageSize) || 1, total });
});

/**
 * Return seller orders containing the seller's products.
 */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.seller": req.user._id }).populate(orderPopulate).sort("-createdAt");
  res.json({ success: true, orders });
});

/**
 * Update order status and tracking fields.
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  order.trackingNumber = req.body.trackingNumber ?? order.trackingNumber;

  if (order.orderStatus === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = order.deliveredAt || new Date();
  }

  await order.save();
  res.json({ success: true, order });
});
