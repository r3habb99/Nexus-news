import { newsApiService, newsApiOrgService } from "./index.js";
import { News } from "../db/index.js";
import { Logger } from "../utils/index.js";

/**
 * Unified News Service
 * Fetches from both APIs simultaneously, normalizes data, and caches in MongoDB
 * Users never know which API the news comes from
 */
class UnifiedNewsService {
  constructor() {
    this.cacheExpiryMinutes = 30; // Cache validity duration
  }

  /**
   * Normalize NewsData.io article to common format
   */
  normalizeNewsDataArticle(article) {
    return {
      articleId: `newsdata_${article.article_id || article.link}`,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      url: article.link,
      urlToImage: article.image_url || null,
      publishedAt: new Date(article.pubDate),
      source: {
        id: article.source_id || null,
        name: article.source_name || article.source_id || "Unknown",
      },
      author: article.creator?.join(", ") || null,
      category: article.category || [],
      country: article.country || [],
      language: article.language || "en",
      keywords: article.keywords || [],
      sourceApi: "newsdata.io",
      sentiment: article.sentiment || null,
      creator: article.creator || [],
      video_url: article.video_url || null,
      ai_tag: article.ai_tag || null,
      duplicate: article.duplicate || false,
    };
  }

  /**
   * Normalize NewsAPI.org article to common format
   */
  normalizeNewsApiOrgArticle(article, category = [], country = []) {
    return {
      articleId: `newsapi_${article.url}`,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      url: article.url,
      urlToImage: article.urlToImage || null,
      publishedAt: new Date(article.publishedAt),
      source: {
        id: article.source?.id || null,
        name: article.source?.name || "Unknown",
      },
      author: article.author || null,
      category: category,
      country: country,
      language: "en", // NewsAPI.org doesn't always provide language in results
      keywords: [],
      sourceApi: "newsapi.org",
    };
  }

