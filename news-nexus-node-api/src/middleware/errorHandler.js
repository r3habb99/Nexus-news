import { sendErrorResponse, Logger } from "../utils/index.js";

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  Logger.logError("Error occurred", err, {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  // Handle specific error types
  if (err.name === "ValidationError") {
    return sendErrorResponse(res, "Validation failed", 400, err.errors);
  }

  if (err.name === "UnauthorizedError") {
    return sendErrorResponse(res, "Unauthorized access", 401);
  }

  if (err.name === "NotFoundError") {
    return sendErrorResponse(res, "Resource not found", 404);
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  sendErrorResponse(res, message, statusCode, process.env.NODE_ENV === "development" ? { stack: err.stack } : null);
};

export default errorHandler;
