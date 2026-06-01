import express from "express";
import { body, param } from "express-validator";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryProducts,
  updateCategory
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:slug/products", getCategoryProducts);

router.post(
  "/",
  protect,
  roleMiddleware("admin"),
  [
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("parent").optional({ nullable: true }).isMongoId().withMessage("Valid parent id is required"),
    body("image").optional().isString().withMessage("Image must be a string")
  ],
  validate,
  createCategory
);

router.put(
  "/:id",
  protect,
  roleMiddleware("admin"),
  [
    param("id").isMongoId().withMessage("Valid category id is required"),
    body("name").optional().trim().notEmpty().withMessage("Category name cannot be empty"),
    body("parent").optional({ nullable: true }).isMongoId().withMessage("Valid parent id is required"),
    body("image").optional().isString().withMessage("Image must be a string")
  ],
  validate,
  updateCategory
);

router.delete("/:id", protect, roleMiddleware("admin"), [param("id").isMongoId().withMessage("Valid category id is required")], validate, deleteCategory);

export default router;
