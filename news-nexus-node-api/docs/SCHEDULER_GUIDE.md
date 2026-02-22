# 🕐 News Fetch Scheduler - Documentation

## 📋 Overview

The **News Fetch Scheduler** is an automated system that fetches news from both APIs **5 times daily** to populate the database, ensuring:

✅ **No API credit exhaustion** on user requests  
✅ **Always fresh data** in the database  
✅ **Fast user responses** (always from MongoDB cache)  
✅ **Optimal API credit usage** across the day  
✅ **Historical news archive** (never deletes old articles)

## 🎯 Problem Solved

### Before Scheduler:
- ❌ User requests trigger API calls → Credits exhausted quickly
- ❌ Rate limits hit frequently
- ❌ Slow responses (waiting for external APIs)
- ❌ Impossible to serve many users with limited credits

### With Scheduler:
- ✅ Automated fetching 5 times daily → Controlled credit usage
- ✅ User requests ONLY read from database → No credit usage
- ✅ Fast responses (~40ms from MongoDB)
- ✅ Unlimited user requests with 200+100 daily credits

## 📊 API Credits Management

### Daily Limits:
- **NewsData.io**: 200 credits/day
- **NewsAPI.org**: 100 credits/day

### Distribution Strategy:
The scheduler runs **5 times daily**, distributing credits optimally:

| Time | Schedule Name | NewsData.io | NewsAPI.org | Focus |
|------|--------------|-------------|-------------|-------|
| 6:00 AM | EARLY_MORNING | ~40 credits | ~20 credits | General & Breaking news |
| 9:00 AM | MORNING | ~40 credits | ~20 credits | Business & Technology |
| 1:00 PM | AFTERNOON | ~40 credits | ~20 credits | Entertainment & Sports |
| 6:00 PM | EVENING | ~40 credits | ~20 credits | Health & Science |
| 10:00 PM | NIGHT | ~40 credits | ~20 credits | Politics & Latest updates |
| **TOTAL** | **5 fetches** | **~200 credits** | **~100 credits** | **Full coverage** |

## 🕐 Fetch Schedule

### 1. Early Morning (6:00 AM)
**Focus**: General news for the day

**Fetches:**
- Top news from India
- Breaking news from US
- World news

**Configuration:**
```javascript
{
  time: "6:00 AM daily",
  newsDataConfig: [
    { category: "top", country: "in", language: "en" },
    { category: "breaking", country: "us", language: "en" },
    { category: "world", language: "en" }
  ],
  newsApiConfig: [
    { country: "in", pageSize: 100 },
    { country: "us", category: "general", pageSize: 100 }
  ]
}
```

### 2. Morning (9:00 AM)
**Focus**: Business & Technology news

**Fetches:**
- Business news from India & US
- Technology news from US

### 3. Afternoon (1:00 PM)
**Focus**: Entertainment & Sports

**Fetches:**
- Entertainment news from India
- Sports news from India & US

### 4. Evening (6:00 PM)
**Focus**: Health & Science

**Fetches:**
- Health news from India
- Science news from US
- Politics news from India

### 5. Night (10:00 PM)
**Focus**: Latest updates & Politics

**Fetches:**
- Top latest news
- Politics from US
- Technology from India

## 🚀 How It Works

### Architecture

```
Server Startup
      ↓
Connect to MongoDB
      ↓
Start Scheduler
      ↓
Schedule 5 Cron Jobs (one for each time)
      ↓
┌──────────────────────────────────────┐
│  Wait for scheduled time             │
└──────────────────────────────────────┘
      ↓
Scheduled Time Reached (e.g., 6:00 AM)
      ↓
Execute Fetch
      ↓
┌──────────────────────────────────────┐
│  Fetch NewsData.io (3 configs)       │
│  Fetch NewsAPI.org (2 configs)       │
│  (All fetches run sequentially)      │
└──────────────────────────────────────┘
      ↓
Normalize All Articles
      ↓
Save to MongoDB (Bulk Insert with Upsert)
      ↓
Update Statistics
      ↓
Log Results
      ↓
Wait for Next Scheduled Time
```

### User Request Flow

```
User Request: GET /api/news/latest
      ↓
Unified Controller
      ↓
Unified Service
      ↓
Check MongoDB (NOT external APIs) ✅
      ↓
Return Articles from Database
      ↓
Response to User (~40ms)
```

**Key Point**: User requests **NEVER** trigger API calls!

## 📁 Files Overview

