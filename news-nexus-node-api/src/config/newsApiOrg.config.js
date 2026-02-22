import dotenv from "dotenv";

dotenv.config();

export const NEWS_API_ORG_CONFIG = {
  BASE_URL: process.env.NEWS_ORG_BASE_URL || "https://newsapi.org/v2",
  API_KEY: process.env.NEWS_ORG_API || "256239e958114a2d8e112d2017157e3c",
  TIMEOUT: parseInt(process.env.NEWS_API_TIMEOUT) || 10000,
};
