import { API_BASE_URL } from '../constants/api';

// ============================================
// LATEST NEWS ENDPOINTS
// ============================================

/**
 * Get latest news with filters
 */
export const getLatestNews = async (country = 'in', category = 'technology', limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/latest?country=${country}&category=${category}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    
    // Extract the articles array from the nested response structure
    // Response structure: {success: true, data: {articles: [...], totalResults: ...}}
    const articles = json.data?.articles || json.articles || json || [];
    
    return articles;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};

/**
 * Get latest business news in English with pagination
 */
export const getLatestBusinessNews = async (country = 'us', language = 'en', page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/latest?country=${country}&category=business&language=${language}&page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching latest business news:', error);
    return [];
  }
};

/**
 * Get all latest news without filters
 */
export const getAllLatestNews = async (limit = 50) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/latest?limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    // Handle different response structures: data can be array or object with articles
    return Array.isArray(json.data) ? json.data : (json.data?.articles || json.articles || json || []);
  } catch (error) {
    console.error('Error fetching all latest news:', error);
    return [];
  }
};

// ============================================
// SEARCH NEWS ENDPOINTS
// ============================================

/**
 * Search for specific topic
 */
export const searchNews = async (query, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};

/**
 * Search with country filter
 */
export const searchNewsByCountry = async (query, country, page = 1, limit = 15) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&country=${country}&page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error searching news by country:', error);
    return [];
  }
};

/**
 * Complex search query with language filter
 */
export const searchNewsWithLanguage = async (query, language = 'en', limit = 25) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&language=${language}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error searching news with language:', error);
    return [];
  }
};

// ============================================
// TRENDING NEWS ENDPOINTS
// ============================================

/**
 * Get trending news (default 10 articles)
 */
export const getTrendingNews = async (limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/trending?limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    
    // Extract the articles array from the nested response structure
    const articles = json.data?.articles || json.articles || json || [];
    
    return articles;
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
};

/**
 * Get top 20 trending articles
 */
export const getTopTrendingNews = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/trending?limit=20`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching top trending news:', error);
    return [];
  }
};

// ============================================
// CATEGORY-SPECIFIC ENDPOINTS
// ============================================

/**
 * Get technology news
 */
export const getTechnologyNews = async (country = 'in', limit = 15) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/category/technology?country=${country}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching technology news:', error);
    return [];
  }
};

/**
 * Get sports news
 */
export const getSportsNews = async (country = 'us', limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/category/sports?country=${country}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching sports news:', error);
    return [];
  }
};

/**
 * Get entertainment news
 */
export const getEntertainmentNews = async (limit = 25) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/category/entertainment?limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching entertainment news:', error);
    return [];
  }
};

/**
 * Generic function to get news by any category
 */
export const getNewsByCategory = async (category, country = null, limit = 20) => {
  try {
    let url = `${API_BASE_URL}/category/${category}?limit=${limit}`;
    if (country) {
      url += `&country=${country}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return [];
  }
};

// ============================================
// COUNTRY-SPECIFIC ENDPOINTS
// ============================================

/**
 * Get news from India
 */
export const getIndiaNews = async (category = 'technology', limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/country/in?category=${category}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching India news:', error);
    return [];
  }
};

/**
 * Get news from United States
 */
export const getUSNews = async (category = 'business', limit = 15) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/country/us?category=${category}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching US news:', error);
    return [];
  }
};

/**
 * Generic function to get news by any country
 */
export const getNewsByCountry = async (countryCode, category = null, limit = 20) => {
  try {
    let url = `${API_BASE_URL}/country/${countryCode}?limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    return json.data?.articles || json.articles || json || [];
  } catch (error) {
    console.error('Error fetching news by country:', error);
    return [];
  }
};

// ============================================
// LEGACY API OBJECT (for backward compatibility)
// ============================================

export const newsApi = {
  getLatest: getLatestNews,
  getTrending: getTrendingNews,
  search: searchNews
};