### Configuration
- **[src/config/fetchSchedule.config.js](src/config/fetchSchedule.config.js)**: Defines fetch schedules and configurations

### Services
- **[src/services/newsFetchScheduler.service.js](src/services/newsFetchScheduler.service.js)**: Main scheduler service
- **[src/services/unifiedNews.service.js](src/services/unifiedNews.service.js)**: Updated to serve from database only

### Controllers & Routes
- **[src/controllers/scheduler.controller.js](src/controllers/scheduler.controller.js)**: Scheduler management endpoints
- **[src/routes/scheduler.routes.js](src/routes/scheduler.routes.js)**: Scheduler API routes

### Server
- **[src/server.js](src/server.js)**: Starts scheduler automatically on server startup

## 🎮 API Endpoints

### 1. Get Scheduler Status

```http
GET /api/scheduler/status
```

Returns scheduler information, statistics, and next fetch times.

**Response:**
```json
{
  "success": true,
  "data": {
    "isRunning": true,
    "scheduledJobs": [
      {
        "name": "EARLY_MORNING",
        "time": "0 6 * * *",
        "description": "Early morning fetch - General & Breaking news"
      },
      // ... other schedules
    ],
    "lastFetchTimes": {
      "EARLY_MORNING": "2026-02-17T06:00:15.234Z",
      "MORNING": "2026-02-17T09:00:12.456Z",
      // ...
    },
    "stats": {
      "totalFetches": 15,
      "successfulFetches": 14,
      "failedFetches": 1,
      "articlesSaved": 4530
    },
    "estimatedCredits": {
      "newsDataIo": {
        "estimated": 15,
        "limit": 200,
        "remaining": 185
      },
      "newsApiOrg": {
        "estimated": 10,
        "limit": 100,
        "remaining": 90
      }
    }
  }
}
```

**Example:**
```bash
curl "http://localhost:3000/api/scheduler/status"
```

### 2. Trigger Manual Fetch

```http
POST /api/scheduler/trigger
```

Manually trigger a fetch (useful for testing or immediate updates).

**Body:**
```json
{
  "schedule": "MORNING"
}
```

**Valid schedule values:**
- `EARLY_MORNING`
- `MORNING`
- `AFTERNOON`
- `EVENING`
- `NIGHT`

**Example:**
```bash
curl -X POST "http://localhost:3000/api/scheduler/trigger" \
  -H "Content-Type: application/json" \
  -d '{"schedule": "MORNING"}'
```

### 3. Start Scheduler

```http
POST /api/scheduler/start
```

Start the scheduler (if it was stopped).

**Example:**
```bash
curl -X POST "http://localhost:3000/api/scheduler/start"
```

### 4. Stop Scheduler

```http
POST /api/scheduler/stop
```

Stop the scheduler temporarily.

**Example:**
```bash
curl -X POST "http://localhost:3000/api/scheduler/stop"
```

## ⚙️ Configuration

### Environment Variables

Add to your `.env` file:

```env
# Scheduler Configuration
SCHEDULER_ENABLED=true             # Enable/disable scheduler
SCHEDULER_TIMEZONE=Asia/Kolkata    # Timezone for schedules
SCHEDULER_RUN_ON_STARTUP=true      # Run fetch immediately on startup
```

### Customizing Fetch Schedule

Edit [src/config/fetchSchedule.config.js](src/config/fetchSchedule.config.js):

```javascript
export const FETCH_SCHEDULE = {
  MORNING: {
    time: "0 9 * * *", // Cron expression (9:00 AM)
    description: "Morning fetch",
    newsDataConfig: [
      // Add your configurations
      { category: "technology", country: "in", language: "en" }
    ],
    newsApiConfig: [
      { country: "in", category: "technology", pageSize: 100 }
    ]
  }
};
```

### Cron Expression Format

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Examples:**
- `0 6 * * *` - Every day at 6:00 AM
- `0 */4 * * *` - Every 4 hours
- `30 9 * * 1-5` - 9:30 AM, Monday to Friday
- `0 0 * * 0` - Every Sunday at midnight

## 📊 Monitoring & Logs

### Check Logs

The scheduler logs all activities:

```bash
# Watch logs in real-time
tail -f logs/app.log

# Or check console output
npm start
```

**Log Examples:**
```
[INFO] 🕐 Starting News Fetch Scheduler
[INFO] ✓ Scheduled: EARLY_MORNING at 6:00 AM
[INFO] ✓ Scheduled: MORNING at 9:00 AM
[INFO] 🚀 Starting scheduled fetch: MORNING
[INFO] NewsData.io fetch complete - 45 articles
[INFO] NewsAPI.org fetch complete - 38 articles
[INFO] ✅ Scheduled fetch completed: MORNING - 83 total articles saved
```

