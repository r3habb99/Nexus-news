import express from "express";
import { newsController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route   GET /api/newsdata/sources
 * @desc    Get news sources from NewsData.io
 * @query   country - Country code (in, us, etc.)
 * @query   category - Category (business, technology, sports, etc.)
 * @query   language - Language code (en, hi, etc.)
 * @access  Public
 * @example /api/newsdata/sources?country=in&language=en
 */
router.get("/sources", newsController.getNewsSources.bind(newsController));

/**
 * @route   GET /api/newsdata/latest
 * @desc    Get latest news from NewsData.io (past 48 hours)
 * @query   country - Country code
 * @query   category - News category
 * @query   language - Language code
 * @query   q - Search query
 * @query   page - Page token for pagination
 * @access  Public
 * @example /api/newsdata/latest?country=in&category=technology
 */
router.get("/latest", newsController.getLatestNews.bind(newsController));

/**
 * @route   GET /api/newsdata/search
 * @desc    Search news by query on NewsData.io
 * @query   q - Search query (required)
 * @query   country - Country code
 * @query   language - Language code
 * @query   category - News category
 * @query   page - Page token for pagination
 * @access  Public
 * @example /api/newsdata/search?q=bitcoin&country=us
 */
router.get("/search", newsController.searchNews.bind(newsController));

/**
 * @route   GET /api/newsdata/category/:category
 * @desc    Get news by category from NewsData.io
 * @param   category - News category
 * @query   country - Country code
 * @query   language - Language code
 * @query   page - Page token for pagination
 * @access  Public
 * @example /api/newsdata/category/technology?country=in
 */
router.get("/category/:category", newsController.getNewsByCategory.bind(newsController));

export default router;
