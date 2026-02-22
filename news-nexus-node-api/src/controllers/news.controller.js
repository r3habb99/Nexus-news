import { newsApiService } from "../services/index.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/index.js";
import { API_MESSAGES } from "../constants/index.js";

class NewsController {
  /**
   * Get news sources
   * GET /api/news/sources
   */
  async getNewsSources(req, res, next) {
    try {
      const { country, language, category } = req.query;

      const filters = {};
      if (country) filters.country = country;
      if (language) filters.language = language;
      if (category) filters.category = category;

      const result = await newsApiService.getNewsSources(filters);

      if (result.success) {
        sendSuccessResponse(res, result.data, "News sources fetched successfully");
      } else {
        sendErrorResponse(res, result.message, result.status || 500, result.data);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get latest news articles
   * GET /api/news/latest
   */
  async getLatestNews(req, res, next) {
    try {
      const { country, language, category, q, page } = req.query;

      const filters = {};
      if (country) filters.country = country;
      if (language) filters.language = language;
      if (category) filters.category = category;
      if (q) filters.q = q;
      if (page) filters.page = parseInt(page);

      const result = await newsApiService.getLatestNews(filters);

      if (result.success) {
        sendSuccessResponse(res, result.data, "Latest news fetched successfully");
      } else {
        sendErrorResponse(res, result.message, result.status || 500, result.data);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search news articles
   * GET /api/news/search
   */
  async searchNews(req, res, next) {
    try {
      const { q, country, language, category, page } = req.query;

      if (!q) {
        return sendErrorResponse(res, "Search query is required", 400);
      }

      const filters = {};
      if (country) filters.country = country;
      if (language) filters.language = language;
      if (category) filters.category = category;
      if (page) filters.page = parseInt(page);

      const result = await newsApiService.searchNews(q, filters);

      if (result.success) {
        sendSuccessResponse(res, result.data, "Search results fetched successfully");
      } else {
        sendErrorResponse(res, result.message, result.status || 500, result.data);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get news by category
   * GET /api/news/category/:category
   */
  async getNewsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const { country, language, page } = req.query;

      const filters = {
        category,
      };

      if (country) filters.country = country;
      if (language) filters.language = language;
      if (page) filters.page = parseInt(page);

      const result = await newsApiService.getLatestNews(filters);

      if (result.success) {
        sendSuccessResponse(res, result.data, `${category} news fetched successfully`);
      } else {
        sendErrorResponse(res, result.message, result.status || 500, result.data);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new NewsController();
