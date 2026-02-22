/**
 * Available news categories
 * Compatible with both NewsData.io and NewsAPI.org
 */
export const NEWS_CATEGORIES = [
  "breaking",
  "business",
  "world",
  "top",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
  "politics",
];

/**
 * Available languages
 * Common languages supported by both APIs
 */
export const NEWS_LANGUAGES = ["en", "hi"];

/**
 * Available countries
 * Common countries supported by both APIs
 */
export const NEWS_COUNTRIES = ["in", "us"];

/**
 * Default pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * API Response messages
 */
export const API_MESSAGES = {
  SUCCESS: "Request successful",
  ERROR: "An error occurred",
  NOT_FOUND: "Resource not found",
  INVALID_REQUEST: "Invalid request parameters",
  SERVER_ERROR: "Internal server error",
};

/**
 * Sort options for NewsAPI.org
 */
export const NEWSAPI_SORT_BY = {
  RELEVANCY: "relevancy",
  POPULARITY: "popularity",
  PUBLISHED_AT: "publishedAt",
};

/**
 * API Sources
 */
export const API_SOURCES = {
  NEWSDATA: "newsdata.io",
  NEWSAPI: "newsapi.org",
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  NEWSDATA: {
    LATEST: "/latest",
    SOURCES: "/sources",
    SEARCH: "/latest", // NewsData.io uses /latest with 'q' parameter for search
    CRYPTO: "/crypto",
    ARCHIVE: "/archive",
  },
  NEWSAPI: {
    TOP_HEADLINES: "/top-headlines",
    EVERYTHING: "/everything",
    SOURCES: "/sources",
  },
};
