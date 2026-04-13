import { useState, useCallback } from 'react';
import { refreshNewsCache } from '../api/newsApi';

/**
 * Custom hook for managing news cache refresh
 * Handles refresh state, loading, and notifications
 */
export const useRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [refreshError, setRefreshError] = useState('');

  const handleRefresh = useCallback(async (country = null, category = null, language = null) => {
    setIsRefreshing(true);
    setRefreshMessage('');
    setRefreshError('');

    try {
      const result = await refreshNewsCache(country, category, language);

      if (result.success) {
        setRefreshMessage('✅ Cache refreshed successfully!');
        setTimeout(() => setRefreshMessage(''), 3000);
        return true;
      } else {
        setRefreshError(`❌ ${result.message}`);
        setTimeout(() => setRefreshError(''), 3000);
        return false;
      }
    } catch (error) {
      const errorMsg = `Failed to refresh: ${error.message}`;
      setRefreshError(errorMsg);
      console.error(errorMsg);
      setTimeout(() => setRefreshError(''), 3000);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    isRefreshing,
    refreshMessage,
    refreshError,
    handleRefresh,
  };
};