  /**
   * Save articles to MongoDB (bulk insert with duplicate handling)
   */
  async saveArticlesToDB(articles) {
    try {
      if (!articles || articles.length === 0) {
        return { saved: 0, skipped: 0 };
      }

      const bulkOps = articles.map((article) => ({
        updateOne: {
          filter: { articleId: article.articleId },
          update: { $set: article },
          upsert: true,
        },
      }));

      const result = await News.bulkWrite(bulkOps, { ordered: false });

      Logger.info("Articles saved to database", {
        saved: result.upsertedCount,
        updated: result.modifiedCount,
        total: articles.length,
      });

      return {
        saved: result.upsertedCount,
        updated: result.modifiedCount,
        skipped: articles.length - result.upsertedCount - result.modifiedCount,
      };
    } catch (error) {
      Logger.error("Error saving articles to database", {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Check if we have fresh data in cache
   */
  async hasFreshCache(filters = {}) {
    try {
      const cacheExpiry = new Date(
        Date.now() - this.cacheExpiryMinutes * 60 * 1000
      );

      const query = {
        fetchedAt: { $gte: cacheExpiry },
      };

      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.country) {
        query.country = filters.country;
      }
      if (filters.language) {
        query.language = filters.language;
      }

      const count = await News.countDocuments(query);
      return count > 0;
    } catch (error) {
      Logger.error("Error checking cache", { error: error.message });
      return false;
    }
  }

  /**
   * Get latest news from database ONLY
   * Note: API fetching is handled by scheduler, not user requests
   * This prevents exhausting API credits on user requests
   */
  async getLatestNews(filters = {}) {
    try {
      Logger.info("Fetching latest news from database", { filters });
      
      // Always return from database - scheduler handles API fetching
      return await this.getNewsFromDB(filters);
    } catch (error) {
      Logger.error("Error fetching latest news", { error: error.message });
      throw error;
    }
  }

  /**
   * Search news from database ONLY
   * Note: API fetching is handled by scheduler, not user requests
   * This prevents exhausting API credits on user requests
   */
  async searchNews(query, filters = {}) {
    try {
      Logger.info("Searching news in database", { query, filters });
      
      // Search only in database - scheduler handles API fetching
      const dbResults = await News.searchArticles(query, 100);

      return {
        success: true,
        totalResults: dbResults.length,
        articles: dbResults,
        source: "database",
      };
    } catch (error) {
      Logger.error("Error searching news", { error: error.message });
      throw error;
    }
  }

  /**
   * Get news by category from both APIs
   */
  async getNewsByCategory(category, filters = {}) {
    return await this.getLatestNews({ ...filters, category });
  }

  /**
   * Get unique news sources from database
   * Note: Sources come from articles already fetched by scheduler
   */
  async getSources(filters = {}) {
    try {
      Logger.info("Fetching sources from database", { filters });
      
      const query = {};
      if (filters.country) query.country = filters.country;
      if (filters.language) query.language = filters.language;
      if (filters.category) query.category = filters.category;

      // Get unique sources from database
      const sources = await News.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$source.id",
            id: { $first: "$source.id" },
            name: { $first: "$source.name" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return {
        success: true,
        totalResults: sources.length,
        sources: sources.map((s) => ({
          id: s.id,
          name: s.name,
          articleCount: s.count,
        })),
      };
    } catch (error) {
      Logger.error("Error fetching sources", { error: error.message });
      throw error;
    }
  }

  /**
   * Get news from database with filters
   */
  async getNewsFromDB(filters = {}, limit = 50, page = 1) {
    try {
      const query = {};

      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.country) {
        query.country = filters.country;
      }
      if (filters.language) {
        query.language = filters.language;
      }

      const skip = (page - 1) * limit;

      const articles = await News.find(query)
        .sort({ publishedAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await News.countDocuments(query);

      return {
        success: true,
        totalResults: total,
        articles: articles,
        page: page,
        totalPages: Math.ceil(total / limit),
        source: "database",
      };
    } catch (error) {
      Logger.error("Error fetching news from database", {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get trending news (most recent from database)
   */
  async getTrendingNews(limit = 20) {
    try {
      const articles = await News.find()
        .sort({ publishedAt: -1, fetchedAt: -1 })
        .limit(limit)
        .lean();

      return {
        success: true,
        totalResults: articles.length,
        articles: articles,
        source: "database",
      };
    } catch (error) {
      Logger.error("Error fetching trending news", { error: error.message });
      throw error;
    }
  }

  /**
   * Refresh news cache (fetch new articles from APIs)
   */
  async refreshCache(filters = {}) {
    try {
      Logger.info("Refreshing news cache");

      // Fetch from both APIs simultaneously
      const [newsDataResult, newsApiOrgResult] = await Promise.allSettled([
        newsApiService.getLatestNews(filters),
        newsApiOrgService.getTopHeadlines({
          country: filters.country,
          category: filters.category,
          pageSize: 100,
        }),
      ]);

      const normalizedArticles = [];

      if (
        newsDataResult.status === "fulfilled" &&
        newsDataResult.value?.results
      ) {
        const articles = newsDataResult.value.results.map((article) =>
          this.normalizeNewsDataArticle(article)
        );
        normalizedArticles.push(...articles);
      }

      if (
        newsApiOrgResult.status === "fulfilled" &&
        newsApiOrgResult.value?.articles
      ) {
        const articles = newsApiOrgResult.value.articles.map((article) =>
          this.normalizeNewsApiOrgArticle(
            article,
            filters.category ? [filters.category] : [],
            filters.country ? [filters.country] : []
          )
        );
        normalizedArticles.push(...articles);
      }

      if (normalizedArticles.length > 0) {
        const result = await this.saveArticlesToDB(normalizedArticles);
        Logger.info("Cache refreshed successfully", result);
        return result;
      }

      return { saved: 0, updated: 0, skipped: 0 };
    } catch (error) {
      Logger.error("Error refreshing cache", { error: error.message });
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const total = await News.countDocuments();
      const newsDataCount = await News.countDocuments({
        sourceApi: "newsdata.io",
      });
      const newsApiOrgCount = await News.countDocuments({
        sourceApi: "newsapi.org",
      });

      const recentCount = await News.countDocuments({
        fetchedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      return {
        total,
        bySource: {
          newsDataIo: newsDataCount,
          newsApiOrg: newsApiOrgCount,
        },
        recentArticles: recentCount,
      };
    } catch (error) {
      Logger.error("Error getting stats", { error: error.message });
      throw error;
    }
  }
}

export default new UnifiedNewsService();
