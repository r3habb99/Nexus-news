/**
 * Express Application Configuration
 * This file configures the Express app with middleware and routes
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { errorHandler, requestLogger, notFoundHandler } from "./middleware/index.js";
import routes from "./routes/index.js";
import { serverConfig, apiInfo } from "./config/server.config.js";

/**
 * Initialize Express app
 */
const app = express();

/**
 * Security Middleware
 * - Helmet: Sets various HTTP headers for security
 */
app.use(helmet());

/**
 * CORS Configuration
 * - Allows cross-origin requests from specified origin
 */
app.use(
  cors({
    origin: serverConfig.corsOrigin,
    credentials: true,
  })
);

/**
 * Compression Middleware
 * - Compresses response bodies for better performance
 */
app.use(compression());

/**
 * Body Parser Middleware
 * - Parses JSON and URL-encoded data
 */
app.use(express.json({ limit: serverConfig.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: serverConfig.bodyLimit }));

/**
 * Request Logging Middleware
 * - Logs all incoming requests using Winston
 */
app.use(requestLogger);

/**
 * API Routes
 * - All API routes are prefixed with /api
 */
app.use("/api", routes);

/**
 * Root Endpoint
 * - Provides API information and documentation
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: apiInfo.name,
    version: apiInfo.version,
    description: apiInfo.description,
    features: apiInfo.features,
    endpoints: apiInfo.endpoints,
    documentation: "See README.md for detailed usage"
  });
});

/**
 * 404 Handler
 * - Handles requests to non-existent routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 * - Catches and handles all errors from routes and middleware
 */
app.use(errorHandler);

export default app;
