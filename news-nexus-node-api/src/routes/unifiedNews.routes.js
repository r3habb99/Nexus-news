import express from "express";
import { unifiedNewsController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route   GET /api/news/latest
 * @desc    Get latest news from cache or fetch from both APIs
 * @query   country - Country code (in, us, etc.)
 * @query   category - Category (business, technology, sports, etc.)
 * @query   language - Language code (en, hi, etc.)
 * @query   page - Page number (default: 1)
 * @query   limit - Results per page (default: 50)
 * @access  Public
 * @example /api/news/latest?country=in&category=technology
 */
router.get("/latest", unifiedNewsController.getLatestNews);

/**
 * @route   GET /api/news/search
 * @desc    Search news across both APIs and database
 * @query   q - Search query (required)
 * @query   country - Country code
 * @query   language - Language code
 * @query   page - Page number (default: 1)
 * @query   limit - Results per page (default: 50)
 * @access  Public
 * @example /api/news/search?q=bitcoin&country=us
 */
router.get("/search", unifiedNewsController.searchNews);

/**
 * @route   GET /api/news/trending
 * @desc    Get trending news (most recent articles from database)
 * @query   limit - Number of articles (default: 20)
 * @access  Public
 * @example /api/news/trending?limit=10
 */
router.get("/trending", unifiedNewsController.getTrendingNews);

/**
 * @route   GET /api/news/category/:category
 * @desc    Get news by category
 * @param   category - News category
 * @query   country - Country code
 * @query   language - Language code
 * @query   page - Page number (default: 1)
 * @query   limit - Results per page (default: 50)
 * @access  Public
 * @example /api/news/category/technology?country=in
 */
router.get("/category/:category", unifiedNewsController.getNewsByCategory);

/**
 * @route   GET /api/news/country/:country
 * @desc    Get news by country
 * @param   country - Country code (us, in, etc.)
 * @query   category - Filter by category
 * @query   language - Language code
 * @query   page - Page number (default: 1)
 * @query   limit - Results per page (default: 50)
 * @access  Public
 * @example /api/news/country/us?category=business
 */
router.get("/country/:country", unifiedNewsController.getNewsByCountry);

/**
 * @route   GET /api/news/sources
 * @desc    Get news sources from both APIs
 * @query   country - Filter by country
 * @query   category - Filter by category
 * @query   language - Filter by language
 * @access  Public
 * @example /api/news/sources?country=us&language=en
 */
router.get("/sources", unifiedNewsController.getSources);

/**
 * @route   POST /api/news/refresh
 * @desc    Manually refresh news cache (fetch from APIs)
 * @body    country - Country code
 * @body    category - Category
 * @body    language - Language code
 * @access  Public
 * @example POST /api/news/refresh { "country": "in", "category": "technology" }
 */
router.post("/refresh", unifiedNewsController.refreshCache);

/**
 * @route   GET /api/news/stats
 * @desc    Get database statistics
 * @access  Public
 * @example /api/news/stats
 */
router.get("/stats", unifiedNewsController.getStats);

export default router;
