/**
 * News Fetch Schedule Configuration
 * Defines when and what to fetch to maximize API credit usage
 *
 * NewsData.io: 200 credits/day
 * NewsAPI.org: 100 credits/day
 *
 * Strategy: Distribute fetches across 5 times daily
 * - Each NewsData.io fetch: ~40 credits (200/5)
 * - Each NewsAPI.org fetch: ~20 credits (100/5)
 */

export const FETCH_SCHEDULE = {
  // Early Morning: 6:00 AM - General news for the day
  EARLY_MORNING: {
    time: "0 6 * * *", // 6:00 AM daily
    description: "Early morning fetch - General & Breaking news",
    newsDataConfig: [
      { category: "top", country: "in", language: "en" },
      { category: "breaking", country: "in", language: "en" },
      { category: "top", country: "us", language: "en" },
      { category: "breaking", country: "us", language: "en" },
      { category: "world", language: "en" },
    ],
    newsApiConfig: [
      { country: "in", pageSize: 100 }, // Top headlines for India (includes general)
      { country: "us", pageSize: 100 }, // Top headlines for US (includes general)
    ],
  },

  // Morning: 9:00 AM - Business & Technology
  MORNING: {
    time: "0 9 * * *", // 9:00 AM daily
    description: "Morning fetch - Business & Technology news",
    newsDataConfig: [
      { category: "business", country: "in", language: "en" },
      { category: "technology", country: "in", language: "en" },
      { category: "business", country: "us", language: "en" },
      { category: "technology", country: "us", language: "en" },
    ],
    newsApiConfig: [
      { country: "in", category: "business", pageSize: 100 },
      { country: "in", category: "technology", pageSize: 100 },
      { country: "us", category: "business", pageSize: 100 },
      { country: "us", category: "technology", pageSize: 100 },
    ],
  },

  // Afternoon: 1:00 PM - Entertainment & Sports
  AFTERNOON: {
    time: "0 13 * * *", // 1:00 PM daily
    description: "Afternoon fetch - Entertainment & Sports",
    newsDataConfig: [
      { category: "entertainment", country: "in", language: "en" },
      { category: "entertainment", country: "us", language: "en" },
      { category: "sports", country: "us", language: "en" },
      { category: "sports", country: "in", language: "en" },
    ],
    newsApiConfig: [
      { country: "in", category: "entertainment", pageSize: 100 },
      { country: "in", category: "sports", pageSize: 100 },
      { country: "us", category: "entertainment", pageSize: 100 },
      { country: "us", category: "sports", pageSize: 100 },
    ],
  },

  // Evening: 6:00 PM - Health & Science
  EVENING: {
    time: "0 18 * * *", // 6:00 PM daily
    description: "Evening fetch - Health & Science news",
    newsDataConfig: [
      { category: "health", country: "in", language: "en" },
      { category: "health", country: "us", language: "en" },
      { category: "science", country: "us", language: "en" },
      { category: "science", country: "in", language: "en" },
      { category: "politics", country: "in", language: "en" },
      { category: "politics", country: "us", language: "en" },
    ],
    newsApiConfig: [
      { country: "in", category: "health", pageSize: 100 },
      { country: "us", category: "health", pageSize: 100 },
      { country: "in", category: "science", pageSize: 100 },
      { country: "us", category: "science", pageSize: 100 },
    ],
  },

  // Night: 10:00 PM - Latest updates & Politics
  NIGHT: {
    time: "0 22 * * *", // 10:00 PM daily
    description: "Night fetch - Latest updates & Politics",
    newsDataConfig: [
      { category: "top", language: "en" },
      { category: "politics", country: "us", language: "en" },
      { category: "technology", country: "in", language: "en" },
      { category: "politics", country: "in", language: "en" },
      { category: "technology", country: "us", language: "en" },
    ],
    newsApiConfig: [
      { country: "in", pageSize: 100 }, // Latest headlines for India
      { country: "us", pageSize: 100 }, // Latest headlines for US
    ],
  },
};

/**
 * Scheduler Settings
 */
export const SCHEDULER_CONFIG = {
  enabled: process.env.SCHEDULER_ENABLED !== "false", // Default: enabled
  timezone: process.env.SCHEDULER_TIMEZONE || "Asia/Kolkata",
  runOnStartup: process.env.SCHEDULER_RUN_ON_STARTUP !== "false", // Default: true - Run immediately on startup
  checkEmptyOnStartup: true, // Check if DB is empty and fetch initial data
};

/**
 * API Credit Limits
 */
export const API_LIMITS = {
  newsDataIo: {
    dailyLimit: 200,
    perFetchLimit: 40, // 200/5
  },
  newsApiOrg: {
    dailyLimit: 100,
    perFetchLimit: 20, // 100/5
  },
};

/**
 * Get all scheduled times
 */
export function getScheduleTimes() {
  return Object.keys(FETCH_SCHEDULE).map((key) => ({
    name: key,
    time: FETCH_SCHEDULE[key].time,
    description: FETCH_SCHEDULE[key].description,
  }));
}

/**
 * Get total estimated credits per day
 */
export function getEstimatedDailyCredits() {
  const schedules = Object.values(FETCH_SCHEDULE);

  const newsDataTotal = schedules.reduce(
    (sum, schedule) => sum + schedule.newsDataConfig.length,
    0,
  );

  const newsApiTotal = schedules.reduce(
    (sum, schedule) => sum + schedule.newsApiConfig.length,
    0,
  );

  return {
    newsDataIo: {
      estimated: newsDataTotal,
      limit: API_LIMITS.newsDataIo.dailyLimit,
      remaining: API_LIMITS.newsDataIo.dailyLimit - newsDataTotal,
    },
    newsApiOrg: {
      estimated: newsApiTotal,
      limit: API_LIMITS.newsApiOrg.dailyLimit,
      remaining: API_LIMITS.newsApiOrg.dailyLimit - newsApiTotal,
    },
  };
}
