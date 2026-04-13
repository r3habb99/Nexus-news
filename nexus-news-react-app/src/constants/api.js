// Use environment variable with fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nexus-news-api.onrender.com/api/news';
