# Dual News API Integration Guide

This document explains the integration of **NewsData.io** and **NewsAPI.org** into your news backend application.

## 📋 Overview

Your application now integrates with **TWO** news APIs to provide comprehensive news coverage:

1. **NewsData.io** - For latest news (48 hours), specialized content (crypto/market), and sources
2. **NewsAPI.org** - For top headlines, comprehensive historical search (5 years), and sources

## 🔑 API Keys Configuration

Both API keys are configured in your `.env` file:

```env
NEWS_API_KEY=pub_0c161e4e53344f428178a6bfc8f80102    # NewsData.io
NEWS_ORG_API=256239e958114a2d8e112d2017157e3c       # NewsAPI.org
```

## 🆚 API Comparison

### NewsData.io (newsdata.io)
- **Base URL**: `https://newsdata.io/api/1`
- **Authentication**: `apikey` query parameter (lowercase 'k')
- **Best For**:
  - Latest breaking news (past 48 hours)
  - Specialized news (crypto, market/financial)
  - Real-time news fetching
  - Historical archive (paid plans)
- **Key Endpoints**:
  - `/latest` - News from past 48 hours
  - `/sources` - Get available sources
  - `/crypto` - Cryptocurrency news
  - `/archive` - Historical data (paid)
- **Backend Routes**: `/api/newsdata/*`

### NewsAPI.org (newsapi.org)
- **Base URL**: `https://newsapi.org/v2`
- **Authentication**: `apiKey` query parameter (capital 'K')
- **Best For**:
  - Top breaking headlines by country/category
  - Comprehensive article search (past 5 years)
  - Historical data without additional cost
  - Popular/trending news
- **Key Endpoints**:
  - `/top-headlines` - Breaking news by country/category
  - `/everything` - Search all articles (5 years history)
  - `/sources` - Get available sources
- **Backend Routes**: `/api/newsapi/*`

## 🎯 When to Use Which API?

### Use NewsData.io When:
✅ You need latest news from the past 48 hours  
✅ You want cryptocurrency-specific news  
✅ You need market/financial news  
✅ You want real-time breaking news  
✅ You need to filter by very specific domains  

### Use NewsAPI.org When:
✅ You want top headlines by country (e.g., "Top US news")  
✅ You need to search articles from the past 5 years  
✅ You want popular/trending articles  
✅ You need comprehensive search across all sources  
✅ You want to sort by popularity or relevancy  

## 📊 Endpoint Mapping

| Use Case | NewsData.io Endpoint | NewsAPI.org Endpoint |
|----------|---------------------|---------------------|
| **Latest breaking news** | `/api/newsdata/latest` | `/api/newsapi/top-headlines` |
| **Search articles** | `/api/newsdata/search?q=query` | `/api/newsapi/everything?q=query` |
| **News by category** | `/api/newsdata/category/:category` | `/api/newsapi/category/:category` |
| **News sources** | `/api/newsdata/sources` | `/api/newsapi/sources` |
| **Historical search** | N/A (paid) | `/api/newsapi/everything?from=DATE` |
| **Crypto news** | `/api/newsdata/latest?category=crypto` | N/A |

## 🔄 Pagination Differences

### NewsData.io:
- Uses **page tokens** for pagination
- Response includes `nextPage` token
- Example: `?page=TOKEN_HERE`

```javascript
// First request
GET /api/newsdata/latest?country=us

// Next page
GET /api/newsdata/latest?country=us&page=TOKEN_FROM_PREVIOUS_RESPONSE
```

### NewsAPI.org:
- Uses **page numbers** for pagination
- Specify `page` (number) and `pageSize` (items per page)
- Example: `?page=2&pageSize=20`

```javascript
// First page
GET /api/newsapi/top-headlines?country=us&page=1&pageSize=20

// Second page
GET /api/newsapi/top-headlines?country=us&page=2&pageSize=20
```

## 📝 Example Use Cases

### Use Case 1: Latest Technology News (24-48 hours)
**Use NewsData.io:**
```bash
GET /api/newsdata/latest?category=technology&country=us
```

### Use Case 2: Top Headlines for India Right Now
**Use NewsAPI.org:**
```bash
GET /api/newsapi/top-headlines?country=in
```

### Use Case 3: Search Bitcoin News from Last Year
**Use NewsAPI.org:**
```bash
GET /api/newsapi/everything?q=bitcoin&from=2025-01-01&to=2025-12-31&sortBy=popularity
```

