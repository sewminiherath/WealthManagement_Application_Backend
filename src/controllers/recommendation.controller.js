const bedrockService = require('../services/bedrockService');
const dataAggregationService = require('../services/dataAggregationService');
const cacheService = require('../services/cacheService');
const logger = require('../utils/logger');

/**
 * Recommendation Controller
 * 
 * Handles all recommendation-related API endpoints
 * Integrates data aggregation with AI-powered recommendations
 */

/**
 * Get general financial recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getGeneralRecommendations = async (req, res) => {
  try {
    logger.info('Generating general financial recommendations');

    // Get aggregated financial data
    const dataResult = await dataAggregationService.getAllFinancialData();
    
    if (!dataResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch financial data',
        message: dataResult.error
      });
    }

    // Generate recommendations using Claude with caching
    const recommendations = await cacheService.getRecommendation(
      'general',
      dataResult.data,
      () => bedrockService.getGeneralRecommendations(dataResult.data)
    );

    if (!recommendations.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations',
        message: recommendations.error
      });
    }

    res.json({
      success: true,
      data: {
        recommendations: recommendations.content,
        financialSummary: {
          netWorth: dataResult.data.netWorth,
          totalAssets: dataResult.data.totalAssets,
          totalLiabilities: dataResult.data.totalLiabilities,
          monthlyIncome: dataResult.data.monthlyIncome,
          creditUtilization: dataResult.data.creditUtilization
        },
        insights: dataResult.data.insights,
        generatedAt: new Date().toISOString(),
        model: recommendations.model,
        fromCache: recommendations.fromCache
      }
    });

  } catch (error) {
    logger.error('Error in getGeneralRecommendations', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate recommendations'
    });
  }
};

/**
 * Get budget analysis recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBudgetAnalysis = async (req, res) => {
  try {
    logger.info('Generating budget analysis recommendations');

    const dataResult = await dataAggregationService.getAllFinancialData();
    
    if (!dataResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch financial data',
        message: dataResult.error
      });
    }

    const recommendations = await cacheService.getRecommendation(
      'budget',
      dataResult.data,
      () => bedrockService.getBudgetAnalysis(dataResult.data)
    );

    if (!recommendations.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate budget analysis',
        message: recommendations.error
      });
    }

    res.json({
      success: true,
      data: {
        recommendations: recommendations.content,
        budgetMetrics: {
          monthlyIncome: dataResult.data.monthlyIncome,
          totalAssets: dataResult.data.totalAssets,
          totalLiabilities: dataResult.data.totalLiabilities,
          creditCardDebt: dataResult.data.totalCreditCardDebt,
          debtToIncomeRatio: dataResult.data.debtToIncomeRatio
        },
        generatedAt: new Date().toISOString(),
        model: recommendations.model,
        fromCache: recommendations.fromCache
      }
    });

  } catch (error) {
    logger.error('Error in getBudgetAnalysis', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate budget analysis'
    });
  }
};

/**
 * Get investment recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInvestmentRecommendations = async (req, res) => {
  try {
    logger.info('Generating investment recommendations');

    const dataResult = await dataAggregationService.getAllFinancialData();
    
    if (!dataResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch financial data',
        message: dataResult.error
      });
    }

    const recommendations = await cacheService.getRecommendation(
      'investment',
      dataResult.data,
      () => bedrockService.getInvestmentRecommendations(dataResult.data)
    );

    if (!recommendations.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate investment recommendations',
        message: recommendations.error
      });
    }

    res.json({
      success: true,
      data: {
        recommendations: recommendations.content,
        investmentProfile: {
          totalAssets: dataResult.data.totalAssets,
          assetBreakdown: dataResult.data.assetBreakdown,
          netWorth: dataResult.data.netWorth,
          monthlyIncome: dataResult.data.monthlyIncome
        },
        generatedAt: new Date().toISOString(),
        model: recommendations.model,
        fromCache: recommendations.fromCache
      }
    });

  } catch (error) {
    logger.error('Error in getInvestmentRecommendations', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate investment recommendations'
    });
  }
};

/**
 * Get debt management recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDebtManagementRecommendations = async (req, res) => {
  try {
    logger.info('Generating debt management recommendations');

    const dataResult = await dataAggregationService.getAllFinancialData();
    
    if (!dataResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch financial data',
        message: dataResult.error
      });
    }

    const recommendations = await cacheService.getRecommendation(
      'debt',
      dataResult.data,
      () => bedrockService.getDebtManagementRecommendations(dataResult.data)
    );

    if (!recommendations.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate debt management recommendations',
        message: recommendations.error
      });
    }

    res.json({
      success: true,
      data: {
        recommendations: recommendations.content,
        debtProfile: {
          totalLiabilities: dataResult.data.totalLiabilities,
          creditCardDebt: dataResult.data.totalCreditCardDebt,
          totalDebt: dataResult.data.totalLiabilities + dataResult.data.totalCreditCardDebt,
          liabilityBreakdown: dataResult.data.liabilityBreakdown,
          monthlyIncome: dataResult.data.monthlyIncome,
          debtToIncomeRatio: dataResult.data.debtToIncomeRatio
        },
        generatedAt: new Date().toISOString(),
        model: recommendations.model,
        fromCache: recommendations.fromCache
      }
    });

  } catch (error) {
    logger.error('Error in getDebtManagementRecommendations', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate debt management recommendations'
    });
  }
};

/**
 * Get credit optimization recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCreditOptimizationRecommendations = async (req, res) => {
  try {
    logger.info('Generating credit optimization recommendations');

    const dataResult = await dataAggregationService.getAllFinancialData();
    
    if (!dataResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch financial data',
        message: dataResult.error
      });
    }

    const recommendations = await cacheService.getRecommendation(
      'credit',
      dataResult.data,
      () => bedrockService.getCreditOptimizationRecommendations(dataResult.data)
    );

    if (!recommendations.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate credit optimization recommendations',
        message: recommendations.error
      });
    }

    res.json({
      success: true,
      data: {
        recommendations: recommendations.content,
        creditProfile: {
          creditCardDebt: dataResult.data.totalCreditCardDebt,
          availableCredit: dataResult.data.totalAvailableCredit,
          creditUtilization: dataResult.data.creditUtilization,
          creditCards: dataResult.data.creditCards
        },
        generatedAt: new Date().toISOString(),
        model: recommendations.model,
        fromCache: recommendations.fromCache
      }
    });

  } catch (error) {
    logger.error('Error in getCreditOptimizationRecommendations', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate credit optimization recommendations'
    });
  }
};

/**
 * Get financial summary and metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFinancialSummary = async (req, res) => {
  try {
    logger.info('Generating financial summary');

    const dataResult = await dataAggregationService.getAllFinancialData();
    
    if (!dataResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch financial data',
        message: dataResult.error
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          netWorth: dataResult.data.netWorth,
          totalAssets: dataResult.data.totalAssets,
          totalLiabilities: dataResult.data.totalLiabilities,
          totalCreditCardDebt: dataResult.data.totalCreditCardDebt,
          monthlyIncome: dataResult.data.monthlyIncome,
          creditUtilization: dataResult.data.creditUtilization,
          debtToIncomeRatio: dataResult.data.debtToIncomeRatio
        },
        breakdowns: {
          assets: dataResult.data.assetBreakdown,
          income: dataResult.data.incomeBreakdown,
          liabilities: dataResult.data.liabilityBreakdown
        },
        insights: dataResult.data.insights,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error in getFinancialSummary', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate financial summary'
    });
  }
};

/**
 * Get all recommendation types in one request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllRecommendations = async (req, res) => {
  try {
    logger.info('Generating all recommendation types');

    const dataResult = await dataAggregationService.getAllFinancialData();
    
    if (!dataResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch financial data',
        message: dataResult.error
      });
    }

    // Generate all types of recommendations in parallel
    const [
      generalRecs,
      budgetRecs,
      investmentRecs,
      debtRecs,
      creditRecs
    ] = await Promise.all([
      bedrockService.getGeneralRecommendations(dataResult.data),
      bedrockService.getBudgetAnalysis(dataResult.data),
      bedrockService.getInvestmentRecommendations(dataResult.data),
      bedrockService.getDebtManagementRecommendations(dataResult.data),
      bedrockService.getCreditOptimizationRecommendations(dataResult.data)
    ]);

    res.json({
      success: true,
      data: {
        general: {
          recommendations: generalRecs.content,
          success: generalRecs.success
        },
        budget: {
          recommendations: budgetRecs.content,
          success: budgetRecs.success
        },
        investment: {
          recommendations: investmentRecs.content,
          success: investmentRecs.success
        },
        debtManagement: {
          recommendations: debtRecs.content,
          success: debtRecs.success
        },
        creditOptimization: {
          recommendations: creditRecs.content,
          success: creditRecs.success
        },
        financialSummary: {
          netWorth: dataResult.data.netWorth,
          totalAssets: dataResult.data.totalAssets,
          totalLiabilities: dataResult.data.totalLiabilities,
          monthlyIncome: dataResult.data.monthlyIncome,
          creditUtilization: dataResult.data.creditUtilization
        },
        insights: dataResult.data.insights,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error in getAllRecommendations', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate recommendations'
    });
  }
};

module.exports = {
  getGeneralRecommendations,
  getBudgetAnalysis,
  getInvestmentRecommendations,
  getDebtManagementRecommendations,
  getCreditOptimizationRecommendations,
  getFinancialSummary,
  getAllRecommendations
};
