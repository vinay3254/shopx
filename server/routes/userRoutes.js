import express from "express";
import { body, param } from "express-validator";
import {
  addAddress,
  deleteUser,
  deleteAddress,
  getAllUsers,
  getMe,
  getMyOrders,
  getWishlist,
  toggleWishlist,
  updateAddress,
  updateMe,
  updateUserRole
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { uploadAvatar } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const addressValidators = (required = true) => {
  const field = (name) => (required ? body(name) : body(name).optional());
  return [
    field("fullName").trim().notEmpty().withMessage("Full name is required"),
    field("phone").trim().notEmpty().withMessage("Phone is required"),
    field("line1").trim().notEmpty().withMessage("Address line 1 is required"),
    field("city").trim().notEmpty().withMessage("City is required"),
    field("state").trim().notEmpty().withMessage("State is required"),
    field("postalCode").trim().notEmpty().withMessage("Postal code is required"),
    body("country").optional().trim().notEmpty().withMessage("Country cannot be empty"),
    body("isDefault").optional().isBoolean().withMessage("isDefault must be boolean")
  ];
};

router.use(protect);

router.get("/admin/all", roleMiddleware("admin"), getAllUsers);
router.put(
  "/admin/:id/role",
  roleMiddleware("admin"),
  [
    param("id").isMongoId().withMessage("Valid user id is required"),
    body("role").isIn(["user", "seller", "admin"]).withMessage("Invalid role")
  ],
  validate,
  updateUserRole
);
router.delete("/admin/:id", roleMiddleware("admin"), [param("id").isMongoId().withMessage("Valid user id is required")], validate, deleteUser);

router.get("/me", getMe);
router.put(
  "/me",
  uploadAvatar,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Valid email is required")
  ],
  validate,
  updateMe
);

router.get("/me/orders", getMyOrders);
router.post("/me/address", addressValidators(true), validate, addAddress);
router.put(
  "/me/address/:id",
  [
    param("id").isMongoId().withMessage("Valid address id is required"),
    ...addressValidators(false)
  ],
  validate,
  updateAddress
);
router.delete("/me/address/:id", [param("id").isMongoId().withMessage("Valid address id is required")], validate, deleteAddress);
router.get("/me/wishlist", getWishlist);
router.post(
  "/me/wishlist/:productId",
  [param("productId").isMongoId().withMessage("Valid product id is required")],
  validate,
  toggleWishlist
);

export default router;
