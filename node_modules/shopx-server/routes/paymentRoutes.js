import express from "express";
import { body } from "express-validator";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/create-intent",
  protect,
  [
    body("amount").isFloat({ min: 0.5 }).withMessage("Valid amount is required"),
    body("currency").optional().isLength({ min: 3, max: 3 }).withMessage("Currency must be an ISO code"),
    body("metadata").optional().isObject().withMessage("Metadata must be an object")
  ],
  validate,
  createPaymentIntent
);

export default router;
