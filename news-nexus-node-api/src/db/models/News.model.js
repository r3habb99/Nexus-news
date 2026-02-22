import mongoose from "mongoose";

/**
 * URL Validator
 * Validates URLs for url, urlToImage, and video_url fields
 */
const urlValidator = {
  validator: function (value) {
    if (!value) return true; // Allow null/undefined
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  message: (props) => `${props.value} is not a valid HTTP/HTTPS URL`,
};

/**
 * News Article Schema (Production-Hardened)
 * 
 * Unified schema for storing news from both APIs with:
 * - Strict schema validation
 * - URL validators
 * - Optimized indexes for read-heavy workloads
 * - Soft delete support
 * - Schema versioning for migrations
 * - Performance-optimized query helpers
 */
const newsSchema = new mongoose.Schema(
  {
    // Unified ID (prefixed: newsdata_* or newsapi_*)
    articleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // Article Details
    title: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: [500, "Title cannot exceed 500 characters"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    content: {
      type: String,
      default: "",
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
      validate: urlValidator, // URL validation
    },

    urlToImage: {
      type: String,
      default: null,
      trim: true,
      validate: urlValidator, // URL validation
    },

    // Publication Info
    publishedAt: {
      type: Date,
      required: true,
      index: true,
    },

    source: {
      id: {
        type: String,
        default: null,
        trim: true,
      },
      name: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },
    },

    author: {
      type: String,
      default: null,
      trim: true,
    },

    // Categorization (arrays for multi-tagging)
    category: {
      type: [String],
      default: [],
      // Note: Individual index removed - covered by compound index { category: 1, publishedAt: -1 }
    },

    country: {
      type: [String],
      default: [],
      // Note: Individual index removed - covered by compound index { country: 1, publishedAt: -1 }
    },

    language: {
      type: String,
      default: "en",
      index: true,
      lowercase: true,
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
      // Note: Index removed for keywords array to prevent parallel array indexing issues
    },

    // Metadata
    sourceApi: {
      type: String,
      enum: {
        values: ["newsdata.io", "newsapi.org"],
        message: "{VALUE} is not a supported news API source",
      },
      required: true,
      index: true,
    },

    fetchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Additional fields from APIs
    sentiment: {
      type: String,
      default: null,
      enum: {
        values: [null, "positive", "negative", "neutral"],
        message: "{VALUE} is not a valid sentiment value",
      },
    },

    creator: {
      type: [String],
      default: [],
    },

    video_url: {
      type: String,
      default: null,
      trim: true,
      validate: urlValidator, // URL validation
    },

    ai_tag: {
      type: String,
      default: null,
      trim: true,
    },

    duplicate: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering out duplicates
    },

    // Soft delete support (for logical deletion without removing data)
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // Index for efficient filtering of deleted records
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    // Schema versioning for future migrations
    schemaVersion: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: "news_articles",
    
    // Strict mode: prevent unknown fields from being saved
    strict: true,
    
    // Reject queries with unknown fields in production
    strictQuery: true,
    
    // Optimize for read performance
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * INDEXES FOR PRODUCTION WORKLOAD
 * 
 * Strategy: Optimize for read-heavy workloads (news aggregation is 90% reads)
 * Trade-off: More indexes = slower writes, but significantly faster reads
 * 
 * Primary indexes (keep):
 * - articleId (unique) - for upsert operations
 * - publishedAt (descending) - for latest news queries
 * - category, country, language - for filtering
 * - sourceApi - for API-specific queries
 * 
 * Compound indexes (optimized for common query patterns):
 */

// Most common query: latest news by category/country
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ country: 1, publishedAt: -1 });
newsSchema.index({ sourceApi: 1, publishedAt: -1 });

// Multi-filter queries (e.g., language-based filtering)
// Note: Cannot create compound index on category + country (both arrays)
// MongoDB doesn't support indexing multiple parallel arrays
newsSchema.index({ language: 1, publishedAt: -1 });

// Soft delete queries (exclude deleted records)
newsSchema.index({ isDeleted: 1, publishedAt: -1 });

// Text search index for full-text search
newsSchema.index({ 
  title: "text", 
  description: "text", 
  content: "text" 
}, {
  weights: {
    title: 10,        // Title matches are most important
    description: 5,   // Description matches are moderately important
    content: 1        // Content matches are least important
  },
  name: "news_text_search"
});

// Duplicate detection index
newsSchema.index({ duplicate: 1, fetchedAt: -1 });

/**
 * QUERY HELPERS
 * Reusable query builders for common patterns
 */

// Base query: exclude soft-deleted records by default
newsSchema.query.excludeDeleted = function() {
  return this.where({ isDeleted: false });
};

// Base query: only include active articles
newsSchema.query.active = function() {
  return this.where({ isDeleted: false, duplicate: false });
};

/**
 * STATIC METHODS (Production-Optimized)
 * All methods support pagination and lean queries for performance
 */

/**
 * Find recent articles with pagination
 * @param {number} hours - Hours to look back (default 24)
 * @param {object} options - { limit, skip, lean }
 */
