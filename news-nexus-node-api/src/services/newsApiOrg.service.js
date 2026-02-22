import axios from "axios";
import { NEWS_API_ORG_CONFIG } from "../config/index.js";
import {
  NEWS_CATEGORIES,
  NEWS_LANGUAGES,
  NEWS_COUNTRIES,
} from "../constants/index.js";

/**
 * NewsAPI.org Service
 * Service layer for interacting with NewsAPI.org (newsapi.org)
 * Handles API requests for top headlines, everything search, and sources
 */
class NewsApiOrgService {
  constructor() {
    this.baseURL = NEWS_API_ORG_CONFIG.BASE_URL;
    this.apiKey = NEWS_API_ORG_CONFIG.API_KEY;
    this.timeout = NEWS_API_ORG_CONFIG.TIMEOUT;
  }

  /**
   * Make API request to NewsAPI.org
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @returns {Promise<object>} API response
   */
  async makeRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          ...params,
          apiKey: this.apiKey, // Note: capital 'K' for NewsAPI.org
        },
        timeout: this.timeout,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get top headlines
   * @param {object} filters - Filters for headlines (country, category, q, sources)
   * @returns {Promise<object>} Top headlines response
   */
  async getTopHeadlines(filters = {}) {
    const params = {};

    // Add filters
    if (filters.country) params.country = filters.country;
    if (filters.category) params.category = filters.category;
    if (filters.q) params.q = filters.q;
    if (filters.sources) params.sources = filters.sources;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.page) params.page = filters.page;

    return await this.makeRequest("/top-headlines", params);
  }

  /**
   * Search everything - all articles
   * @param {string} query - Search query
   * @param {object} filters - Additional filters (sources, domains, from, to, language, sortBy)
   * @returns {Promise<object>} Everything search response
   */
  async searchEverything(query, filters = {}) {
    const params = {
      q: query,
    };

    // Add filters
    if (filters.sources) params.sources = filters.sources;
    if (filters.domains) params.domains = filters.domains;
    if (filters.excludeDomains) params.excludeDomains = filters.excludeDomains;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (filters.language) params.language = filters.language;
    if (filters.sortBy) params.sortBy = filters.sortBy; // relevancy, popularity, publishedAt
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.page) params.page = filters.page;

    return await this.makeRequest("/everything", params);
  }

  /**
   * Get news sources
   * @param {object} filters - Filters (category, language, country)
   * @returns {Promise<object>} Sources response
   */
  async getSources(filters = {}) {
    const params = {};

    if (filters.category) params.category = filters.category;
    if (filters.language) params.language = filters.language;
    if (filters.country) params.country = filters.country;

    return await this.makeRequest("/sources", params);
  }

  /**
   * Get top headlines by category
   * @param {string} category - News category
   * @param {object} filters - Additional filters
   * @returns {Promise<object>} Category headlines response
   */
  async getTopHeadlinesByCategory(category, filters = {}) {
    return await this.getTopHeadlines({
      ...filters,
      category,
    });
  }

  /**
   * Get top headlines by country
   * @param {string} country - Country code
   * @param {object} filters - Additional filters
   * @returns {Promise<object>} Country headlines response
   */
  async getTopHeadlinesByCountry(country, filters = {}) {
    return await this.getTopHeadlines({
      ...filters,
      country,
    });
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error object
   * @throws {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // API responded with error
      const { status, data } = error.response;
      throw new Error(
        `NewsAPI.org API Error (${status}): ${
          data.message || "Unknown error"
        }`
      );
    } else if (error.request) {
      // No response received
      throw new Error(
        "NewsAPI.org API Error: No response received from server"
      );
    } else {
      // Other errors
      throw new Error(`NewsAPI.org API Error: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new NewsApiOrgService();