### Use Case 4: Cryptocurrency News
**Use NewsData.io:**
```bash
GET /api/newsdata/search?q=cryptocurrency
```

### Use Case 5: Popular Technology Articles
**Use NewsAPI.org:**
```bash
GET /api/newsapi/everything?q=technology&sortBy=popularity
```

### Use Case 6: Get All Available News Sources
**Both APIs:**
```bash
# NewsData.io sources
GET /api/newsdata/sources?language=en&country=us

# NewsAPI.org sources
GET /api/newsapi/sources?language=en&country=us
```

## 🏗️ Architecture

### File Structure:
```
src/
├── config/
│   ├── newsApi.config.js          # NewsData.io config
│   └── newsApiOrg.config.js       # NewsAPI.org config
├── services/
│   ├── newsApi.service.js         # NewsData.io service
│   └── newsApiOrg.service.js      # NewsAPI.org service
├── controllers/
│   ├── news.controller.js         # NewsData.io controller
│   └── newsApiOrg.controller.js   # NewsAPI.org controller
└── routes/
    ├── news.routes.js             # NewsData.io routes
    ├── newsApiOrg.routes.js       # NewsAPI.org routes
    └── index.js                   # Main router
```

### Request Flow:
```
Client Request
    ↓
Express Server (server.js)
    ↓
Router (routes/index.js)
    ↓
Specific Routes (news.routes.js OR newsApiOrg.routes.js)
    ↓
Controller (news.controller.js OR newsApiOrg.controller.js)
    ↓
Service (newsApi.service.js OR newsApiOrg.service.js)
    ↓
External API (newsdata.io OR newsapi.org)
    ↓
Response Handler → Client
```

## 🚀 Quick Start Examples

### 1. Get Latest News from India
```bash
# Using NewsData.io (past 48 hours)
curl "http://localhost:3000/api/newsdata/latest?country=in&language=en"

# Using NewsAPI.org (top headlines)
curl "http://localhost:3000/api/newsapi/top-headlines?country=in"
```

### 2. Search for AI Articles
```bash
# Using NewsData.io (recent)
curl "http://localhost:3000/api/newsdata/search?q=artificial%20intelligence"

# Using NewsAPI.org (comprehensive, can include historical)
curl "http://localhost:3000/api/newsapi/everything?q=artificial%20intelligence&sortBy=relevancy"
```

### 3. Technology News
```bash
# Using NewsData.io
curl "http://localhost:3000/api/newsdata/category/technology?country=us"

# Using NewsAPI.org
curl "http://localhost:3000/api/newsapi/category/technology?country=us"
```

## 💡 Best Practices

### 1. Choose the Right API for Your Use Case
- For real-time breaking news → **NewsData.io**
- For popular/trending articles → **NewsAPI.org**
- For historical research → **NewsAPI.org**
- For specialized topics (crypto) → **NewsData.io**

### 2. Implement Caching
Both APIs have rate limits. Consider implementing caching:
```javascript
// Example: Cache popular queries for 5 minutes
// Implement Redis or in-memory caching
```

### 3. Error Handling
Both services have error handlers built-in:
- Check response status codes
- Handle API rate limits
- Implement retry logic with exponential backoff

### 4. Combine APIs for Comprehensive Coverage
You can fetch from both APIs and merge results:
```javascript
// Pseudo-code
const recentNews = await newsDataService.getLatestNews();
const popularNews = await newsApiOrgService.searchEverything(query, {sortBy: 'popularity'});
const combined = [...recentNews, ...popularNews];
```

## ⚠️ Important Differences

| Aspect | NewsData.io | NewsAPI.org |
|--------|-------------|-------------|
| Auth Parameter | `apikey` (lowercase) | `apiKey` (capital K) |
| Pagination | Page tokens | Page numbers |
| Date Range | Last 48 hours (latest) | 5 years (everything) |
| Sort Options | Limited | relevancy, popularity, publishedAt |
| Historical Data | Paid archive | Free (past 5 years) |
| Specialized Content | Crypto, Market | None |

## 🔗 Useful Links

- **NewsData.io Documentation**: https://newsdata.io/documentation
- **NewsAPI.org Documentation**: https://newsapi.org/docs

## 📞 Support

For issues or questions:
1. Check the API documentation
2. Review error logs: `src/utils/logger.js`
3. Verify API keys in `.env` file
4. Check rate limits on respective API dashboards

---

**Happy Coding! 🎉**
