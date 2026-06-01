/**
 * Wrap an async Express route handler with a try/catch boundary.
 * @param {Function} fn Async route handler.
 * @returns {Function} Express middleware.
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default asyncHandler;
