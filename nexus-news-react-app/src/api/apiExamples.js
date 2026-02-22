/**
 * Comprehensive API Usage Examples
 * This file demonstrates how to use all available news API endpoints
 * and format the data for frontend display
 */

import {
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
  
  // Backward compatibility
  newsApi
} from './newsApi';

import { formatArticles, formatArticle } from '../utils/articleFormatter';

// ============================================
// BASIC USAGE EXAMPLES
// ============================================

/**
 * Example 1: Get latest technology news from India
 */
export async function example1_LatestTechNews() {
  try {
    const articles = await getLatestNews('in', 'technology', 20);
    const formattedArticles = formatArticles(articles);
    console.log('Latest Tech News from India:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 2: Search for AI-related news
 */
export async function example2_SearchAINews() {
  try {
    const articles = await searchNews('artificial intelligence', 20);
    const formattedArticles = formatArticles(articles);
    console.log('AI News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 3: Get trending news
 */
export async function example3_TrendingNews() {
  try {
    const articles = await getTrendingNews(10);
    const formattedArticles = formatArticles(articles);
    console.log('Trending News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 4: Get US business news with pagination
 */
export async function example4_USBusinessNews() {
  try {
    const articles = await getLatestBusinessNews('us', 'en', 1, 10);
    const formattedArticles = formatArticles(articles);
    console.log('US Business News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 5: Search Bitcoin news in specific country
 */
export async function example5_BitcoinNewsByCountry() {
  try {
    const articles = await searchNewsByCountry('bitcoin', 'us', 1, 15);
    const formattedArticles = formatArticles(articles);
    console.log('Bitcoin News from US:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// ============================================
// CATEGORY-SPECIFIC EXAMPLES
// ============================================

/**
 * Example 6: Get sports news from US
 */
export async function example6_SportsNews() {
  try {
    const articles = await getSportsNews('us', 20);
    const formattedArticles = formatArticles(articles);
    console.log('US Sports News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 7: Get entertainment news
 */
export async function example7_EntertainmentNews() {
  try {
    const articles = await getEntertainmentNews(25);
    const formattedArticles = formatArticles(articles);
    console.log('Entertainment News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 8: Get news by custom category
 */
export async function example8_CustomCategory() {
  try {
    const articles = await getNewsByCategory('health', 'in', 15);
    const formattedArticles = formatArticles(articles);
    console.log('Health News from India:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// ============================================
// COUNTRY-SPECIFIC EXAMPLES
// ============================================

/**
 * Example 9: Get technology news from India
 */
export async function example9_IndiaTechNews() {
  try {
    const articles = await getIndiaNews('technology', 20);
    const formattedArticles = formatArticles(articles);
    console.log('India Tech News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 10: Get news by custom country
 */
export async function example10_CustomCountry() {
  try {
    const articles = await getNewsByCountry('uk', 'business', 20);
    const formattedArticles = formatArticles(articles);
    console.log('UK Business News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// ============================================
// ADVANCED USAGE EXAMPLES
// ============================================

/**
 * Example 11: Get all latest news without filters
 */
export async function example11_AllLatestNews() {
  try {
    const articles = await getAllLatestNews(50);
    const formattedArticles = formatArticles(articles);
    console.log('All Latest News:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 12: Search with language filter
 */
export async function example12_SearchWithLanguage() {
  try {
    const articles = await searchNewsWithLanguage('climate change', 'en', 25);
    const formattedArticles = formatArticles(articles);
    console.log('Climate Change News in English:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

/**
 * Example 13: Get top 20 trending articles
 */
export async function example13_TopTrending() {
  try {
    const articles = await getTopTrendingNews();
    const formattedArticles = formatArticles(articles);
    console.log('Top 20 Trending:', formattedArticles);
    return formattedArticles;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// ============================================
// COMBINING MULTIPLE REQUESTS
// ============================================

/**
 * Example 14: Fetch data from multiple sources in parallel
 */
export async function example14_ParallelRequests() {
  try {
    const [latest, trending, sports] = await Promise.all([
      getLatestNews('in', 'technology', 10),
      getTrendingNews(5),
      getSportsNews('us', 10)
    ]);

    return {
      latest: formatArticles(latest),
      trending: formatArticles(trending),
      sports: formatArticles(sports)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      latest: [],
      trending: [],
      sports: []
    };
  }
}

// ============================================
// BACKWARD COMPATIBILITY EXAMPLES
// ============================================

/**
 * Example 15: Using the legacy newsApi object
 * This maintains compatibility with existing code
 */
export async function example15_LegacyAPI() {
  try {
    // Old way - still works!
    const latest = await newsApi.getLatest('technology', 'us');
    const trending = await newsApi.getTrending();
    const search = await newsApi.search('javascript');

    return {
      latest: formatArticles(latest),
      trending: formatArticles(trending),
      search: formatArticles(search)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      latest: [],
      trending: [],
      search: []
    };
  }
}

// ============================================
// REACT COMPONENT USAGE EXAMPLE
// ============================================

/**
 * Example 16: How to use in a React component
 */
export const ReactComponentExample = `
import React, { useState, useEffect } from 'react';
import { getLatestNews, getTrendingNews } from '../api/newsApi';
import { formatArticles } from '../utils/articleFormatter';

function NewsComponent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const data = await getLatestNews('in', 'technology', 20);
      const formatted = formatArticles(data);
      setArticles(formatted);
      setLoading(false);
    }
    
    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {articles.map(article => (
        <article key={article.id}>
          <img src={article.thumbnail} alt={article.title} />
          <h2>{article.title}</h2>
          <p>{article.content}</p>
          <p>By {article.author} | {article.category} | {article.country}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </article>
      ))}
    </div>
  );
}
`;

// ============================================
// FORMATTED ARTICLE STRUCTURE
// ============================================

/**
 * The formatted article object structure returned by formatArticle/formatArticles:
 * 
 * {
 *   id: string,                    // Article unique ID (_id from MongoDB)
 *   title: string,                 // Article title
 *   author: string,                // Author name
 *   description: string,           // Article description
 *   content: string,               // Formatted content (first sentence, clean)
 *   thumbnail: string,             // Image URL (urlToImage)
 *   url: string,                   // Link to full article (for "Read More" button)
 *   category: string,              // Formatted category (capitalized)
 *   country: string,               // Full country name (e.g., "United States of America")
 *   source: string,                // Source name
 *   publishedAt: string,           // Publication date
 *   language: string               // Article language
 * }
 */
