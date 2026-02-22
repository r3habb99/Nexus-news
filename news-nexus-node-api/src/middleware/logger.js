import morgan from "morgan";
import { Logger } from "../utils/index.js";

/**
 * Request Logging Middleware
 * Uses Morgan with Winston stream for HTTP request logging
 */

/**
 * Custom Morgan format with detailed information
 */
const loggerFormat = process.env.NODE_ENV === "production"
  ? ":method :url :status :response-time ms"
  : ":method :url :status :response-time ms - :res[content-length]";

/**
 * Morgan middleware configured with Winston stream
 */
const logger = morgan(loggerFormat, {
  stream: Logger.stream,
  skip: (req, res) => {
    // Skip logging for health check endpoint in production
    return process.env.NODE_ENV === "production" && req.url === "/api/health";
  },
});

export default logger;