newsSchema.statics.findRecent = function (hours = 24, options = {}) {
  const {
    limit = 20,
    skip = 0,
    lean = true, // lean() for read performance (returns plain objects)
  } = options;

  const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  let query = this.find({ 
    publishedAt: { $gte: hoursAgo },
    isDeleted: false,
    duplicate: false,
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip);

  return lean ? query.lean() : query;
};

/**
 * Find articles by category with pagination
 * Uses $in for array field queries (efficient with indexes)
 * @param {string|string[]} categories - Category or array of categories
 * @param {object} options - { limit, skip, lean }
 */
newsSchema.statics.findByCategory = function (categories, options = {}) {
  const {
    limit = 20,
    skip = 0,
    lean = true,
  } = options;

  // Ensure categories is an array for $in operator
  const categoryArray = Array.isArray(categories) ? categories : [categories];

  let query = this.find({ 
    category: { $in: categoryArray }, // Efficient array query with index
    isDeleted: false,
    duplicate: false,
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip);

  return lean ? query.lean() : query;
};

/**
 * Find articles by country with pagination
 * Uses $in for array field queries
 * @param {string|string[]} countries - Country or array of countries
 * @param {object} options - { limit, skip, lean }
 */
newsSchema.statics.findByCountry = function (countries, options = {}) {
  const {
    limit = 20,
    skip = 0,
    lean = true,
  } = options;

  const countryArray = Array.isArray(countries) ? countries : [countries];

  let query = this.find({ 
    country: { $in: countryArray },
    isDeleted: false,
    duplicate: false,
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip);

  return lean ? query.lean() : query;
};

/**
 * Search articles using full-text search (IMPROVED)
 * Sorts by textScore for relevance instead of just publishedAt
 * @param {string} searchQuery - Search text
 * @param {object} options - { limit, skip, lean }
 */
newsSchema.statics.searchArticles = function (searchQuery, options = {}) {
  const {
    limit = 20,
    skip = 0,
    lean = true,
  } = options;

  let query = this.find({
    $text: { $search: searchQuery },
    isDeleted: false,
    duplicate: false,
  }, {
    // Project textScore for sorting by relevance
    score: { $meta: "textScore" }
  })
    .sort({ 
      score: { $meta: "textScore" }, // Sort by relevance first
      publishedAt: -1                 // Then by date
    })
    .limit(limit)
    .skip(skip);

  return lean ? query.lean() : query;
};

/**
 * Count articles matching filters (for pagination metadata)
 */
newsSchema.statics.countByFilters = function (filters = {}) {
  return this.countDocuments({
    ...filters,
    isDeleted: false,
    duplicate: false,
  });
};

/**
 * Bulk upsert articles (SAFE INSERT STRATEGY)
 * 
 * RECOMMENDED PATTERN for ingestion to prevent duplicates:
 * 
 * const articles = [...]; // normalized articles from API
 * const bulkOps = articles.map(article => ({
 *   updateOne: {
 *     filter: { articleId: article.articleId },
 *     update: { $set: article },
 *     upsert: true  // Insert if not exists, update if exists
 *   }
 * }));
 * 
 * await News.bulkWrite(bulkOps, { ordered: false });
 * 
 * Benefits:
 * - Atomic operations
 * - Handles duplicates gracefully
 * - ordered: false continues on duplicate key errors
 * - Much faster than individual saves
 */
newsSchema.statics.bulkUpsert = async function (articles) {
  if (!articles || articles.length === 0) {
    return { success: 0, errors: 0 };
  }

  const bulkOps = articles.map((article) => ({
    updateOne: {
      filter: { articleId: article.articleId },
      update: { $set: article },
      upsert: true,
    },
  }));

  try {
    const result = await this.bulkWrite(bulkOps, { ordered: false });
    return {
      success: result.upsertedCount + result.modifiedCount,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      errors: 0,
    };
  } catch (error) {
    // BulkWriteError can occur with duplicate keys even with ordered: false
    // Extract success count from error object if available
    if (error.writeErrors) {
      return {
        success: error.result.nUpserted + error.result.nModified,
        upserted: error.result.nUpserted,
        modified: error.result.nModified,
        errors: error.writeErrors.length,
      };
    }
    throw error;
  }
};

/**
 * INSTANCE METHODS
 */

/**
 * Check if article is fresh (less than 1 hour old)
 */
newsSchema.methods.isFresh = function () {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.fetchedAt >= oneHourAgo;
};

/**
 * Soft delete article (logical deletion)
 */
newsSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

/**
 * Restore soft-deleted article
 */
newsSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

/**
 * MIDDLEWARE (Pre/Post Hooks)
 */

// Pre-save: ensure schemaVersion is set
newsSchema.pre("save", function (next) {
  if (!this.schemaVersion) {
    this.schemaVersion = 1;
  }
  next();
});

// Pre-find: exclude deleted records by default (can be overridden)
// NOTE: Commented out to allow explicit control in query methods
// newsSchema.pre(/^find/, function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

const News = mongoose.model("News", newsSchema);

export default News;
