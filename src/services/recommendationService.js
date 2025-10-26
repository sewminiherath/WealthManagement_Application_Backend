const bedrockService = require('./bedrockService');
const dataAggregationService = require('./dataAggregationService');
const cacheService = require('./cacheService');
const promptBuilder = require('../utils/promptbuild.util');
const logger = require('../utils/logger');

/**
 * Recommendation Service
 * 
 * Unified service that orchestrates all recommendation functionality.
 * This service acts as the main interface for all recommendation operations,
 * combining data aggregation, AI processing, and caching.
 */

class RecommendationService {
  constructor() {
    this.serviceName = 'RecommendationService';
    this.version = '1.0.0';
    logger.info(`${this.serviceName} initialized`, { version: this.version });
  }

  /**
   * Get general financial recommendations
   * @param {Object} options - Optional parameters
   * @returns {Promise<Object>} Recommendation result
   */
  async getGeneralRecommendations(options = {}) {
    try {
      logger.info('Generating general financial recommendations', { options });

      // Get financial data
      const dataResult = await dataAggregationService.getAllFinancialData();
      if (!dataResult.success) {
        throw new Error(`Failed to fetch financial data: ${dataResult.error}`);
      }

      // Validate data
      const validation = promptBuilder.validateFinancialData(dataResult.data);
      if (!validation.isValid) {
        logger.warn('Financial data validation failed', { errors: validation.errors });
      }

      // Build optimized prompt
      const prompt = promptBuilder.buildGeneralPrompt(dataResult.data, {
        includeSummary: options.includeSummary !== false,
        responseFormat: options.responseFormat || 'structured',
        focusAreas: options.focusAreas || ['overall_health', 'improvement_areas', 'actionable_steps']
      });

      // Get recommendations with caching
      const recommendations = await cacheService.getRecommendation(
        'general',
        dataResult.data,
        () => bedrockService.generateRecommendations(prompt)
      );

      if (!recommendations.success) {
        throw new Error(`Failed to generate recommendations: ${recommendations.error}`);
      }

      return {
        success: true,
        data: {
          recommendations: recommendations.content,
          financialSummary: {
            totalAssets: dataResult.data.totalAssets,
            totalLiabilities: dataResult.data.totalLiabilities,
            netWorth: dataResult.data.netWorth,
            monthlyIncome: dataResult.data.monthlyIncome,
            debtToIncomeRatio: dataResult.data.debtToIncomeRatio,
            creditUtilization: dataResult.data.creditUtilization
          },
          generatedAt: new Date().toISOString(),
          model: recommendations.model,
          fromCache: recommendations.fromCache,
          promptStats: promptBuilder.getPromptStats(prompt)
        }
      };

    } catch (error) {
      logger.error('Error in getGeneralRecommendations', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to generate general recommendations'
      };
    }
  }

  /**
   * Get budget analysis and recommendations
   * @param {Object} options - Optional parameters
   * @returns {Promise<Object>} Budget analysis result
   */
  async getBudgetAnalysis(options = {}) {
    try {
      logger.info('Generating budget analysis', { options });

      const dataResult = await dataAggregationService.getAllFinancialData();
      if (!dataResult.success) {
        throw new Error(`Failed to fetch financial data: ${dataResult.error}`);
      }

      const prompt = promptBuilder.buildBudgetPrompt(dataResult.data, {
        includeIncomeAnalysis: options.includeIncomeAnalysis !== false,
        includeExpenseAnalysis: options.includeExpenseAnalysis !== false,
        includeSavingsRecommendations: options.includeSavingsRecommendations !== false,
        responseFormat: options.responseFormat || 'structured'
      });

      const recommendations = await cacheService.getRecommendation(
        'budget',
        dataResult.data,
        () => bedrockService.generateRecommendations(prompt)
      );

      if (!recommendations.success) {
        throw new Error(`Failed to generate budget analysis: ${recommendations.error}`);
      }

      return {
        success: true,
        data: {
          recommendations: recommendations.content,
          budgetMetrics: {
            monthlyIncome: dataResult.data.monthlyIncome,
            totalExpenses: dataResult.data.totalLiabilities + dataResult.data.totalCreditCardDebt,
            savingsRate: dataResult.data.monthlyIncome > 0 ? 
              ((dataResult.data.monthlyIncome - (dataResult.data.totalLiabilities + dataResult.data.totalCreditCardDebt)) / dataResult.data.monthlyIncome) * 100 : 0,
            debtToIncomeRatio: dataResult.data.debtToIncomeRatio
          },
          generatedAt: new Date().toISOString(),
          model: recommendations.model,
          fromCache: recommendations.fromCache,
          promptStats: promptBuilder.getPromptStats(prompt)
        }
      };

    } catch (error) {
      logger.error('Error in getBudgetAnalysis', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to generate budget analysis'
      };
    }
  }

