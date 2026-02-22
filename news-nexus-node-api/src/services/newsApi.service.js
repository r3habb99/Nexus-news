import axios from "axios";
import { NEWS_API_CONFIG } from "../config/index.js";
import { NEWS_CATEGORIES, NEWS_LANGUAGES, NEWS_COUNTRIES } from "../constants/index.js";

class NewsApiService {
  constructor() {
    this.baseURL = NEWS_API_CONFIG.BASE_URL;
    this.apiKey = NEWS_API_CONFIG.API_KEY;
  }

  /**
   * Fetch news sources based on filters
   * @param {Object} filters - Filters for news sources
   * @param {string} filters.country - Comma-separated country codes
   * @param {string} filters.language - Comma-separated language codes
   * @param {string} filters.category - Comma-separated category names
   * @returns {Promise<Object>} - News sources data
   */
  async getNewsSources(filters = {}) {
    try {
      const {
        country = NEWS_COUNTRIES.join(","),
        language = NEWS_LANGUAGES.join(","),
        category = NEWS_CATEGORIES.join(","),
      } = filters;

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseURL}/sources`,
        params: {
          apikey: this.apiKey,
          country,
          language,
          category,
        },
        headers: {},
      };

      const response = await axios.request(config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch latest news articles
   * @param {Object} filters - Filters for news articles
   * @param {string} filters.country - Country code
   * @param {string} filters.language - Language code
   * @param {string} filters.category - Category name
   * @param {string} filters.q - Search query
   * @param {number} filters.page - Page number
   * @returns {Promise<Object>} - News articles data
   */
  async getLatestNews(filters = {}) {
    try {
      const {
        country,
        language,
        category,
        q,
        page = 1,
      } = filters;

      const params = {
        apikey: this.apiKey,
      };

      if (country) params.country = country;
      if (language) params.language = language;
      if (category) params.category = category;
      if (q) params.q = q;
      if (page) params.page = page;

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseURL}/news`,
        params,
        headers: {},
      };

      const response = await axios.request(config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search for specific news articles
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} - Search results
   */
  async searchNews(query, filters = {}) {
    try {
      const {
        country,
        language,
        category,
        page = 1,
      } = filters;

      const params = {
        apikey: this.apiKey,
        q: query,
        page,
      };

      if (country) params.country = country;
      if (language) params.language = language;
      if (category) params.category = category;

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${this.baseURL}/news`,
        params,
        headers: {},
      };

      const response = await axios.request(config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Object} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "API request failed",
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        success: false,
        message: "No response from API server",
        status: 503,
      };
    } else {
      return {
        success: false,
        message: error.message || "An error occurred",
        status: 500,
      };
    }
  }
}

export default new NewsApiService();
