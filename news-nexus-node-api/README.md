# News API Backend

A structured and modular Node.js backend application for fetching and serving news articles from **two news APIs**:
- **NewsData.io** - Latest news, sources, and historical data
- **NewsAPI.org** - Top headlines and comprehensive article search

## 📁 Project Structure

```
src/
├── server.js                      # Main application entry point
├── config/
│   ├── newsApi.config.js          # NewsData.io configuration
│   └── newsApiOrg.config.js       # NewsAPI.org configuration
├── constants/
│   └── newsConstants.js           # Reusable constants (categories, languages, etc.)
├── controllers/
│   ├── news.controller.js         # NewsData.io business logic
│   └── newsApiOrg.controller.js   # NewsAPI.org business logic
├── routes/
│   ├── index.js                   # Main router
│   ├── news.routes.js             # NewsData.io routes
│   └── newsApiOrg.routes.js       # NewsAPI.org routes
├── services/
│   ├── newsApi.service.js         # NewsData.io API integration
│   └── newsApiOrg.service.js      # NewsAPI.org API integration
├── middleware/
│   ├── errorHandler.js            # Global error handler
│   ├── notFoundHandler.js         # 404 handler
│   └── logger.js                  # Request logging middleware
└── utils/
    ├── logger.js                  # Custom logger utility
    └── responseHandler.js         # Standardized response helpers
```

## 🚀 Features

- **Dual API Integration**: Access to both NewsData.io and NewsAPI.org
- **Modular Architecture**: Clean separation of concerns with controllers, services, and routes
- **Reusable Components**: Centralized configuration, constants, and utilities
- **Error Handling**: Global error handling middleware with detailed logging
- **Request Logging**: Morgan-based HTTP request logging
- **Security**: Helmet.js for security headers, CORS configured
- **Performance**: Compression middleware for response optimization
- **Documentation**: Well-documented endpoints and code

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development
NEWS_API_KEY=your_newsdata_io_api_key_here
NEWS_ORG_API=your_newsapi_org_api_key_here
NEWS_API_BASE_URL=https://newsdata.io/api/1
NEWS_ORG_BASE_URL=https://newsapi.org/v2
```

## 🎯 Usage

### Development Mode

```bash
npm start
```

The server will start at `http://localhost:3000`

## 📚 API Endpoints

### Root Endpoint

```
GET /
```

Returns API information and available endpoints.

### Health Check

```
GET /api/health
```

Check if the API is running and see available APIs.

---

## 🗞️ NewsData.io Endpoints

Base path: `/api/newsdata`

### 1. Get News Sources

```
GET /api/newsdata/sources
```

**Query Parameters:**
- `country`: Comma-separated country codes (e.g., "in,us")
- `language`: Comma-separated language codes (e.g., "en,hi")
- `category`: Comma-separated categories (e.g., "business,technology")

**Example:**
```bash
curl "http://localhost:3000/api/newsdata/sources?country=in&language=en"
```

### 2. Get Latest News (Past 48 hours)

```
GET /api/newsdata/latest
```

**Query Parameters:**
- `country`: Country code
- `language`: Language code
- `category`: Category name
- `q`: Search query
- `page`: Page token for pagination

**Example:**
```bash
curl "http://localhost:3000/api/newsdata/latest?country=in&category=technology"
```

### 3. Search News

```
GET /api/newsdata/search?q=your_query
```

**Query Parameters:**
- `q`: Search query (required)
- `country`: Country code
- `language`: Language code
- `category`: Category name
- `page`: Page token

**Example:**
```bash
curl "http://localhost:3000/api/newsdata/search?q=bitcoin&country=us"
```

### 4. Get News by Category

```
GET /api/newsdata/category/:category
```

**URL Parameters:**
- `category`: Category name (breaking, business, technology, etc.)

**Query Parameters:**
- `country`: Country code
- `language`: Language code
- `page`: Page token

**Example:**
```bash
curl "http://localhost:3000/api/newsdata/category/technology?country=in&language=en"
```

---

