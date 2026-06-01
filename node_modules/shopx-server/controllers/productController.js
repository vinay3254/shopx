import mongoose from "mongoose";
import slugify from "slugify";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === "string") {
    return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
};

const buildUniqueSlug = async (name, productId = null) => {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 2;

  while (await Product.exists({ slug, _id: { $ne: productId } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const assertProductOwner = (req, product) => {
  const isAdmin = req.user.role === "admin";
  const isOwner = product.seller.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "You can only manage your own products");
  }
};

const uploadProductFiles = async (files = []) =>
  Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer, "shopx/products")));

/**
 * List active products with filters, sorting and pagination.
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort = "newest",
    page = 1,
    limit = 12,
    q
  } = req.query;

  const filter = { isActive: true };

  if (category) {
    const categoryDoc = mongoose.Types.ObjectId.isValid(category)
      ? await Category.findById(category)
      : await Category.findOne({ slug: category });
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    }
  }

  if (brand) {
    filter.brand = { $regex: brand, $options: "i" };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (rating) {
    filter.ratings = { $gte: Number(rating) };
  }

  if (q) {
    filter.$text = { $search: q };
  }

  const sortMap = {
    newest: "-createdAt",
    price_asc: "price",
    price_desc: "-price",
    rating: "-ratings",
    popular: "-sold"
  };

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 48);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("seller", "name")
      .sort(sortMap[sort] || "-createdAt")
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(filter)
  ]);

  res.json({
    success: true,
    products,
    page: currentPage,
    pages: Math.ceil(total / pageSize) || 1,
    total
  });
});

/**
 * Return featured products.
 */
export const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true }).sort("-sold").limit(12);
  res.json({ success: true, products });
});

/**
 * Search products by text query.
 */
export const searchProducts = asyncHandler(async (req, res) => {
  req.query.q = req.query.q || "";
  await getProducts(req, res);
});

/**
 * Return products owned by the current seller, or all products for admins.
 */
export const getMyProducts = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { seller: req.user._id };
  const products = await Product.find(filter).populate("category", "name slug").sort("-createdAt");
  res.json({ success: true, products });
});

/**
 * Return a product by slug with reviews.
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("category", "name slug")
    .populate("seller", "name avatar");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const reviews = await Review.find({ product: product._id }).populate("user", "name avatar").sort("-createdAt").limit(8);
  res.json({ success: true, product, reviews });
});

/**
 * Create a new seller or admin product.
 */
export const createProduct = asyncHandler(async (req, res) => {
  const uploadedImages = await uploadProductFiles(req.files);
  const bodyImages = parseJson(req.body.images, []);
  const images = [...bodyImages, ...uploadedImages].filter(Boolean);

  if (images.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  const product = await Product.create({
    ...req.body,
    slug: await buildUniqueSlug(req.body.name),
    category: req.body.category,
    seller: req.user._id,
    images,
    tags: parseTags(req.body.tags),
    specifications: parseJson(req.body.specifications, {})
  });

  res.status(201).json({ success: true, product });
});

/**
 * Update a seller or admin product.
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  assertProductOwner(req, product);
  const previousName = product.name;

  const uploadedImages = await uploadProductFiles(req.files);
  const bodyImages = parseJson(req.body.images, undefined);
  const nextImages = bodyImages ? [...bodyImages, ...uploadedImages] : [...product.images, ...uploadedImages];

  Object.assign(product, {
    ...req.body,
    images: nextImages,
    tags: req.body.tags !== undefined ? parseTags(req.body.tags) : product.tags,
    specifications: req.body.specifications !== undefined ? parseJson(req.body.specifications, {}) : product.specifications
  });

  if (req.body.name && req.body.name !== previousName) {
    product.slug = await buildUniqueSlug(req.body.name, product._id);
  }

  await product.save();
  res.json({ success: true, product });
});

/**
 * Soft-delete a seller or admin product.
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  assertProductOwner(req, product);
  product.isActive = false;
  await product.save();

  res.json({ success: true, message: "Product removed" });
});