  /**
   * Get investment recommendations
   * @param {Object} options - Optional parameters
   * @returns {Promise<Object>} Investment recommendations result
   */
  async getInvestmentRecommendations(options = {}) {
    try {
      logger.info('Generating investment recommendations', { options });

      const dataResult = await dataAggregationService.getAllFinancialData();
      if (!dataResult.success) {
        throw new Error(`Failed to fetch financial data: ${dataResult.error}`);
      }

      const prompt = promptBuilder.buildInvestmentPrompt(dataResult.data, {
        riskTolerance: options.riskTolerance || 'moderate',
        timeHorizon: options.timeHorizon || 'long-term',
        includeDiversification: options.includeDiversification !== false,
        responseFormat: options.responseFormat || 'structured'
      });

      const recommendations = await cacheService.getRecommendation(
        'investment',
        dataResult.data,
        () => bedrockService.generateRecommendations(prompt)
      );

      if (!recommendations.success) {
        throw new Error(`Failed to generate investment recommendations: ${recommendations.error}`);
      }

      return {
        success: true,
        data: {
          recommendations: recommendations.content,
          investmentProfile: {
            totalAssets: dataResult.data.totalAssets,
            netWorth: dataResult.data.netWorth,
            monthlyIncome: dataResult.data.monthlyIncome,
            riskTolerance: options.riskTolerance || 'moderate',
            timeHorizon: options.timeHorizon || 'long-term'
          },
          generatedAt: new Date().toISOString(),
          model: recommendations.model,
          fromCache: recommendations.fromCache,
          promptStats: promptBuilder.getPromptStats(prompt)
        }
      };

    } catch (error) {
      logger.error('Error in getInvestmentRecommendations', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to generate investment recommendations'
      };
    }
  }

  /**
   * Get debt management recommendations
   * @param {Object} options - Optional parameters
   * @returns {Promise<Object>} Debt management result
   */
  async getDebtManagementRecommendations(options = {}) {
    try {
      logger.info('Generating debt management recommendations', { options });

      const dataResult = await dataAggregationService.getAllFinancialData();
      if (!dataResult.success) {
        throw new Error(`Failed to fetch financial data: ${dataResult.error}`);
      }

      const prompt = promptBuilder.buildDebtPrompt(dataResult.data, {
        includeRepaymentStrategy: options.includeRepaymentStrategy !== false,
        includeConsolidation: options.includeConsolidation !== false,
        includeNegotiation: options.includeNegotiation !== false,
        responseFormat: options.responseFormat || 'structured'
      });

      const recommendations = await cacheService.getRecommendation(
        'debt',
        dataResult.data,
        () => bedrockService.generateRecommendations(prompt)
      );

      if (!recommendations.success) {
        throw new Error(`Failed to generate debt management recommendations: ${recommendations.error}`);
      }

      return {
        success: true,
        data: {
          recommendations: recommendations.content,
          debtMetrics: {
            totalDebt: dataResult.data.totalLiabilities + dataResult.data.totalCreditCardDebt,
            totalLiabilities: dataResult.data.totalLiabilities,
            creditCardDebt: dataResult.data.totalCreditCardDebt,
            debtToIncomeRatio: dataResult.data.debtToIncomeRatio,
            monthlyIncome: dataResult.data.monthlyIncome
          },
          generatedAt: new Date().toISOString(),
          model: recommendations.model,
          fromCache: recommendations.fromCache,
          promptStats: promptBuilder.getPromptStats(prompt)
        }
      };

    } catch (error) {
      logger.error('Error in getDebtManagementRecommendations', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to generate debt management recommendations'
      };
    }
  }

  /**
   * Get credit optimization recommendations
   * @param {Object} options - Optional parameters
   * @returns {Promise<Object>} Credit optimization result
   */
  async getCreditOptimizationRecommendations(options = {}) {
    try {
      logger.info('Generating credit optimization recommendations', { options });

      const dataResult = await dataAggregationService.getAllFinancialData();
      if (!dataResult.success) {
        throw new Error(`Failed to fetch financial data: ${dataResult.error}`);
      }

      const prompt = promptBuilder.buildCreditPrompt(dataResult.data, {
        includeUtilizationTips: options.includeUtilizationTips !== false,
        includePaymentStrategies: options.includePaymentStrategies !== false,
        includeCreditBuilding: options.includeCreditBuilding !== false,
        responseFormat: options.responseFormat || 'structured'
      });

      const recommendations = await cacheService.getRecommendation(
        'credit',
        dataResult.data,
        () => bedrockService.generateRecommendations(prompt)
      );

      if (!recommendations.success) {
        throw new Error(`Failed to generate credit optimization recommendations: ${recommendations.error}`);
      }

      return {
        success: true,
        data: {
          recommendations: recommendations.content,
          creditMetrics: {
            creditUtilization: dataResult.data.creditUtilization,
            totalCreditLimit: dataResult.data.totalCreditLimit,
            totalCreditCardDebt: dataResult.data.totalCreditCardDebt,
            availableCredit: dataResult.data.totalAvailableCredit,
            creditCards: dataResult.data.creditCards
          },
          generatedAt: new Date().toISOString(),
          model: recommendations.model,
          fromCache: recommendations.fromCache,
          promptStats: promptBuilder.getPromptStats(prompt)
        }
      };

    } catch (error) {
      logger.error('Error in getCreditOptimizationRecommendations', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to generate credit optimization recommendations'
      };
    }
  }

