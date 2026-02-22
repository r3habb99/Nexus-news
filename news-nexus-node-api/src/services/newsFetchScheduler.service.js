import cron from "node-cron";
import { newsApiService, newsApiOrgService } from "./index.js";
import { News } from "../db/index.js";
import { Logger } from "../utils/index.js";
import {
  FETCH_SCHEDULE,
  SCHEDULER_CONFIG,
  getScheduleTimes,
  getEstimatedDailyCredits,
} from "../config/index.js";

/**
 * News Fetch Scheduler Service
 * Automatically fetches news 5 times daily to populate database
 * Ensures users always get data from cache without exhausting API credits
 */
class NewsFetchScheduler {
  constructor() {
    this.scheduledJobs = [];
    this.isRunning = false;
    this.lastFetchTimes = {
      EARLY_MORNING: null,
      MORNING: null,
      AFTERNOON: null,
      EVENING: null,
      NIGHT: null,
    };
    this.fetchStats = {
      totalFetches: 0,
      successfulFetches: 0,
      failedFetches: 0,
      articlesSaved: 0,
    };
  }

  /**
   * Normalize NewsData.io article
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
   * Normalize NewsAPI.org article
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
      language: "en",
      keywords: [],
      sourceApi: "newsapi.org",
    };
  }

  /**
   * Save articles to database
   */
  async saveArticlesToDB(articles) {
    try {
      if (!articles || articles.length === 0) {
        return { saved: 0, updated: 0 };
      }

      const bulkOps = articles.map((article) => ({
        updateOne: {
          filter: { articleId: article.articleId },
          update: { $set: article },
          upsert: true,
        },
      }));

      const result = await News.bulkWrite(bulkOps, { ordered: false });

      return {
        saved: result.upsertedCount,
        updated: result.modifiedCount,
      };
    } catch (error) {
      Logger.error("Error saving articles to database", {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Fetch from NewsData.io with configuration
   */
  async fetchFromNewsData(config) {
    try {
      const result = await newsApiService.getLatestNews(config);

      if (result?.results) {
        const normalized = result.results.map((article) =>
          this.normalizeNewsDataArticle(article)
        );
        return normalized;
      }

      return [];
    } catch (error) {
      Logger.error("NewsData.io fetch failed", {
        error: error.message,
        config,
      });
      return [];
    }
  }

  /**
   * Fetch from NewsAPI.org with configuration
   */
  async fetchFromNewsApiOrg(config) {
    try {
      const result = await newsApiOrgService.getTopHeadlines(config);

      if (result?.articles) {
        const normalized = result.articles.map((article) =>
          this.normalizeNewsApiOrgArticle(
            article,
            config.category ? [config.category] : [],
            config.country ? [config.country] : []
          )
        );
        return normalized;
      }

      return [];
    } catch (error) {
      Logger.error("NewsAPI.org fetch failed", {
        error: error.message,
        config,
      });
      return [];
    }
  }

  /**
   * Execute scheduled fetch
   */
  async executeScheduledFetch(scheduleName) {
    const schedule = FETCH_SCHEDULE[scheduleName];

    if (!schedule) {
      Logger.error("Invalid schedule name", { scheduleName });
      return;
    }

    Logger.info(`🚀 Starting scheduled fetch: ${scheduleName}`, {
      description: schedule.description,
      time: new Date().toISOString(),
    });

    try {
      const allArticles = [];

      // Fetch from NewsData.io
      Logger.info(`Fetching from NewsData.io`, {
        configs: schedule.newsDataConfig.length,
      });

      for (const config of schedule.newsDataConfig) {
        const articles = await this.fetchFromNewsData(config);
        allArticles.push(...articles);
        Logger.info(`NewsData.io fetch complete`, {
          config,
          articles: articles.length,
        });
      }

      // Fetch from NewsAPI.org
      Logger.info(`Fetching from NewsAPI.org`, {
        configs: schedule.newsApiConfig.length,
      });

      for (const config of schedule.newsApiConfig) {
        const articles = await this.fetchFromNewsApiOrg(config);
        allArticles.push(...articles);
        Logger.info(`NewsAPI.org fetch complete`, {
          config,
          articles: articles.length,
        });
      }

      // Save to database
      if (allArticles.length > 0) {
        const saveResult = await this.saveArticlesToDB(allArticles);

        Logger.info(`✅ Scheduled fetch completed: ${scheduleName}`, {
          totalFetched: allArticles.length,
          saved: saveResult.saved,
          updated: saveResult.updated,
          time: new Date().toISOString(),
        });

        // Update stats
        this.fetchStats.totalFetches++;
        this.fetchStats.successfulFetches++;
        this.fetchStats.articlesSaved += saveResult.saved;
        this.lastFetchTimes[scheduleName] = new Date();
      } else {
        Logger.warn(`No articles fetched for ${scheduleName}`);
        this.fetchStats.totalFetches++;
      }
    } catch (error) {
      Logger.error(`❌ Scheduled fetch failed: ${scheduleName}`, {
        error: error.message,
        time: new Date().toISOString(),
      });
      this.fetchStats.totalFetches++;
      this.fetchStats.failedFetches++;
    }
  }

  /**
   * Start the scheduler
   */
  start() {
    if (this.isRunning) {
      Logger.warn("Scheduler is already running");
      return;
    }

    if (!SCHEDULER_CONFIG.enabled) {
      Logger.info("Scheduler is disabled in configuration");
      return;
    }

    Logger.info("🕐 Starting News Fetch Scheduler", {
      timezone: SCHEDULER_CONFIG.timezone,
      schedules: Object.keys(FETCH_SCHEDULE).length,
    });

    // Schedule each fetch time
    Object.keys(FETCH_SCHEDULE).forEach((scheduleName) => {
      const schedule = FETCH_SCHEDULE[scheduleName];

      const job = cron.schedule(
        schedule.time,
        () => {
          this.executeScheduledFetch(scheduleName);
        },
        {
          scheduled: true,
          timezone: SCHEDULER_CONFIG.timezone,
        }
      );

      this.scheduledJobs.push({
        name: scheduleName,
        job: job,
        time: schedule.time,
        description: schedule.description,
      });

      Logger.info(`✓ Scheduled: ${scheduleName}`, {
        time: schedule.time,
        description: schedule.description,
      });
    });

    this.isRunning = true;

    // Log schedule summary
    const times = getScheduleTimes();
    Logger.info("📅 Fetch Schedule Overview:", { times });

    // Log estimated credits
    const credits = getEstimatedDailyCredits();
    Logger.info("💳 Estimated Daily API Credits:", credits);

    // Check if database is empty and fetch initial data
    if (SCHEDULER_CONFIG.checkEmptyOnStartup) {
      this.checkAndFetchInitialData();
    } else if (SCHEDULER_CONFIG.runOnStartup) {
      // Fallback to old behavior if checkEmptyOnStartup is disabled
      Logger.info("Running initial fetch on startup...");
      setTimeout(() => {
        this.executeScheduledFetch("MORNING");
      }, 5000); // Wait 5 seconds after startup
    }
  }

  /**
   * Check if database is empty and fetch initial data
   */
  async checkAndFetchInitialData() {
    try {
      Logger.info("🔍 Checking database for existing articles...");
      
      const count = await News.countDocuments();
      
      if (count === 0) {
        Logger.info("📭 Database is empty. Fetching initial data...");
        
        // Wait 3 seconds for everything to settle
        setTimeout(async () => {
          try {
            // Fetch initial data using MORNING schedule (business & tech)
            await this.executeScheduledFetch("MORNING");
            Logger.info("✅ Initial data fetch completed");
          } catch (error) {
            Logger.error("❌ Initial data fetch failed", {
              error: error.message,
            });
          }
        }, 3000);
      } else {
        Logger.info("✓ Database already contains articles", { count });
      }
    } catch (error) {
      Logger.error("Error checking database for initial data", {
        error: error.message,
      });
    }
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (!this.isRunning) {
      Logger.warn("Scheduler is not running");
      return;
    }

    Logger.info("Stopping News Fetch Scheduler");

    this.scheduledJobs.forEach((job) => {
      job.job.stop();
      Logger.info(`✓ Stopped: ${job.name}`);
    });

    this.scheduledJobs = [];
    this.isRunning = false;

    Logger.info("News Fetch Scheduler stopped");
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      scheduledJobs: this.scheduledJobs.map((job) => ({
        name: job.name,
        time: job.time,
        description: job.description,
      })),
      lastFetchTimes: this.lastFetchTimes,
      stats: this.fetchStats,
      config: {
        enabled: SCHEDULER_CONFIG.enabled,
        timezone: SCHEDULER_CONFIG.timezone,
        runOnStartup: SCHEDULER_CONFIG.runOnStartup,
      },
      estimatedCredits: getEstimatedDailyCredits(),
    };
  }

  /**
   * Manually trigger a fetch (for testing)
   */
  async triggerManualFetch(scheduleName = "MORNING") {
    Logger.info(`Manual fetch triggered: ${scheduleName}`);
    await this.executeScheduledFetch(scheduleName);
  }
}

export default new NewsFetchScheduler();
