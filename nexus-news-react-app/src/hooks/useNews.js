import { useState, useCallback } from 'react';
import { newsApi } from '../api/newsApi';

/**
 * Custom hook for managing news data fetching
 * Provides loading states and error handling for news operations
 * 
 * @returns {Object} News data and operations
 */
export const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches latest news by category
   */
  const fetchLatest = useCallback(async (category = 'technology', country = 'us') => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsApi.getLatest(category, country);
      setArticles(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches trending news articles
   */
  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsApi.getTrending();
      setTrending(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Searches news articles by query
   */
  const searchNews = useCallback(async (query) => {
    if (!query.trim()) return [];
    setLoading(true);
    setError(null);
    try {
      const data = await newsApi.search(query);
      setArticles(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches both latest and trending news in parallel
   */
  const fetchInitialData = useCallback(async (category = 'technology') => {
    setLoading(true);
    setError(null);
    try {
      const [latestData, trendingData] = await Promise.all([
        newsApi.getLatest(category),
        newsApi.getTrending()
      ]);
      setArticles(latestData || []);
      setTrending(trendingData || []);
      return { latest: latestData, trending: trendingData };
    } catch (err) {
      setError(err.message);
      return { latest: [], trending: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    articles,
    trending,
    loading,
    error,
    fetchLatest,
    fetchTrending,
    searchNews,
    fetchInitialData,
  };
};
