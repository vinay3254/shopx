import express from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getMyProducts,
  getProductBySlug,
  getProducts,
  searchProducts,
  updateProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { uploadProductImages } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const createValidators = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("category").isMongoId().withMessage("Valid category is required"),
  body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("mrp").isFloat({ min: 0 }).withMessage("Valid MRP is required"),
  body("stock").isInt({ min: 0 }).withMessage("Valid stock is required"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be boolean"),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean")
];

const updateValidators = [
  param("id").isMongoId().withMessage("Valid product id is required"),
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("brand").optional().trim().notEmpty().withMessage("Brand cannot be empty"),
  body("category").optional().isMongoId().withMessage("Valid category is required"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("mrp").optional().isFloat({ min: 0 }).withMessage("Valid MRP is required"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Valid stock is required"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be boolean"),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean")
];

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/mine", protect, roleMiddleware("seller", "admin"), getMyProducts);
router.get("/:slug", getProductBySlug);

router.post("/", protect, roleMiddleware("seller", "admin"), uploadProductImages, createValidators, validate, createProduct);
router.put("/:id", protect, roleMiddleware("seller", "admin"), uploadProductImages, updateValidators, validate, updateProduct);
router.delete("/:id", protect, roleMiddleware("seller", "admin"), [param("id").isMongoId().withMessage("Valid product id is required")], validate, deleteProduct);

export default router;
