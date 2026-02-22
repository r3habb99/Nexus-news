/**
 * Server Entry Point
 * Starts the HTTP server and handles graceful shutdown
 */

import dotenv from "dotenv";
import app from "./app.js";
import { Logger } from "./utils/index.js";
import { databaseConnection } from "./db/index.js";
import { newsFetchScheduler } from "./services/index.js";
import { serverConfig } from "./config/index.js";

// Load environment variables
dotenv.config();

/**
 * Connect to MongoDB
 */
await databaseConnection.connect().catch((error) => {
  Logger.error("Failed to connect to MongoDB. Server will continue without database.", {
    error: error.message,
  });
});

/**
 * Start HTTP Server
 */
const server = app.listen(serverConfig.port, () => {
  Logger.info(`Server is running in ${serverConfig.env} mode on port ${serverConfig.port}`);
  Logger.info(`API Documentation: ${serverConfig.getBaseURL()}/`);
  
  // Start news fetch scheduler after server starts
  if (databaseConnection.getStatus().isConnected) {
    Logger.info("Starting News Fetch Scheduler...");
    newsFetchScheduler.start();
  } else {
    Logger.warn("Database not connected. Scheduler will not start.");
  }
});

/**
 * Graceful Shutdown Handler
 * Handles SIGTERM and SIGINT signals
 */
const gracefulShutdown = async (signal) => {
  Logger.info(`${signal} signal received: closing HTTP server`);
  
  // Stop scheduler
  newsFetchScheduler.stop();
  
  // Close database connection
  await databaseConnection.disconnect().catch((error) => {
    Logger.error("Error disconnecting from database", { error: error.message });
  });
  
  // Close HTTP server
  server.close(() => {
    Logger.info("HTTP server closed");
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    Logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

/**
 * Process Event Handlers
 */
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  Logger.error("Unhandled Promise Rejection", { error: err });
});

process.on("uncaughtException", (err) => {
  Logger.error("Uncaught Exception", { error: err });
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

export default app;

