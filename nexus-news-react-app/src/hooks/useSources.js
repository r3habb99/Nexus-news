import { useState, useEffect, useCallback } from 'react';
import { getNewsSources } from '../api/newsApi';

/**
 * Custom hook for managing news sources
 * Handles fetching and filtering available news sources
 */
export const useSources = () => {
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [sourcesError, setSourcesError] = useState('');

  const fetchSources = useCallback(async (country = null, category = null) => {
    setLoadingSources(true);
    setSourcesError('');

    try {
      const data = await getNewsSources(country, category);

      // Handle different response structures
      const sourcesList = Array.isArray(data) ? data : [];
      setSources(sourcesList);
      
      if (sourcesList.length === 0) {
        setSourcesError('No sources available');
      }
    } catch (error) {
      setSourcesError(`Failed to fetch sources: ${error.message}`);
      console.error('Error fetching sources:', error);
    } finally {
      setLoadingSources(false);
    }
  }, []);

  const toggleSource = useCallback((sourceId) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  }, []);

  const clearSelectedSources = useCallback(() => {
    setSelectedSources([]);
  }, []);

  return {
    sources,
    selectedSources,
    loadingSources,
    sourcesError,
    fetchSources,
    toggleSource,
    clearSelectedSources,
  };
};
