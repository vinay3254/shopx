import express from "express";
import { body, param } from "express-validator";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post(
  "/add",
  [
    body("productId").isMongoId().withMessage("Valid product id is required"),
    body("qty").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1")
  ],
  validate,
  addToCart
);
router.put(
  "/item/:productId",
  [
    param("productId").isMongoId().withMessage("Valid product id is required"),
    body("qty").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("savedForLater").optional().isBoolean().withMessage("savedForLater must be boolean")
  ],
  validate,
  updateCartItem
);
router.delete("/item/:productId", [param("productId").isMongoId().withMessage("Valid product id is required")], validate, removeCartItem);
router.delete("/", clearCart);

export default router;
