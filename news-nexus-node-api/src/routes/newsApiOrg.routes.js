import express from "express";
import { newsApiOrgController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route   GET /api/newsapi/top-headlines
 * @desc    Get top breaking news headlines
 * @query   country - Country code (us, in, etc.)
 * @query   category - Category (business, technology, sports, etc.)
 * @query   q - Search keyword
 * @query   sources - Comma-separated source IDs
 * @query   page - Page number (default: 1)
 * @query   pageSize - Results per page (default: 20, max: 100)
 * @access  Public
 * @example /api/newsapi/top-headlines?country=us&category=technology
 */
router.get("/top-headlines", newsApiOrgController.getTopHeadlines);

/**
 * @route   GET /api/newsapi/everything
 * @desc    Search through all articles
 * @query   q - Search query (required)
 * @query   sources - Comma-separated source IDs
 * @query   domains - Comma-separated domains
 * @query   excludeDomains - Comma-separated domains to exclude
 * @query   from - Date from (YYYY-MM-DD)
 * @query   to - Date to (YYYY-MM-DD)
 * @query   language - Language code (en, hi, etc.)
 * @query   sortBy - Sort by (relevancy, popularity, publishedAt)
 * @query   page - Page number (default: 1)
 * @query   pageSize - Results per page (default: 20, max: 100)
 * @access  Public
 * @example /api/newsapi/everything?q=bitcoin&sortBy=popularity
 */
router.get("/everything", newsApiOrgController.searchEverything);

/**
 * @route   GET /api/newsapi/sources
 * @desc    Get available news sources
 * @query   category - Filter by category
 * @query   language - Filter by language
 * @query   country - Filter by country
 * @access  Public
 * @example /api/newsapi/sources?language=en&country=us
 */
router.get("/sources", newsApiOrgController.getSources);

/**
 * @route   GET /api/newsapi/category/:category
 * @desc    Get top headlines by category
 * @param   category - News category
 * @query   country - Country code
 * @query   page - Page number (default: 1)
 * @query   pageSize - Results per page (default: 20)
 * @access  Public
 * @example /api/newsapi/category/technology?country=us
 */
router.get("/category/:category", newsApiOrgController.getTopHeadlinesByCategory);

/**
 * @route   GET /api/newsapi/country/:country
 * @desc    Get top headlines by country
 * @param   country - Country code
 * @query   category - Filter by category
 * @query   page - Page number (default: 1)
 * @query   pageSize - Results per page (default: 20)
 * @access  Public
 * @example /api/newsapi/country/us?category=business
 */
router.get("/country/:country", newsApiOrgController.getTopHeadlinesByCountry);

export default router;
