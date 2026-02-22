import { unifiedNewsService } from "../services/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse,
  Logger
} from "../utils/index.js";

/**
 * Unified News Controller
 * Handles all news requests - users never know which API is used
 * All data is cached in MongoDB
 */
class UnifiedNewsController {
  /**
   * Get latest news (from cache or fetched from both APIs)
   * GET /api/news/latest
   * Query params: country, category, language, page, limit
   */
  async getLatestNews(req, res) {
    try {
      Logger.info("Fetching latest news", { query: req.query });

      const filters = {
        country: req.query.country,
        category: req.query.category,
        language: req.query.language,
      };

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const data = await unifiedNewsService.getLatestNews(filters);

      if (data.articles && data.articles.length > 0) {
        sendPaginatedResponse(
          res,
          data.articles.slice((page - 1) * limit, page * limit),
          page,
          limit,
          data.totalResults,
          "Latest news fetched successfully"
        );
      } else {
        sendSuccessResponse(res, data, "Latest news fetched successfully");
      }
    } catch (error) {
      Logger.error("Error fetching latest news", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Search news across both APIs
   * GET /api/news/search
   * Query params: q (required), country, language, page, limit
   */
  async searchNews(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return sendErrorResponse(res, "Query parameter 'q' is required", 400);
      }

      Logger.info("Searching news", { query: req.query });

      const filters = {
        country: req.query.country,
        language: req.query.language,
      };

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const data = await unifiedNewsService.searchNews(q, filters);

      if (data.articles && data.articles.length > 0) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        sendPaginatedResponse(
          res,
          data.articles.slice(startIndex, endIndex),
          page,
          limit,
          data.totalResults,
          "Search results fetched successfully"
        );
      } else {
        sendSuccessResponse(res, data, "No results found");
      }
    } catch (error) {
      Logger.error("Error searching news", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get news by category
   * GET /api/news/category/:category
   * Query params: country, language, page, limit
   */
  async getNewsByCategory(req, res) {
    try {
      const { category } = req.params;

      Logger.info("Fetching news by category", {
        category,
        query: req.query,
      });

      const filters = {
        country: req.query.country,
        language: req.query.language,
      };

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const data = await unifiedNewsService.getNewsByCategory(
        category,
        filters
      );

      if (data.articles && data.articles.length > 0) {
        sendPaginatedResponse(
          res,
          data.articles.slice((page - 1) * limit, page * limit),
          page,
          limit,
          data.totalResults,
          `News for category '${category}' fetched successfully`
        );
      } else {
        sendSuccessResponse(
          res,
          data,
          `News for category '${category}' fetched successfully`
        );
      }
    } catch (error) {
      Logger.error("Error fetching news by category", {
        error: error.message,
      });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get trending news (most recent from database)
   * GET /api/news/trending
   * Query params: limit
   */
  async getTrendingNews(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;

      Logger.info("Fetching trending news", { limit });

      const data = await unifiedNewsService.getTrendingNews(limit);

      sendSuccessResponse(res, data, "Trending news fetched successfully");
    } catch (error) {
      Logger.error("Error fetching trending news", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get news sources from both APIs
   * GET /api/news/sources
   * Query params: country, category, language
   */
  async getSources(req, res) {
    try {
      Logger.info("Fetching sources", { query: req.query });

      const filters = {
        country: req.query.country,
        category: req.query.category,
        language: req.query.language,
      };

      const data = await unifiedNewsService.getSources(filters);

      sendSuccessResponse(res, data, "Sources fetched successfully");
    } catch (error) {
      Logger.error("Error fetching sources", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Refresh news cache (manually trigger fetch from APIs)
   * POST /api/news/refresh
   * Body: { country, category, language }
   */
  async refreshCache(req, res) {
    try {
      Logger.info("Manually refreshing cache", { body: req.body });

      const filters = {
        country: req.body.country,
        category: req.body.category,
        language: req.body.language,
      };

      const result = await unifiedNewsService.refreshCache(filters);

      sendSuccessResponse(
        res,
        result,
        "Cache refreshed successfully",
        201
      );
    } catch (error) {
      Logger.error("Error refreshing cache", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get database statistics
   * GET /api/news/stats
   */
  async getStats(req, res) {
    try {
      Logger.info("Fetching database stats");

      const stats = await unifiedNewsService.getStats();

      sendSuccessResponse(res, stats, "Statistics fetched successfully");
    } catch (error) {
      Logger.error("Error fetching stats", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get news by country
   * GET /api/news/country/:country
   * Query params: category, language, page, limit
   */
  async getNewsByCountry(req, res) {
    try {
      const { country } = req.params;

      Logger.info("Fetching news by country", {
        country,
        query: req.query,
      });

      const filters = {
        country: country,
        category: req.query.category,
        language: req.query.language,
      };

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const data = await unifiedNewsService.getLatestNews(filters);

      if (data.articles && data.articles.length > 0) {
        sendPaginatedResponse(
          res,
          data.articles.slice((page - 1) * limit, page * limit),
          page,
          limit,
          data.totalResults,
          `News for country '${country}' fetched successfully`
        );
      } else {
        sendSuccessResponse(
          res,
          data,
          `News for country '${country}' fetched successfully`
        );
      }
    } catch (error) {
      Logger.error("Error fetching news by country", {
        error: error.message,
      });
      sendErrorResponse(res, error.message, 500);
    }
  }
}

export default new UnifiedNewsController();
