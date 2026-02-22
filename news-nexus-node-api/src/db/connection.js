import mongoose from "mongoose";
import { Logger } from "../utils/index.js";

/**
 * MongoDB Connection Handler (Production-Grade)
 * 
 * Manages database connection lifecycle with:
 * - Race condition prevention via connection lock
 * - Single event listener registration
 * - Graceful shutdown handling
 * - Production-optimized connection pool
 * - Comprehensive error handling and logging
 */

class DatabaseConnection {
  constructor() {
    // Connection state management
    this.connectingPromise = null; // Lock to prevent race conditions
    this.isShuttingDown = false;   // Graceful shutdown flag
    this.eventsRegistered = false; // Prevent duplicate event listeners

    // Register mongoose events ONCE in constructor to avoid duplication
    this.registerConnectionEvents();

    // Register graceful shutdown handlers
    this.registerShutdownHandlers();
  }

  /**
   * Register all mongoose connection event handlers
   * Called once in constructor to prevent duplicate listeners
   */
  registerConnectionEvents() {
    if (this.eventsRegistered) {
      return; // Already registered
    }

    const conn = mongoose.connection;

    // Event: Successfully connected to MongoDB
    conn.on("connected", () => {
      Logger.info("MongoDB connection established", {
        host: conn.host,
        port: conn.port,
        database: conn.name,
        readyState: conn.readyState,
      });
    });

    // Event: Connection opened and ready
    conn.on("open", () => {
      Logger.info("MongoDB connection opened", {
        database: conn.name,
      });
    });

    // Event: Connection error occurred
    conn.on("error", (err) => {
      Logger.error("MongoDB connection error", {
        error: err.message,
        stack: err.stack,
        readyState: conn.readyState,
      });
    });

    // Event: Connection disconnected
    conn.on("disconnected", () => {
      Logger.warn("MongoDB connection disconnected", {
        readyState: conn.readyState,
      });
    });

    // Event: Connection reconnected after losing connection
    conn.on("reconnected", () => {
      Logger.info("MongoDB connection reconnected", {
        host: conn.host,
        database: conn.name,
        readyState: conn.readyState,
      });
    });

    // Event: Connection closed
    conn.on("close", () => {
      Logger.info("MongoDB connection closed", {
        readyState: conn.readyState,
      });
    });

    this.eventsRegistered = true;
  }

  /**
   * Register process termination handlers for graceful shutdown
   */
  registerShutdownHandlers() {
    // Handle SIGINT (Ctrl+C)
    process.on("SIGINT", async () => {
      Logger.info("SIGINT received: Starting graceful shutdown...");
      await this.gracefulShutdown("SIGINT");
      process.exit(0);
    });

    // Handle SIGTERM (termination signal)
    process.on("SIGTERM", async () => {
      Logger.info("SIGTERM received: Starting graceful shutdown...");
      await this.gracefulShutdown("SIGTERM");
      process.exit(0);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", async (err) => {
      Logger.error("Uncaught exception detected", {
        error: err.message,
        stack: err.stack,
      });
      await this.gracefulShutdown("uncaughtException");
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", async (reason, promise) => {
      Logger.error("Unhandled promise rejection", {
        reason: reason,
        promise: promise,
      });
      await this.gracefulShutdown("unhandledRejection");
      process.exit(1);
    });
  }

