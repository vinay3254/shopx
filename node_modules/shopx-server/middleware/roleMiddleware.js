import ApiError from "../utils/ApiError.js";

/**
 * Restrict a route to one or more user roles.
 * @param {...string} roles Allowed roles.
 */
const roleMiddleware = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    next(new ApiError(403, "You do not have permission to access this resource"));
    return;
  }

  next();
};

export default roleMiddleware;
