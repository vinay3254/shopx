import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratings: stats[0] ? Number(stats[0].avg.toFixed(1)) : 0,
    numReviews: stats[0]?.count || 0
  });
};

const uploadReviewFiles = async (files = []) =>
  Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer, "shopx/reviews")));

/**
 * Create a product review after checking verified purchase status.
 */
export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId, isActive: true });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existing = await Review.findOne({ user: req.user._id, product: product._id });
  if (existing) {
    throw new ApiError(409, "You already reviewed this product");
  }

  const verified = Boolean(
    await Order.exists({
      user: req.user._id,
      isPaid: true,
      "items.product": product._id
    })
  );

  const uploadedImages = await uploadReviewFiles(req.files);
  const review = await Review.create({
    user: req.user._id,
    product: product._id,
    rating: req.body.rating,
    title: req.body.title,
    body: req.body.body,
    images: uploadedImages,
    verified
  });

  await recalculateProductRating(product._id);
  res.status(201).json({ success: true, review });
});

/**
 * Return paginated reviews for a product.
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);
  const filter = { product: req.params.productId };

  const [reviews, total] = await Promise.all([
    Review.find(filter).populate("user", "name avatar").sort("-createdAt").skip((page - 1) * limit).limit(limit),
    Review.countDocuments(filter)
  ]);

  res.json({ success: true, reviews, page, pages: Math.ceil(total / limit) || 1, total });
});

/**
 * Update a review owned by the current user.
 */
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You can only edit your own reviews");
  }

  Object.assign(review, {
    rating: req.body.rating ?? review.rating,
    title: req.body.title ?? review.title,
    body: req.body.body ?? review.body
  });

  await review.save();
  await recalculateProductRating(review.product);
  res.json({ success: true, review });
});

/**
 * Delete a review owned by the current user or by an admin.
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own reviews");
  }

  const productId = review.product;
  await review.deleteOne();
  await recalculateProductRating(productId);
  res.json({ success: true, message: "Review deleted" });
});

/**
 * Toggle a helpful vote on a review.
 */
export const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const alreadyVoted = review.helpfulBy.some((id) => id.toString() === req.user._id.toString());
  review.helpfulBy = alreadyVoted
    ? review.helpfulBy.filter((id) => id.toString() !== req.user._id.toString())
    : [...review.helpfulBy, req.user._id];
  review.helpful = review.helpfulBy.length;
  await review.save();

  res.json({ success: true, review });
});