## 🌐 NewsAPI.org Endpoints

Base path: `/api/newsapi`

### 1. Get Top Headlines

```
GET /api/newsapi/top-headlines
```

**Query Parameters:**
- `country`: Country code (us, in, etc.)
- `category`: Category (business, technology, sports, etc.)
- `q`: Search keyword
- `sources`: Comma-separated source IDs
- `page`: Page number (default: 1)
- `pageSize`: Results per page (default: 20, max: 100)

**Example:**
```bash
curl "http://localhost:3000/api/newsapi/top-headlines?country=us&category=technology"
```

### 2. Search Everything (Past 5 years)

```
GET /api/newsapi/everything?q=your_query
```

**Query Parameters:**
- `q`: Search query (required)
- `sources`: Comma-separated source IDs
- `domains`: Comma-separated domains
- `excludeDomains`: Comma-separated domains to exclude
- `from`: Date from (YYYY-MM-DD)
- `to`: Date to (YYYY-MM-DD)
- `language`: Language code (en, hi, etc.)
- `sortBy`: Sort by (relevancy, popularity, publishedAt)
- `page`: Page number (default: 1)
- `pageSize`: Results per page (default: 20, max: 100)

**Example:**
```bash
curl "http://localhost:3000/api/newsapi/everything?q=bitcoin&sortBy=popularity&from=2026-01-01"
```

### 3. Get News Sources

```
GET /api/newsapi/sources
```

**Query Parameters:**
- `category`: Filter by category
- `language`: Filter by language
- `country`: Filter by country

**Example:**
```bash
curl "http://localhost:3000/api/newsapi/sources?language=en&country=us"
```

### 4. Get Top Headlines by Category

```
GET /api/newsapi/category/:category
```

**URL Parameters:**
- `category`: News category

**Query Parameters:**
- `country`: Country code
- `page`: Page number
- `pageSize`: Results per page

**Example:**
```bash
curl "http://localhost:3000/api/newsapi/category/technology?country=us"
```

### 5. Get Top Headlines by Country

```
GET /api/newsapi/country/:country
```

**URL Parameters:**
- `country`: Country code (us, in, etc.)

**Query Parameters:**
- `category`: Filter by category
- `page`: Page number
- `pageSize`: Results per page

**Example:**
```bash
curl "http://localhost:3000/api/newsapi/country/us?category=business"
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Request successful",
  "data": { ... },
  "timestamp": "2026-02-17T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2026-02-17T10:30:00.000Z"
}
```

---

## 🆚 API Comparison

| Feature | NewsData.io | NewsAPI.org |
|---------|-------------|-------------|
| **Base Path** | `/api/newsdata` | `/api/newsapi` |
| **Latest News** | ✅ Past 48 hours | ✅ Top Headlines |
| **Search** | ✅ Search query | ✅ Everything endpoint |
| **Sources** | ✅ Available | ✅ Available |
| **Historical Data** | ✅ Archive (paid) | ✅ Past 5 years |
| **Specialized** | Crypto, Market news | N/A |
| **Pagination** | Page tokens | Page numbers |
| **Best For** | Latest news, specialized topics | Top headlines, comprehensive search |

---

## 🔧 Available Categories

- breaking
- business
- world
- top
- technology
- sports
- entertainment
- health
- science
- politics

## 🌍 Supported Languages

- en (English)
- hi (Hindi)

## 🌎 Supported Countries

- in (India)
- us (United States)

## 🛡️ Security Features

- Helmet.js for security headers
- CORS configuration
- Request body size limits
- Environment variable protection

## 🔄 Future Enhancements

- Database integration for caching news articles
- User authentication and authorization
- Rate limiting
- News bookmarking and favorites
- Pagination improvements
- Real-time news updates with WebSockets
- News categorization with AI
- Aggregated search across both APIs

## 📄 License

ISC

## 👨‍💻 Development

This application follows best practices for Node.js backend development:
- ES6+ modules
- Async/await for asynchronous operations
- Error-first callback pattern
- RESTful API design
- MVC-like architecture
