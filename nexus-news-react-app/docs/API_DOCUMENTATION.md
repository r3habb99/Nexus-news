# News API Documentation

Complete documentation for the Nexus News API integration.

## Table of Contents
- [API Endpoints](#api-endpoints)
- [Available Functions](#available-functions)
- [Data Formatting](#data-formatting)
- [Usage Examples](#usage-examples)
- [Article Data Structure](#article-data-structure)

---

## API Endpoints

Base URL: `http://localhost:3000/api/news`

### Available Endpoints

#### 1. Latest News
- `/latest` - Get latest news with filters (country, category, language, pagination)

#### 2. Search News
- `/search` - Search for news by query with optional filters

#### 3. Trending News
- `/trending` - Get trending news articles

#### 4. Category-Specific
- `/category/{category}` - Get news by category (technology, sports, entertainment, business, etc.)

#### 5. Country-Specific
- `/country/{countryCode}` - Get news by country code (us, in, uk, etc.)

---

## Available Functions

### Latest News

#### getLatestNews(country, category, limit)
Get latest news with filters
```javascript
import { getLatestNews } from './api/newsApi';

const articles = await getLatestNews('in', 'technology', 20);
```

#### getLatestBusinessNews(country, language, page, limit)
Get latest business news with pagination
```javascript
const articles = await getLatestBusinessNews('us', 'en', 1, 10);
```

#### getAllLatestNews(limit)
Get all latest news without filters
```javascript
const articles = await getAllLatestNews(50);
```

---

### Search News

#### searchNews(query, limit)
Search for news by query
```javascript
import { searchNews } from './api/newsApi';

const articles = await searchNews('artificial intelligence', 20);
```

#### searchNewsByCountry(query, country, page, limit)
Search with country filter
```javascript
const articles = await searchNewsByCountry('bitcoin', 'us', 1, 15);
```

#### searchNewsWithLanguage(query, language, limit)
Search with language filter
```javascript
const articles = await searchNewsWithLanguage('climate change', 'en', 25);
```

---

### Trending News

#### getTrendingNews(limit)
Get trending news articles
```javascript
import { getTrendingNews } from './api/newsApi';

const articles = await getTrendingNews(10);
```

#### getTopTrendingNews()
Get top 20 trending articles
```javascript
const articles = await getTopTrendingNews();
```

---

### Category-Specific

#### getTechnologyNews(country, limit)
Get technology news
```javascript
import { getTechnologyNews } from './api/newsApi';

const articles = await getTechnologyNews('in', 15);
```

#### getSportsNews(country, limit)
Get sports news
```javascript
const articles = await getSportsNews('us', 20);
```

#### getEntertainmentNews(limit)
Get entertainment news
```javascript
const articles = await getEntertainmentNews(25);
```

#### getNewsByCategory(category, country, limit)
Generic function to get news by any category
```javascript
import { getNewsByCategory } from './api/newsApi';

const articles = await getNewsByCategory('health', 'in', 15);
```

**Available Categories:**
- technology
- sports
- entertainment
- business
- health
- science
- general

---

### Country-Specific

#### getIndiaNews(category, limit)
Get news from India
```javascript
import { getIndiaNews } from './api/newsApi';

const articles = await getIndiaNews('technology', 20);
```

#### getUSNews(category, limit)
Get news from United States
```javascript
const articles = await getUSNews('business', 15);
```

#### getNewsByCountry(countryCode, category, limit)
Generic function to get news by any country
```javascript
import { getNewsByCountry } from './api/newsApi';

const articles = await getNewsByCountry('uk', 'business', 20);
```

**Supported Country Codes:**
- `us` - United States
- `in` - India
- `uk` - United Kingdom
- `ca` - Canada
- `au` - Australia
- And more...

---

## Data Formatting

### Article Formatter Utilities

Location: `src/utils/articleFormatter.js`

#### formatArticle(article)
Format a single article object for frontend display
```javascript
import { formatArticle } from '../utils/articleFormatter';

const formatted = formatArticle(rawArticle);
```

#### formatArticles(articles)
Format an array of articles
```javascript
import { formatArticles } from '../utils/articleFormatter';

const formatted = formatArticles(rawArticles);
```

#### formatCountry(country)
Convert country code to full name
```javascript
import { formatCountry } from '../utils/articleFormatter';

formatCountry('us');  // Returns: "United States of America"
formatCountry('in');  // Returns: "India"
```

#### formatContent(content)
Format content to a clean sentence
```javascript
import { formatContent } from '../utils/articleFormatter';

const clean = formatContent(rawContent);
// Removes [...+chars] markers and stops at first period
```

#### formatCategory(categories)
Format category array to readable string
```javascript
import { formatCategory } from '../utils/articleFormatter';

formatCategory(['technology', 'ai']);  // Returns: "Technology, Ai"
```

---

## Usage Examples

### Basic React Component

```javascript
import React, { useState, useEffect } from 'react';
import { getLatestNews } from './api/newsApi';
import { formatArticles } from './utils/articleFormatter';

function NewsComponent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const data = await getLatestNews('in', 'technology', 20);
      setArticles(formatArticles(data));
      setLoading(false);
    }
    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="news-grid">
      {articles.map(article => (
        <div key={article.id} className="news-card">
          <img src={article.thumbnail} alt={article.title} />
          <h2>{article.title}</h2>
          <p className="author">By {article.author}</p>
          <p className="metadata">
            {article.category} | {article.country}
          </p>
          <p className="content">{article.content}</p>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More →
          </a>
        </div>
      ))}
    </div>
  );
}
```

### Fetching Multiple Sources in Parallel

```javascript
import { getLatestNews, getTrendingNews, getSportsNews } from './api/newsApi';
import { formatArticles } from './utils/articleFormatter';

async function fetchAllNews() {
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
}
```

### Search with Error Handling

```javascript
import { searchNews } from './api/newsApi';
import { formatArticles } from './utils/articleFormatter';

async function handleSearch(query) {
  try {
    const results = await searchNews(query, 20);
    const formatted = formatArticles(results);
    if (formatted.length === 0) {
      console.log('No results found');
    }
    return formatted;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
```

---

## Article Data Structure

### Raw API Response
```javascript
{
  "_id": { "$oid": "699443e2088ddd1607132298" },
  "articleId": "newsapi_https://example.com/article",
  "title": "Article Title",
  "author": "John Doe",
  "description": "Article description",
  "content": "Full article content... [+1413 chars]",
  "url": "https://example.com/article",
  "urlToImage": "https://example.com/image.jpg",
  "category": ["technology"],
  "country": ["us"],
  "language": "en",
  "source": {
    "id": null,
    "name": "Source Name"
  },
  "publishedAt": { "$date": "2026-02-16T03:42:18.000Z" },
  "createdAt": { "$date": "2026-02-17T10:33:06.694Z" }
}
```

### Formatted Article Object
After using `formatArticle()` or `formatArticles()`:

```javascript
{
  id: "699443e2088ddd1607132298",
  title: "Article Title",
  author: "John Doe",
  description: "Article description",
  content: "Full article content.",  // Clean sentence, no [+chars]
  thumbnail: "https://example.com/image.jpg",
  url: "https://example.com/article",
  category: "Technology",  // Capitalized
  country: "United States of America",  // Full country name
  source: "Source Name",
  publishedAt: "2026-02-16T03:42:18.000Z",
  language: "en"
}
```

### Fields for Frontend Display

1. **id** - Unique identifier for the article
2. **thumbnail** - Image URL for article thumbnail
3. **title** - Article headline
4. **author** - Author name
5. **category** - Article category (formatted)
6. **description** - Short description
7. **content** - Clean first sentence (headline)
8. **url** - Link to full article (for "Read More" button)
9. **country** - Full country name (e.g., "India" instead of "in")

---

## Backward Compatibility

The legacy `newsApi` object is still available for backward compatibility:

```javascript
import { newsApi } from './api/newsApi';

// Old way - still works!
const latest = await newsApi.getLatest('technology', 'us');
const trending = await newsApi.getTrending();
const search = await newsApi.search('query');
```

---

## Error Handling

All API functions include built-in error handling and will return an empty array `[]` if the request fails. This ensures your application won't break even if the API is unavailable.

```javascript
const articles = await getLatestNews('in', 'technology', 20);
// Returns [] if error occurs
// Returns array of articles on success
```

For custom error handling:

```javascript
try {
  const articles = await getLatestNews('in', 'technology', 20);
  if (articles.length === 0) {
    console.log('No articles found');
  }
} catch (error) {
  console.error('Failed to fetch news:', error);
}
```

---

## Notes

- All functions return arrays of articles
- Empty arrays are returned on errors (no exceptions thrown)
- All responses are automatically unwrapped from `data.articles` or `data.data`
- Use `formatArticles()` to get clean, formatted data ready for display
- Country codes are automatically converted to full names when using formatters
- Content is cleaned to remove incomplete text markers like "[+1234 chars]"
