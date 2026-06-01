import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Convert express-validator failures into a single API error.
 */
export const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    next(new ApiError(400, message));
    return;
  }

  next();
};