  /**
   * Get production-optimized connection options
   */
  getConnectionOptions() {
    const isProduction = process.env.NODE_ENV === "production";

    return {
      // Connection pool settings
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10, // Max connections in pool
      minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE) || 2,  // Min connections to maintain
      
      // Timeout settings
      serverSelectionTimeoutMS: 5000,  // Fail fast if can't connect
      socketTimeoutMS: 45000,          // Close inactive sockets after 45s
      connectTimeoutMS: 10000,         // Give up initial connection after 10s
      
      // Write operations
      retryWrites: true,               // Retry failed writes once
      w: "majority",                   // Wait for majority acknowledgment
      
      // Index management
      autoIndex: !isProduction,        // Disable in production (build indexes manually)
      
      // Other options
      family: 4,                       // Use IPv4
    };
  }

  /**
   * Connect to MongoDB with race condition prevention
   * Multiple concurrent calls will wait for the same connection
   */
  async connect() {
    try {
      // Check if already connected using mongoose readyState (source of truth)
      // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
      if (mongoose.connection.readyState === 1) {
        Logger.info("MongoDB already connected", {
          host: mongoose.connection.host,
          database: mongoose.connection.name,
        });
        return;
      }

      // Check if currently connecting - return existing promise (race condition prevention)
      if (mongoose.connection.readyState === 2 && this.connectingPromise) {
        Logger.info("MongoDB connection already in progress, waiting...");
        return await this.connectingPromise;
      }

      // Validate MongoDB URI
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/news_db';
      if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not defined");
      }

      Logger.info("Attempting MongoDB connection...", {
        host: mongoUri.split("@")[1]?.split("/")[0] || "hidden",
      });

      // Create connection promise with lock to prevent race conditions
      this.connectingPromise = mongoose.connect(
        mongoUri,
        this.getConnectionOptions()
      );

      await this.connectingPromise;

      // Connection successful - clear lock
      this.connectingPromise = null;

      Logger.info("MongoDB connection established successfully", {
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        readyState: mongoose.connection.readyState,
      });
    } catch (error) {
      // Connection failed - clear lock and log error
      this.connectingPromise = null;

      Logger.error("Failed to connect to MongoDB", {
        error: error.message,
        stack: error.stack,
        readyState: mongoose.connection.readyState,
      });

      throw error;
    }
  }

  /**
   * Disconnect from MongoDB (idempotent and safe)
   */
  async disconnect() {
    try {
      // Check readyState to ensure we don't try to disconnect multiple times
      const readyState = mongoose.connection.readyState;

      // 0 = disconnected, 3 = disconnecting
      if (readyState === 0) {
        Logger.info("MongoDB already disconnected");
        return;
      }

      if (readyState === 3) {
        Logger.info("MongoDB disconnection already in progress");
        return;
      }

      // If currently connecting, wait for connection to complete before disconnecting
      if (this.connectingPromise) {
        Logger.info("Waiting for connection to complete before disconnecting...");
        await this.connectingPromise.catch(() => {
          // Ignore connection errors, we're disconnecting anyway
        });
      }

      Logger.info("Disconnecting from MongoDB...");
      await mongoose.connection.close();

      Logger.info("MongoDB disconnected successfully", {
        readyState: mongoose.connection.readyState,
      });
    } catch (error) {
      Logger.error("Error disconnecting from MongoDB", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Graceful shutdown handler
   * Ensures all connections are closed before process exit
   */
  async gracefulShutdown(signal) {
    if (this.isShuttingDown) {
      Logger.warn("Shutdown already in progress");
      return;
    }

    this.isShuttingDown = true;

    try {
      Logger.info(`Graceful shutdown initiated by ${signal}`, {
        readyState: mongoose.connection.readyState,
      });

      // Close mongoose connection
      await this.disconnect();

      Logger.info("Graceful shutdown completed");
    } catch (error) {
      Logger.error("Error during graceful shutdown", {
        error: error.message,
        stack: error.stack,
      });
    }
  }

  /**
   * Get connection status with accurate readyState
   * readyState is the source of truth:
   * 0 = disconnected
   * 1 = connected
   * 2 = connecting
   * 3 = disconnecting
   */
  getStatus() {
    const readyState = mongoose.connection.readyState;
    const readyStateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      isConnected: readyState === 1,
      readyState: readyState,
      readyStateText: readyStateMap[readyState] || "unknown",
      host: mongoose.connection.host || null,
      port: mongoose.connection.port || null,
      database: mongoose.connection.name || null,
      models: Object.keys(mongoose.connection.models),
    };
  }

  /**
   * Health check for monitoring systems
   */
  async healthCheck() {
    try {
      if (mongoose.connection.readyState !== 1) {
        return {
          status: "unhealthy",
          message: "Database not connected",
          readyState: mongoose.connection.readyState,
        };
      }

      // Ping database to verify connection is alive
      await mongoose.connection.db.admin().ping();

      return {
        status: "healthy",
        message: "Database connection is active",
        readyState: mongoose.connection.readyState,
        database: mongoose.connection.name,
      };
    } catch (error) {
      Logger.error("Health check failed", {
        error: error.message,
      });

      return {
        status: "unhealthy",
        message: error.message,
        readyState: mongoose.connection.readyState,
      };
    }
  }
}

// Export singleton instance
export default new DatabaseConnection();
