import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

/**
 * Return the authenticated user's profile.
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

/**
 * Update profile fields and optionally upload an avatar.
 */
export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "email"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  if (req.file) {
    req.user.avatar = await uploadBufferToCloudinary(req.file.buffer, "shopx/avatars");
  }

  await req.user.save();
  res.json({ success: true, user: req.user });
});

/**
 * Return all orders for the authenticated user.
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt").populate("items.product", "slug images");
  res.json({ success: true, orders });
});

const normalizeDefaultAddress = (user, defaultAddressId) => {
  user.addresses.forEach((address) => {
    address.isDefault = address._id.toString() === defaultAddressId?.toString();
  });
  user.defaultAddress = defaultAddressId;
};

/**
 * Add an address to the user's address book.
 */
export const addAddress = asyncHandler(async (req, res) => {
  const shouldDefault = req.body.isDefault || req.user.addresses.length === 0;
  const address = req.user.addresses.create({ ...req.body, isDefault: shouldDefault });
  req.user.addresses.push(address);

  if (shouldDefault) {
    normalizeDefaultAddress(req.user, address._id);
  }

  await req.user.save();
  res.status(201).json({ success: true, addresses: req.user.addresses, defaultAddress: req.user.defaultAddress });
});

/**
 * Update an existing address.
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.id);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  Object.assign(address, req.body);

  if (req.body.isDefault) {
    normalizeDefaultAddress(req.user, address._id);
  }

  await req.user.save();
  res.json({ success: true, addresses: req.user.addresses, defaultAddress: req.user.defaultAddress });
});

/**
 * Delete an address from the user's address book.
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.id);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  const wasDefault = req.user.defaultAddress?.toString() === address._id.toString();
  address.deleteOne();

  if (wasDefault) {
    const nextDefault = req.user.addresses[0]?._id || null;
    normalizeDefaultAddress(req.user, nextDefault);
  }

  await req.user.save();
  res.json({ success: true, addresses: req.user.addresses, defaultAddress: req.user.defaultAddress });
});

/**
 * Return the user's wishlist products.
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ success: true, wishlist: user.wishlist });
});

/**
 * Toggle a product in the wishlist.
 */
export const toggleWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  const exists = req.user.wishlist.some((id) => id.toString() === product._id.toString());
  req.user.wishlist = exists
    ? req.user.wishlist.filter((id) => id.toString() !== product._id.toString())
    : [...req.user.wishlist, product._id];

  await req.user.save();
  res.json({ success: true, wishlist: req.user.wishlist, inWishlist: !exists });
});

/**
 * Return all users for admin management.
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, q } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }];
  const users = await User.find(filter).sort("-createdAt");
  res.json({ success: true, users });
});

/**
 * Update a user's role for admin management.
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role = req.body.role;
  await user.save();
  res.json({ success: true, user });
});

/**
 * Delete a user for admin management.
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  await user.deleteOne();
  res.json({ success: true, message: "User deleted" });
});
