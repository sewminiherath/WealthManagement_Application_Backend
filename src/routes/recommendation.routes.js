const express = require('express');
const router = express.Router();
const {
  getGeneralRecommendations,
  getBudgetAnalysis,
  getInvestmentRecommendations,
  getDebtManagementRecommendations,
  getCreditOptimizationRecommendations,
  getFinancialSummary,
  getAllRecommendations
} = require('../controllers/recommendation.controller');
const cacheService = require('../services/cacheService');

/**
 * Recommendation Routes
 * 
 * API endpoints for AI-powered financial recommendations
 * Uses AWS Bedrock Claude 3 Sonnet for intelligent analysis
 */

/**
 * @route   GET /api/recommendations/general
 * @desc    Get general financial health recommendations
 * @access  Public
 */
router.get('/general', getGeneralRecommendations);

/**
 * @route   GET /api/recommendations/budget
 * @desc    Get budget analysis and spending recommendations
 * @access  Public
 */
router.get('/budget', getBudgetAnalysis);

/**
 * @route   GET /api/recommendations/investment
 * @desc    Get investment strategy recommendations
 * @access  Public
 */
router.get('/investment', getInvestmentRecommendations);

/**
 * @route   GET /api/recommendations/debt
 * @desc    Get debt management and payoff recommendations
 * @access  Public
 */
router.get('/debt', getDebtManagementRecommendations);

/**
 * @route   GET /api/recommendations/credit
 * @desc    Get credit optimization recommendations
 * @access  Public
 */
router.get('/credit', getCreditOptimizationRecommendations);

/**
 * @route   GET /api/recommendations/summary
 * @desc    Get financial summary and metrics
 * @access  Public
 */
router.get('/summary', getFinancialSummary);

/**
 * @route   GET /api/recommendations/all
 * @desc    Get all recommendation types in one request
 * @access  Public
 */
router.get('/all', getAllRecommendations);

/**
 * @route   GET /api/recommendations/cache/stats
 * @desc    Get cache statistics
 * @access  Public
 */
router.get('/cache/stats', (req, res) => {
  try {
    const stats = cacheService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics',
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/recommendations/cache
 * @desc    Clear all cache entries
 * @access  Public
 */
router.delete('/cache', (req, res) => {
  try {
    cacheService.clear();
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/recommendations/cache/:type
 * @desc    Clear cache for specific recommendation type
 * @access  Public
 */
router.delete('/cache/:type', (req, res) => {
  try {
    const { type } = req.params;
    cacheService.invalidateType(type);
    res.json({
      success: true,
      message: `Cache cleared for type: ${type}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache for type',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/recommendations
 * @desc    Get recommendation system information
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Financial Recommendation System',
    version: '1.0.0',
    poweredBy: 'AWS Bedrock Claude 3 Sonnet',
    endpoints: {
      general: '/api/recommendations/general',
      budget: '/api/recommendations/budget',
      investment: '/api/recommendations/investment',
      debt: '/api/recommendations/debt',
      credit: '/api/recommendations/credit',
      summary: '/api/recommendations/summary',
      all: '/api/recommendations/all',
      cacheStats: '/api/recommendations/cache/stats',
      clearCache: 'DELETE /api/recommendations/cache',
      clearCacheType: 'DELETE /api/recommendations/cache/:type'
    },
    features: [
      'AI-powered financial analysis',
      'Personalized recommendations',
      'Budget optimization suggestions',
      'Investment strategy guidance',
      'Debt management strategies',
      'Credit optimization tips',
      'Comprehensive financial insights'
    ],
    dataSources: [
      'Assets (savings, investments, property, etc.)',
      'Income (salary, freelance, investment returns)',
      'Liabilities (loans, mortgages, personal loans)',
      'Credit Cards (balances, limits, interest rates)'
    ]
  });
});

module.exports = router;
