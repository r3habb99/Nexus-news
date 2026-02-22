import { newsApiOrgService } from "../services/index.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
  Logger
} from "../utils/index.js";

/**
 * NewsAPI.org Controller
 * Handles business logic for NewsAPI.org endpoints
 */
class NewsApiOrgController {
  /**
   * Get top headlines
   * GET /api/newsapi/top-headlines
   * Query params: country, category, q, sources, page, pageSize
   */
  async getTopHeadlines(req, res) {
    try {
      Logger.info("Fetching top headlines from NewsAPI.org", {
        query: req.query,
      });

      const filters = {
        country: req.query.country,
        category: req.query.category,
        q: req.query.q,
        sources: req.query.sources,
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 20,
      };

      const data = await newsApiOrgService.getTopHeadlines(filters);

      sendSuccessResponse(res, data, "Top headlines fetched successfully");
    } catch (error) {
      Logger.error("Error fetching top headlines from NewsAPI.org", {
        error: error.message,
      });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Search everything - all articles
   * GET /api/newsapi/everything
   * Query params: q, sources, domains, excludeDomains, from, to, language, sortBy, page, pageSize
   */
  async searchEverything(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return sendErrorResponse(res, "Query parameter 'q' is required", 400);
      }

      Logger.info("Searching everything on NewsAPI.org", { query: req.query });

      const filters = {
        sources: req.query.sources,
        domains: req.query.domains,
        excludeDomains: req.query.excludeDomains,
        from: req.query.from,
        to: req.query.to,
        language: req.query.language,
        sortBy: req.query.sortBy,
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 20,
      };

      const data = await newsApiOrgService.searchEverything(q, filters);

      sendSuccessResponse(res, data, "Articles fetched successfully");
    } catch (error) {
      Logger.error("Error searching everything on NewsAPI.org", {
        error: error.message,
      });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get news sources
   * GET /api/newsapi/sources
   * Query params: category, language, country
   */
  async getSources(req, res) {
    try {
      Logger.info("Fetching sources from NewsAPI.org", { query: req.query });

      const filters = {
        category: req.query.category,
        language: req.query.language,
        country: req.query.country,
      };

      const data = await newsApiOrgService.getSources(filters);

      sendSuccessResponse(res, data, "Sources fetched successfully");
    } catch (error) {
      Logger.error("Error fetching sources from NewsAPI.org", {
        error: error.message,
      });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get top headlines by category
   * GET /api/newsapi/category/:category
   * Params: category
   * Query params: country, page, pageSize
   */
  async getTopHeadlinesByCategory(req, res) {
    try {
      const { category } = req.params;

      Logger.info("Fetching top headlines by category from NewsAPI.org", {
        category,
        query: req.query,
      });

      const filters = {
        country: req.query.country,
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 20,
      };

      const data = await newsApiOrgService.getTopHeadlinesByCategory(
        category,
        filters
      );

      sendSuccessResponse(
        res,
        data,
        `Top headlines for ${category} fetched successfully`
      );
    } catch (error) {
      Logger.error("Error fetching headlines by category from NewsAPI.org", {
        error: error.message,
      });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Get top headlines by country
   * GET /api/newsapi/country/:country
   * Params: country
   * Query params: category, page, pageSize
   */
  async getTopHeadlinesByCountry(req, res) {
    try {
      const { country } = req.params;

      Logger.info("Fetching top headlines by country from NewsAPI.org", {
        country,
        query: req.query,
      });

      const filters = {
        category: req.query.category,
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 20,
      };

      const data = await newsApiOrgService.getTopHeadlinesByCountry(
        country,
        filters
      );

      sendSuccessResponse(
        res,
        data,
        `Top headlines for ${country} fetched successfully`
      );
    } catch (error) {
      Logger.error("Error fetching headlines by country from NewsAPI.org", {
        error: error.message,
      });
      sendErrorResponse(res, error.message, 500);
    }
  }
}

export default new NewsApiOrgController();
