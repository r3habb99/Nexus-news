// Temporary test file to debug API response
import { API_BASE_URL } from '../constants/api';

export const testAPI = async () => {
  console.log('🧪 Testing API:', API_BASE_URL);
  
  try {
    const response = await fetch(`${API_BASE_URL}/latest?country=in&category=technology&limit=2`);
    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);
    
    const json = await response.json();
    console.log('📦 Full response:', json);
    console.log('📦 Response type:', typeof json);
    console.log('📦 Response keys:', Object.keys(json));
    
    // Test unwrapping logic
    const articles = json.articles || json.data || json || [];
    console.log('📰 Unwrapped articles:', articles);
    console.log('📰 Articles length:', articles.length);
    
    if (articles.length > 0) {
      console.log('📄 First article:', articles[0]);
    }
    
    return articles;
  } catch (error) {
    console.error('❌ API test error:', error);
    return [];
  }
};