  /**
   * Get financial summary without AI recommendations
   * @returns {Promise<Object>} Financial summary result
   */
  async getFinancialSummary() {
    try {
      logger.info('Generating financial summary');

      const dataResult = await dataAggregationService.getAllFinancialData();
      if (!dataResult.success) {
        throw new Error(`Failed to fetch financial data: ${dataResult.error}`);
      }

      return {
        success: true,
        data: {
          summary: {
            totalAssets: dataResult.data.totalAssets,
            totalLiabilities: dataResult.data.totalLiabilities,
            totalCreditCardDebt: dataResult.data.totalCreditCardDebt,
            netWorth: dataResult.data.netWorth,
            monthlyIncome: dataResult.data.monthlyIncome,
            debtToIncomeRatio: dataResult.data.debtToIncomeRatio,
            creditUtilization: dataResult.data.creditUtilization
          },
          assets: dataResult.data.assets,
          income: dataResult.data.income,
          liabilities: dataResult.data.liabilities,
          creditCards: dataResult.data.creditCards,
          generatedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error('Error in getFinancialSummary', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to generate financial summary'
      };
    }
  }

  /**
   * Get all recommendation types in one request
   * @param {Object} options - Optional parameters
   * @returns {Promise<Object>} All recommendations result
   */
  async getAllRecommendations(options = {}) {
    try {
      logger.info('Generating all recommendation types', { options });

      // Get all recommendations in parallel
      const [
        generalResult,
        budgetResult,
        investmentResult,
        debtResult,
        creditResult
      ] = await Promise.all([
        this.getGeneralRecommendations(options.general),
        this.getBudgetAnalysis(options.budget),
        this.getInvestmentRecommendations(options.investment),
        this.getDebtManagementRecommendations(options.debt),
        this.getCreditOptimizationRecommendations(options.credit)
      ]);

      return {
        success: true,
        data: {
          general: generalResult,
          budget: budgetResult,
          investment: investmentResult,
          debt: debtResult,
          credit: creditResult,
          generatedAt: new Date().toISOString(),
          summary: {
            totalRecommendations: 5,
            successfulRecommendations: [
              generalResult.success ? 'general' : null,
              budgetResult.success ? 'budget' : null,
              investmentResult.success ? 'investment' : null,
              debtResult.success ? 'debt' : null,
              creditResult.success ? 'credit' : null
            ].filter(Boolean).length
          }
        }
      };

    } catch (error) {
      logger.error('Error in getAllRecommendations', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to generate all recommendations'
      };
    }
  }

  /**
   * Get service health and statistics
   * @returns {Object} Service health information
   */
  getServiceHealth() {
    const cacheStats = cacheService.getStats();
    
    return {
      service: this.serviceName,
      version: this.version,
      status: 'healthy',
      uptime: process.uptime(),
      cache: cacheStats,
      dependencies: {
        bedrockService: 'connected',
        dataAggregationService: 'connected',
        cacheService: 'connected',
        promptBuilder: 'connected'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear all caches
   * @returns {Object} Cache clear result
   */
  clearAllCaches() {
    try {
      cacheService.clear();
      logger.info('All caches cleared');
      
      return {
        success: true,
        message: 'All caches cleared successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error clearing caches', { error: error.message });
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to clear caches'
      };
    }
  }

  /**
   * Clear cache for specific recommendation type
   * @param {string} type - Recommendation type to clear
   * @returns {Object} Cache clear result
   */
  clearCacheByType(type) {
    try {
      cacheService.invalidateType(type);
      logger.info(`Cache cleared for type: ${type}`);
      
      return {
        success: true,
        message: `Cache cleared for type: ${type}`,
        type: type,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error clearing cache by type', { error: error.message, type });
      
      return {
        success: false,
        error: error.message,
        message: `Failed to clear cache for type: ${type}`
      };
    }
  }
}

// Export singleton instance
module.exports = new RecommendationService();

