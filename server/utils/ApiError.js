class ApiError extends Error {
  /**
   * Create an operational HTTP error.
   * @param {number} statusCode HTTP status code to send.
   * @param {string} message Error message safe to return to clients.
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
