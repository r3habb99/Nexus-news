import dotenv from "dotenv";

dotenv.config();

export const NEWS_API_CONFIG = {
  BASE_URL: process.env.NEWS_API_BASE_URL || "https://newsdata.io/api/1",
  API_KEY: process.env.NEWS_API_KEY || "pub_0c161e4e53344f428178a6bfc8f80102",
  TIMEOUT: parseInt(process.env.NEWS_API_TIMEOUT) || 10000,
};