### Monitor Database

```bash
# Connect to MongoDB
mongosh

# Use database
use news_db

# Count total articles
db.news_articles.countDocuments()

# Count articles by API source
db.news_articles.countDocuments({ sourceApi: "newsdata.io" })
db.news_articles.countDocuments({ sourceApi: "newsapi.org" })

# Get latest articles
db.news_articles.find().sort({ publishedAt: -1 }).limit(5)

# Articles fetched today
db.news_articles.countDocuments({
  fetchedAt: { 
    $gte: new Date(new Date().setHours(0,0,0,0)) 
  }
})
```

## 🎯 Best Practices

### 1. **Let Scheduler Handle API Calls**
- ❌ Don't trigger manual API calls from user requests
- ✅ Always serve from database
- ✅ Use manual trigger endpoint for testing only

### 2. **Monitor Credit Usage**
```bash
# Check estimated credits
curl "http://localhost:3000/api/scheduler/status" | grep estimatedCredits
```

### 3. **Adjust Fetch Times for Your Users**
- If users are primarily in US, adjust timezone
- Peak traffic times should have recent fetches

### 4. **Database Maintenance**
```javascript
// Optional: Clean very old articles (>90 days)
db.news_articles.deleteMany({
  publishedAt: { 
    $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) 
  }
})
```

### 5. **Run Initial Fetch on Startup**
Set `SCHEDULER_RUN_ON_STARTUP=true` in `.env` to populate database immediately.

## 🧪 Testing

### Test Manual Fetch

```bash
# Trigger a test fetch
curl -X POST "http://localhost:3000/api/scheduler/trigger" \
  -H "Content-Type: application/json" \
  -d '{"schedule": "MORNING"}'

# Wait 30 seconds, then check status
sleep 30
curl "http://localhost:3000/api/scheduler/status"

# Verify articles in database
curl "http://localhost:3000/api/news/latest?limit=10"
```

### Test User Flow (No API Calls)

```bash
# Request news (should be from database, not APIs)
time curl "http://localhost:3000/api/news/latest?country=in&category=technology"

# Response should be fast (~40-100ms)
# Check logs - should NOT see "Fetching from APIs"
```

## 🔧 Troubleshooting

### Scheduler Not Starting

**Problem**: Scheduler doesn't start on server startup

**Solutions:**
1. Check MongoDB connection:
   ```bash
   curl "http://localhost:3000/api/health"
   ```

2. Check scheduler status:
   ```bash
   curl "http://localhost:3000/api/scheduler/status"
   ```

3. Check `.env` file:
   ```env
   SCHEDULER_ENABLED=true
   ```

4. Check logs for errors

### No Articles in Database

**Problem**: Database is empty after scheduler runs

**Solutions:**
1. Manually trigger fetch:
   ```bash
   curl -X POST "http://localhost:3000/api/scheduler/trigger" \
     -H "Content-Type: application/json" \
     -d '{"schedule": "MORNING"}'
   ```

2. Check API credentials in `.env`

3. Verify MongoDB connection

4. Check logs for errors

### API Credits Exhausted

**Problem**: Getting rate limit errors

**Solutions:**
1. Verify user requests are NOT triggering API calls
2. Check scheduler frequency (should be 5 times daily max)
3. Review logs for unexpected API calls
4. Reduce `pageSize` in fetch configurations

## 📈 Performance Metrics

### Expected Performance:

**API Calls:**
- **Total daily**: ~15-25 API calls (5 schedules × 3-5 requests each)
- **Credits used**: ~200 (NewsData.io) + ~100 (NewsAPI.org)

**Database:**
- **Articles/day**: ~500-1000 new articles
- **Total articles**: Grows over time (never deleted)
- **Query speed**: 30-50ms average

**User Requests:**
- **API calls triggered**: 0 ✅
- **Response time**: 30-100ms
- **Concurrent users**: Unlimited (served from DB)

## 🎉 Summary

The News Fetch Scheduler provides:

✅ **Automated daily fetching** (5 times)  
✅ **Zero API calls** from user requests  
✅ **Optimal credit distribution** across the day  
✅ **Fast user responses** from MongoDB cache  
✅ **Historical news archive** that never expires  
✅ **Unlimited concurrent users** with limited API credits  

**Your users will never exhaust your API credits!** 🚀
