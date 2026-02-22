/**
 * Utility functions to format article data for frontend display
 */

import { DEFAULT_NEWS_IMAGE } from '../constants/images';

// Country code to full name mapping
const COUNTRY_NAMES = {
  us: "United States of America",
  in: "India",
};

/**
 * Format country code to full country name
 * @param {string|string[]} country - Country code(s)
 * @returns {string} Full country name or code if not found
 */
export const formatCountry = (country) => {
  if (Array.isArray(country)) {
    return country.map((c) => COUNTRY_NAMES[c?.toLowerCase()] || c).join(", ");
  }
  return COUNTRY_NAMES[country?.toLowerCase()] || country;
};

/**
 * Format content to a clean sentence, stopping at the first period
 * and avoiding incomplete text markers like [...chars]
 * @param {string} content - Raw content from API
 * @returns {string} Clean formatted sentence
 */
export const formatContent = (content) => {
  if (!content) return "";

  // Remove the ending pattern like "... [+1413 chars]"
  let cleaned = content.replace(/\.\.\.\s*\[\+\d+\s+chars\]$/i, "");

  // Find the first period followed by space or end of string
  const firstPeriodIndex = cleaned.search(/\.\s|\.$/);

  if (firstPeriodIndex !== -1) {
    // Return everything up to and including the first period
    return cleaned.substring(0, firstPeriodIndex + 1).trim();
  }

  // If no period found, return cleaned content
  return cleaned.trim();
};

/**
 * Format category array to readable string
 * @param {string[]} categories - Array of categories
 * @returns {string} Formatted categories
 */
export const formatCategory = (categories) => {
  if (!categories || categories.length === 0) return "General";

  if (Array.isArray(categories)) {
    return categories
      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1))
      .join(", ");
  }

  return typeof categories === "string"
    ? categories.charAt(0).toUpperCase() + categories.slice(1)
    : "General";
};

/**
 * Extract and format all required fields for frontend display
 * @param {Object} article - Raw article object from API
 * @returns {Object} Formatted article object with all necessary fields
 */
export const formatArticle = (article) => {
  if (!article) return null;

  const formatted = {
    id: article._id?.$oid || article._id || article.articleId,
    title: article.title || "Untitled",
    author: article.author || "Unknown Author",
    description: article.description || "",
    content: formatContent(article.content),
    thumbnail: article.urlToImage || article.image || DEFAULT_NEWS_IMAGE,
    url: article.url,
    category: formatCategory(article.category),
    country: formatCountry(article.country),
    source: article.source?.name || "Unknown Source",
    publishedAt: article.publishedAt?.$date || article.publishedAt,
    language: article.language || "en",
  };

  return formatted;
};

/**
 * Format an array of articles
 * @param {Array} articles - Array of raw article objects
 * @returns {Array} Array of formatted article objects
 */
export const formatArticles = (articles) => {
  // console.log('📚 formatArticles received:', {
  //   type: typeof articles,
  //   isArray: Array.isArray(articles),
  //   length: articles?.length,
  //   sample: articles?.[0]
  // });
  
  if (!Array.isArray(articles)) {
    console.warn('⚠️ formatArticles: Input is not an array!', articles);
    return [];
  }
  
  const formatted = articles.map(formatArticle).filter(Boolean);
  
  // console.log('📚 formatArticles returning:', {
  //   count: formatted.length,
  //   sample: formatted[0]
  // });
  
  return formatted;
};

/**
 * Get a preview of content (for cards)
 * @param {string} content - Full content
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated content
 */
export const getContentPreview = (content, maxLength = 150) => {
  if (!content) return "";

  const formatted = formatContent(content);

  if (formatted.length <= maxLength) return formatted;

  return formatted.substring(0, maxLength).trim() + "...";
};
