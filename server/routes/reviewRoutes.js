import express from "express";
import { body, param } from "express-validator";
import { createReview, deleteReview, getProductReviews, markHelpful, updateReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadReviewImages } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/:productId", [param("productId").isMongoId().withMessage("Valid product id is required")], validate, getProductReviews);

router.post(
  "/:productId",
  protect,
  uploadReviewImages,
  [
    param("productId").isMongoId().withMessage("Valid product id is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("title").trim().notEmpty().withMessage("Review title is required"),
    body("body").trim().notEmpty().withMessage("Review body is required")
  ],
  validate,
  createReview
);

router.put(
  "/:id",
  protect,
  [
    param("id").isMongoId().withMessage("Valid review id is required"),
    body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("title").optional().trim().notEmpty().withMessage("Review title cannot be empty"),
    body("body").optional().trim().notEmpty().withMessage("Review body cannot be empty")
  ],
  validate,
  updateReview
);

router.delete("/:id", protect, [param("id").isMongoId().withMessage("Valid review id is required")], validate, deleteReview);
router.post("/:id/helpful", protect, [param("id").isMongoId().withMessage("Valid review id is required")], validate, markHelpful);

export default router;
