import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const populateCart = (cart) => cart.populate("items.product", "name slug images price mrp discount stock brand ratings");

/**
 * Return the authenticated user's cart.
 */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await populateCart(await getOrCreateCart(req.user._id));
  res.json({ success: true, cart });
});

/**
 * Add an item to the cart or increase its quantity.
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findOne({ _id: productId, isActive: true });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < qty) {
    throw new ApiError(400, "Insufficient stock");
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((line) => line.product.toString() === productId);

  if (item) {
    item.qty = Math.min(item.qty + Number(qty), product.stock);
    item.savedForLater = false;
  } else {
    cart.items.push({ product: productId, qty, savedForLater: false });
  }

  await cart.save();
  res.status(201).json({ success: true, cart: await populateCart(cart) });
});

/**
 * Update cart item quantity or save-for-later state.
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((line) => line.product.toString() === req.params.productId);

  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  if (req.body.qty !== undefined) {
    const product = await Product.findById(req.params.productId);
    const qty = Number(req.body.qty);

    if (qty < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    if (product.stock < qty) {
      throw new ApiError(400, "Insufficient stock");
    }

    item.qty = qty;
  }

  if (req.body.savedForLater !== undefined) {
    item.savedForLater = Boolean(req.body.savedForLater);
  }

  await cart.save();
  res.json({ success: true, cart: await populateCart(cart) });
});

/**
 * Remove an item from the cart.
 */
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();
  res.json({ success: true, cart: await populateCart(cart) });
});

/**
 * Clear all cart items.
 */
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ success: true, cart });
});
