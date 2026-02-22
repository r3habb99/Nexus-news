const API_BASE_URL = 'http://localhost:3000/api/news';

// ============================================
// LATEST NEWS ENDPOINTS
// ============================================

// Get latest news with filters
const getLatestNews = async (country = 'in', category = 'technology', limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/latest?country=${country}&category=${category}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Get latest business news in English with pagination
const getLatestBusinessNews = async (country = 'us', language = 'en', page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/latest?country=${country}&category=business&language=${language}&page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Get all latest news without filters
const getAllLatestNews = async (limit = 50) => {
  const response = await fetch(
    `${API_BASE_URL}/latest?limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// ============================================
// SEARCH NEWS ENDPOINTS
// ============================================

// Search for specific topic
const searchNews = async (query, limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Search with country filter
const searchNewsByCountry = async (query, country, page = 1, limit = 15) => {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&country=${country}&page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Complex search query with language filter
const searchNewsWithLanguage = async (query, language = 'en', limit = 25) => {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&language=${language}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// ============================================
// TRENDING NEWS ENDPOINTS
// ============================================

// Get trending news (default 10 articles)
const getTrendingNews = async (limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/trending?limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Get top 20 trending articles
const getTopTrendingNews = async () => {
  const response = await fetch(
    `${API_BASE_URL}/trending?limit=20`
  );
  const data = await response.json();
  return data;
};

// ============================================
// CATEGORY-SPECIFIC ENDPOINTS
// ============================================

// Get technology news
const getTechnologyNews = async (country = 'in', limit = 15) => {
  const response = await fetch(
    `${API_BASE_URL}/category/technology?country=${country}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Get sports news
const getSportsNews = async (country = 'us', limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/category/sports?country=${country}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Get entertainment news
const getEntertainmentNews = async (limit = 25) => {
  const response = await fetch(
    `${API_BASE_URL}/category/entertainment?limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Generic function to get news by any category
const getNewsByCategory = async (category, country = null, limit = 20) => {
  let url = `${API_BASE_URL}/category/${category}?limit=${limit}`;
  if (country) {
    url += `&country=${country}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// ============================================
// COUNTRY-SPECIFIC ENDPOINTS
// ============================================

// Get news from India
const getIndiaNews = async (category = 'technology', limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/country/in?category=${category}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Get news from United States
const getUSNews = async (category = 'business', limit = 15) => {
  const response = await fetch(
    `${API_BASE_URL}/country/us?category=${category}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Generic function to get news by any country
const getNewsByCountry = async (countryCode, category = null, limit = 20) => {
  let url = `${API_BASE_URL}/country/${countryCode}?limit=${limit}`;
  if (category) {
    url += `&category=${category}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// ============================================
// USAGE EXAMPLES
// ============================================

// Example usage:
async function examples() {
  try {
    // Get latest tech news from India
    const latestTech = await getLatestNews('in', 'technology', 20);
    console.log('Latest Tech News:', latestTech);

    // Search for AI news
    const aiNews = await searchNews('artificial intelligence', 20);
    console.log('AI News:', aiNews);

    // Get trending news
    const trending = await getTrendingNews(10);
    console.log('Trending News:', trending);

    // Get US business news
    const businessNews = await getLatestBusinessNews('us', 'en', 1, 10);
    console.log('US Business News:', businessNews);

    // Search bitcoin news in US
    const bitcoinNews = await searchNewsByCountry('bitcoin', 'us', 1, 15);
    console.log('Bitcoin News:', bitcoinNews);

    // Get sports news
    const sportsNews = await getSportsNews('us', 20);
    console.log('Sports News:', sportsNews);

    // Get India tech news
    const indiaNews = await getIndiaNews('technology', 20);
    console.log('India Tech News:', indiaNews);

  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Export all functions
export {
  // Latest News
  getLatestNews,
  getLatestBusinessNews,
  getAllLatestNews,
  
  // Search News
  searchNews,
  searchNewsByCountry,
  searchNewsWithLanguage,
  
  // Trending News
  getTrendingNews,
  getTopTrendingNews,
  
  // Category Specific
  getTechnologyNews,
  getSportsNews,
  getEntertainmentNews,
  getNewsByCategory,
  
  // Country Specific
  getIndiaNews,
  getUSNews,
  getNewsByCountry,
};

// below type of json data you will have from that use the field names and logic for frontend
// {
//   "_id": {
//     "$oid": "699443e2088ddd1607132298"
//   },
//   "articleId": "newsapi_https://noisypixel.net/bloodstained-director-shutaro-iida-passes-away/",
//   "__v": 0,
//   "ai_tag": null,
//   "author": "Orpheus Joshua",
//   "category": [
//     "technology"
//   ],
//   "content": "Developer ArtPlay, known for the action-metroidvania Bloodstained: Ritual of the Night, has announced that director Shutaro Iida has passed away from cancer at age 52. He was reported to have been af… [+1413 chars]",
//   "country": [
//     "us"
//   ],
//   "createdAt": {
//     "$date": "2026-02-17T10:33:06.694Z"
//   },
//   "creator": [],
//   "description": "ArtPlay announces the passing of Bloodstained director Shutaro Iida at 52 as Bloodstained: The Scarlet Engagement nears completion.",
//   "duplicate": false,
//   "fetchedAt": {
//     "$date": "2026-02-17T10:33:06.697Z"
//   },
//   "keywords": [],
//   "language": "en",
//   "publishedAt": {
//     "$date": "2026-02-16T03:42:18.000Z"
//   },
//   "sentiment": null,
//   "source": {
//     "id": null,
//     "name": "Noisy Pixel"
//   },
//   "sourceApi": "newsapi.org",
//   "title": "Bloodstained Director Shutaro Iida Passes Away at 52 as Sequel Production Enters Its Final Stages - Noisy Pixel",
//   "updatedAt": {
//     "$date": "2026-02-17T10:33:06.694Z"
//   },
//   "url": "https://noisypixel.net/bloodstained-director-shutaro-iida-passes-away/",
//   "urlToImage": "https://noisypixel.net/wp-content/uploads/2025/06/Bloodstained-The-Scarlet-Engagement-6.jpg",
//   "video_url": null
// }


// Field to use on frontend for user 
// 1- _id
// 2- urlToImage for thumbnails image on article
// 3- Title
// 4- author
// 5- category
// 6- description
// 7- content -- one sentence like a headline avoid going last to [] where the chars incomplete and also make sure sentence should stop at the full stop when it find
// 8- url -- provide this url to navigate to actual article by giving button for Read more or like visit this url 
// 9- country -- if find us or in, make it full like United States of America or India