/**
 * API Routes Index
 * Centralized routing configuration for all API endpoints
 */

import express from "express";
import newsRoutes from "./news.routes.js";
import newsApiOrgRoutes from "./newsApiOrg.routes.js";
import unifiedNewsRoutes from "./unifiedNews.routes.js";
import schedulerRoutes from "./scheduler.routes.js";
import { databaseConnection } from "../db/index.js";

const router = express.Router();

/**
 * Health Check Endpoint
 * Returns API status and database connection status
 */
router.get("/health", async (req, res) => {
  const dbStatus = databaseConnection.getStatus();
  
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.isConnected,
      status: dbStatus.readyState === 1 ? "connected" : "disconnected",
    },
    apis: {
      unified: {
        name: "Unified News API (Recommended)",
        description: "Fetches from both APIs, caches in MongoDB",
        baseUrl: "/api/news",
        endpoints: [
          "/latest",
          "/search",
          "/trending",
          "/category/:category",
          "/country/:country",
          "/sources",
          "/stats",
          "POST /refresh"
        ]
      },
      newsdata: {
        name: "NewsData.io (Direct)",
        baseUrl: "/api/newsdata",
        endpoints: ["/sources", "/latest", "/search", "/category/:category"]
      },
      newsapi: {
        name: "NewsAPI.org (Direct)",
        baseUrl: "/api/newsapi",
        endpoints: ["/top-headlines", "/everything", "/sources", "/category/:category", "/country/:country"]
      }
    }
  });
});

/**
 * Unified News API Routes (RECOMMENDED)
 * Base path: /api/news
 * Fetches from both APIs and caches data in MongoDB
 */
router.use("/news", unifiedNewsRoutes);

/**
 * NewsData.io Routes (Direct API Access)
 * Base path: /api/newsdata
 * Direct access to NewsData.io API without caching
 */
router.use("/newsdata", newsRoutes);

/**
 * NewsAPI.org Routes (Direct API Access)
 * Base path: /api/newsapi
 * Direct access to NewsAPI.org API without caching
 */
router.use("/newsapi", newsApiOrgRoutes);

/**
 * Scheduler Routes
 * Base path: /api/scheduler
 * Manage and monitor the news fetch scheduler
 */
router.use("/scheduler", schedulerRoutes);

export default router;
