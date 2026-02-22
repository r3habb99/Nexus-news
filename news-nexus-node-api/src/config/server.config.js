/**
 * Server configuration
 * Centralized server settings
 */

export const serverConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST || "localhost",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  bodyLimit: "10mb",
  
  /**
   * Get the full base URL for the server
   * Automatically detects protocol based on environment
   * @returns {string} Full base URL (e.g., http://localhost:3000 or https://your-app.onrender.com)
   */
  getBaseURL() {
    // Use HTTPS in production or if explicitly set
    const protocol = process.env.PROTOCOL || (this.env === "production" ? "https" : "http");
    
    // If HOST already includes protocol, use it as-is
    if (this.host.startsWith("http://") || this.host.startsWith("https://")) {
      return this.host;
    }
    
    // For platforms like Render, Heroku, etc., they often provide full URLs
    // Check if port should be included (not needed for deployed apps with standard ports)
    const needsPort = this.host === "localhost" || this.host === "127.0.0.1";
    const portSuffix = needsPort && this.port ? `:${this.port}` : "";
    
    return `${protocol}://${this.host}${portSuffix}`;
  }
};

export const apiInfo = {
  version: "2.0.0",
  name: "News API Server - Unified News Aggregator",
  description: "Fetches news from multiple sources, caches in MongoDB for fast access",
  features: [
    "Dual API integration (NewsData.io + NewsAPI.org)",
    "MongoDB caching for fast responses",
    "Automated scheduled fetching (5 times daily)",
    "No API credit exhaustion on user requests",
    "Unified endpoints - users never know the source",
    "Historical news archive - never deletes old articles"
  ],
  endpoints: {
    health: "/api/health",
    unified: {
      latest: "/api/news/latest",
      search: "/api/news/search?q=query",
      trending: "/api/news/trending",
      category: "/api/news/category/:category",
      country: "/api/news/country/:country",
      sources: "/api/news/sources",
      stats: "/api/news/stats",
      refresh: "POST /api/news/refresh"
    },
    direct: {
      newsdata: "/api/newsdata/*",
      newsapi: "/api/newsapi/*"
    }
  }
};
