import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildTree = (categories, parent = null) =>
  categories
    .filter((category) => String(category.parent || "") === String(parent || ""))
    .map((category) => ({
      ...category.toObject(),
      children: buildTree(categories, category._id)
    }));

const collectCategoryIds = (categories, rootId) => {
  const ids = [rootId];
  categories
    .filter((category) => String(category.parent || "") === String(rootId))
    .forEach((child) => {
      ids.push(...collectCategoryIds(categories, child._id));
    });
  return ids;
};

/**
 * Return the full nested category tree.
 */
export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort("level name");
  res.json({ success: true, categories: buildTree(categories) });
});

/**
 * Return products for a category slug and its children.
 */
export const getCategoryProducts = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const categories = await Category.find();
  const categoryIds = collectCategoryIds(categories, category._id);
  const products = await Product.find({ category: { $in: categoryIds }, isActive: true })
    .populate("category", "name slug")
    .sort("-createdAt");

  res.json({ success: true, category, products });
});

/**
 * Create a category.
 */
export const createCategory = asyncHandler(async (req, res) => {
  const parent = req.body.parent ? await Category.findById(req.body.parent) : null;
  const category = await Category.create({
    ...req.body,
    level: parent ? parent.level + 1 : 0
  });

  res.status(201).json({ success: true, category });
});

/**
 * Update a category.
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.json({ success: true, category });
});

/**
 * Delete a category when it has no products.
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const products = await Product.countDocuments({ category: req.params.id });

  if (products > 0) {
    throw new ApiError(400, "Cannot delete a category with products");
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.json({ success: true, message: "Category deleted" });
});
