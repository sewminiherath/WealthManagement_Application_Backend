const logger = require('../utils/logger');

/**
 * Cache Service
 * 
 * Simple in-memory caching for recommendations to reduce AWS Bedrock API calls
 * Implements TTL (Time To Live) for cache expiration
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.maxCacheSize = 100; // Maximum number of cached items
  }

  /**
   * Generate cache key for financial data
   * @param {string} type - Recommendation type
   * @param {Object} data - Financial data
   * @returns {string} - Cache key
   */
  generateCacheKey(type, data) {
    // Create a hash of the financial data for cache key
    const dataHash = this.hashFinancialData(data);
    return `${type}_${dataHash}`;
  }

  /**
   * Hash financial data to create consistent cache keys
   * @param {Object} data - Financial data
   * @returns {string} - Hash string
   */
  hashFinancialData(data) {
    const keyData = {
      totalAssets: data.totalAssets || 0,
      totalLiabilities: data.totalLiabilities || 0,
      totalCreditCardDebt: data.totalCreditCardDebt || 0,
      monthlyIncome: data.monthlyIncome || 0,
      netWorth: data.netWorth || 0,
      creditUtilization: data.creditUtilization || 0
    };
    
    return JSON.stringify(keyData);
  }

  /**
   * Get cached recommendation
   * @param {string} key - Cache key
   * @returns {Object|null} - Cached data or null
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      logger.info('Cache expired and removed', { key });
      return null;
    }

    logger.info('Cache hit', { key, age: Date.now() - cached.createdAt });
    return cached.data;
  }

  /**
   * Set cached recommendation
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, data, ttl = this.defaultTTL) {
    // Check cache size limit
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldest();
    }

    const cached = {
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl
    };

    this.cache.set(key, cached);
    logger.info('Data cached', { 
      key, 
      ttl: ttl / 1000 / 60, // TTL in minutes
      cacheSize: this.cache.size 
    });
  }

  /**
   * Remove specific cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    logger.info('Cache entry deleted', { key });
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      maxSize: this.maxCacheSize,
      defaultTTL: this.defaultTTL / 1000 / 60 // TTL in minutes
    };
  }

  /**
   * Evict oldest cache entry
   */
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, cached] of this.cache.entries()) {
      if (cached.createdAt < oldestTime) {
        oldestTime = cached.createdAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.info('Evicted oldest cache entry', { key: oldestKey });
    }
  }

  /**
   * Clean expired entries
   */
  cleanExpired() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      logger.info('Cleaned expired cache entries', { count: expiredKeys.length });
    }
  }

  /**
   * Get recommendation with caching
   * @param {string} type - Recommendation type
   * @param {Object} financialData - Financial data
   * @param {Function} generator - Function to generate recommendation if not cached
   * @param {number} ttl - Cache TTL in milliseconds
   * @returns {Promise<Object>} - Recommendation data
   */
  async getRecommendation(type, financialData, generator, ttl = this.defaultTTL) {
    const cacheKey = this.generateCacheKey(type, financialData);
    
    // Try to get from cache first
    const cached = this.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        fromCache: true,
        cacheKey
      };
    }

    // Generate new recommendation
    logger.info('Generating new recommendation', { type, cacheKey });
    const recommendation = await generator();
    
    // Cache the result
    this.set(cacheKey, recommendation, ttl);
    
    return {
      ...recommendation,
      fromCache: false,
      cacheKey
    };
  }

  /**
   * Invalidate cache for specific type
   * @param {string} type - Recommendation type
   */
  invalidateType(type) {
    const keysToDelete = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${type}_`)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      logger.info('Invalidated cache for type', { type, count: keysToDelete.length });
    }
  }
}

module.exports = new CacheService();



