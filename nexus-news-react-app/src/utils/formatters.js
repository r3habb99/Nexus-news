import { COUNTRY_CODES } from '../constants/countries';

/**
 * Maps country codes to full display names
 */
export const formatCountry = (code) => {
  return COUNTRY_CODES[code.toLowerCase()] || code.toUpperCase();
};

/**
 * Cleans the content field by removing API suffixes and 
 * ensuring it ends at a complete sentence.
 */
export const sanitizeContent = (text) => {
  if (!text) return '';
  
  // Remove the [+123 chars] suffix common in news feed data
  let clean = text.replace(/\[\+\d+\s+chars\]/g, '').trim();
  
  // Find the last full stop to ensure the preview doesn't end mid-sentence
  const lastFullStop = clean.lastIndexOf('.');
  if (lastFullStop !== -1) {
    return clean.substring(0, lastFullStop + 1);
  }
  return clean;
};