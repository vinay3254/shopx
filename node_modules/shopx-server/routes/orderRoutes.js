import express from "express";
import { body, param } from "express-validator";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getSellerOrders,
  payOrder,
  updateOrderStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.get("/admin/all", roleMiddleware("admin"), getAllOrders);
router.put(
  "/admin/:id/status",
  roleMiddleware("admin"),
  [
    param("id").isMongoId().withMessage("Valid order id is required"),
    body("orderStatus").optional().isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"]).withMessage("Invalid order status"),
    body("trackingNumber").optional().trim().isLength({ max: 80 }).withMessage("Tracking number is too long")
  ],
  validate,
  updateOrderStatus
);
router.get("/seller/mine", roleMiddleware("seller", "admin"), getSellerOrders);

router.post(
  "/",
  [
    body("items").optional().isArray().withMessage("Items must be an array"),
    body("items.*.productId").optional().isMongoId().withMessage("Valid product id is required"),
    body("items.*.qty").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("shippingAddress.fullName").trim().notEmpty().withMessage("Full name is required"),
    body("shippingAddress.phone").trim().notEmpty().withMessage("Phone is required"),
    body("shippingAddress.line1").trim().notEmpty().withMessage("Address line 1 is required"),
    body("shippingAddress.city").trim().notEmpty().withMessage("City is required"),
    body("shippingAddress.state").trim().notEmpty().withMessage("State is required"),
    body("shippingAddress.postalCode").trim().notEmpty().withMessage("Postal code is required"),
    body("paymentMethod").optional().isIn(["stripe", "cod"]).withMessage("Invalid payment method")
  ],
  validate,
  createOrder
);

router.get("/:id", [param("id").isMongoId().withMessage("Valid order id is required")], validate, getOrderById);
router.post(
  "/:id/pay",
  [
    param("id").isMongoId().withMessage("Valid order id is required"),
    body("stripeId").optional().isString().withMessage("stripeId must be a string"),
    body("status").optional().isString().withMessage("status must be a string")
  ],
  validate,
  payOrder
);
router.post("/:id/cancel", [param("id").isMongoId().withMessage("Valid order id is required")], validate, cancelOrder);

export default router;
