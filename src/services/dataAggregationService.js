const Assets = require('../models/Assets');
const Income = require('../models/Income');
const Liability = require('../models/Liability');
const CreditCard = require('../models/CreditCard');
const logger = require('../utils/logger');

/**
 * Data Aggregation Service
 * 
 * Aggregates financial data from all models for recommendation system
 * Calculates financial metrics and prepares data for AI analysis
 */

class DataAggregationService {
  constructor() {
    this.models = {
      Assets,
      Income,
      Liability,
      CreditCard
    };
  }

  /**
   * Get comprehensive financial data for all users
   * @returns {Promise<Object>} - Aggregated financial data
   */
  async getAllFinancialData() {
    try {
      logger.info('Starting comprehensive financial data aggregation');

      // Fetch all data from all models
      const [assets, income, liabilities, creditCards] = await Promise.all([
        this.models.Assets.find({}).lean(),
        this.models.Income.find({}).lean(),
        this.models.Liability.find({}).lean(),
        this.models.CreditCard.find({}).lean()
      ]);

      logger.info('Financial data fetched successfully', {
        assetsCount: assets.length,
        incomeCount: income.length,
        liabilitiesCount: liabilities.length,
        creditCardsCount: creditCards.length
      });

      // Calculate aggregated metrics
      const aggregatedData = this.calculateFinancialMetrics({
        assets,
        income,
        liabilities,
        creditCards
      });

      return {
        success: true,
        data: aggregatedData,
        rawData: {
          assets,
          income,
          liabilities,
          creditCards
        }
      };

    } catch (error) {
      logger.error('Error aggregating financial data', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Get financial data for a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User's financial data
   */
  async getUserFinancialData(userId) {
    try {
      logger.info('Fetching financial data for user', { userId });

      const [assets, income, liabilities, creditCards] = await Promise.all([
        this.models.Assets.find({ createdBy: userId }).lean(),
        this.models.Income.find({ createdBy: userId }).lean(),
        this.models.Liability.find({ createdBy: userId }).lean(),
        this.models.CreditCard.find({ createdBy: userId }).lean()
      ]);

      const userData = this.calculateFinancialMetrics({
        assets,
        income,
        liabilities,
        creditCards
      });

      return {
        success: true,
        data: userData,
        rawData: {
          assets,
          income,
          liabilities,
          creditCards
        }
      };

    } catch (error) {
      logger.error('Error fetching user financial data', {
        userId,
        error: error.message
      });

      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Calculate comprehensive financial metrics
   * @param {Object} data - Raw financial data
   * @returns {Object} - Calculated metrics
   */
  calculateFinancialMetrics(data) {
    const { assets, income, liabilities, creditCards } = data;

    // Calculate totals
    const totalAssets = this.calculateTotalAssets(assets);
    const totalIncome = this.calculateTotalIncome(income);
    const totalLiabilities = this.calculateTotalLiabilities(liabilities);
    const totalCreditCardDebt = this.calculateTotalCreditCardDebt(creditCards);
    const totalAvailableCredit = this.calculateTotalAvailableCredit(creditCards);

    // Calculate derived metrics
    const netWorth = totalAssets - totalLiabilities - totalCreditCardDebt;
    const monthlyIncome = this.calculateMonthlyIncome(income);
    const creditUtilization = this.calculateCreditUtilization(creditCards);
    const debtToIncomeRatio = monthlyIncome > 0 ? (totalLiabilities + totalCreditCardDebt) / monthlyIncome : 0;

    // Asset breakdown by type
    const assetBreakdown = this.categorizeAssets(assets);
    
    // Income breakdown by source
    const incomeBreakdown = this.categorizeIncome(income);
    
    // Liability breakdown by type
    const liabilityBreakdown = this.categorizeLiabilities(liabilities);

    return {
      // Totals
      totalAssets,
      totalIncome,
      totalLiabilities,
      totalCreditCardDebt,
      totalAvailableCredit,
      netWorth,
      monthlyIncome,
      
      // Ratios and percentages
      creditUtilization,
      debtToIncomeRatio,
      
      // Breakdowns
      assetBreakdown,
      incomeBreakdown,
      liabilityBreakdown,
      
      // Raw data for detailed analysis
      assets,
      income,
      liabilities,
      creditCards,
      
      // Calculated insights
      insights: this.generateFinancialInsights({
        netWorth,
        monthlyIncome,
        creditUtilization,
        debtToIncomeRatio,
        totalAssets,
        totalLiabilities,
        totalCreditCardDebt
      })
    };
  }

  /**
   * Calculate total assets value
   * @param {Array} assets - Assets array
   * @returns {number} - Total assets value
   */
  calculateTotalAssets(assets) {
    return assets.reduce((total, asset) => total + (asset.currentValue || 0), 0);
  }

  /**
   * Calculate total income
   * @param {Array} income - Income array
   * @returns {number} - Total income
   */
  calculateTotalIncome(income) {
    return income.reduce((total, inc) => total + (inc.amount || 0), 0);
  }

  /**
   * Calculate total liabilities
   * @param {Array} liabilities - Liabilities array
   * @returns {number} - Total liabilities
   */
  calculateTotalLiabilities(liabilities) {
    return liabilities.reduce((total, liab) => total + (liab.outstandingAmount || 0), 0);
  }

  /**
   * Calculate total credit card debt
   * @param {Array} creditCards - Credit cards array
   * @returns {number} - Total credit card debt
   */
  calculateTotalCreditCardDebt(creditCards) {
    return creditCards.reduce((total, card) => total + (card.outstandingBalance || 0), 0);
  }

  /**
   * Calculate total available credit
   * @param {Array} creditCards - Credit cards array
   * @returns {number} - Total available credit
   */
  calculateTotalAvailableCredit(creditCards) {
    return creditCards.reduce((total, card) => {
      const available = (card.creditLimit || 0) - (card.outstandingBalance || 0);
      return total + Math.max(0, available);
    }, 0);
  }

  /**
   * Calculate monthly income from all sources
   * @param {Array} income - Income array
   * @returns {number} - Monthly income
   */
  calculateMonthlyIncome(income) {
    return income.reduce((total, inc) => {
      const amount = inc.amount || 0;
      const frequency = inc.frequency || 'monthly';
      
      // Convert to monthly equivalent
      switch (frequency) {
        case 'daily':
          return total + (amount * 30);
        case 'weekly':
          return total + (amount * 4.33);
        case 'bi-weekly':
          return total + (amount * 2.17);
        case 'monthly':
          return total + amount;
        case 'quarterly':
          return total + (amount / 3);
        case 'yearly':
          return total + (amount / 12);
        case 'one-time':
          return total + (amount / 12); // Spread one-time income over 12 months
        default:
          return total + amount;
      }
    }, 0);
  }

  /**
   * Calculate credit utilization percentage
   * @param {Array} creditCards - Credit cards array
   * @returns {number} - Credit utilization percentage
   */
  calculateCreditUtilization(creditCards) {
    const totalDebt = this.calculateTotalCreditCardDebt(creditCards);
    const totalLimit = creditCards.reduce((total, card) => total + (card.creditLimit || 0), 0);
    
    return totalLimit > 0 ? (totalDebt / totalLimit) * 100 : 0;
  }

  /**
   * Categorize assets by type
   * @param {Array} assets - Assets array
   * @returns {Object} - Asset breakdown by type
   */
  categorizeAssets(assets) {
    const breakdown = {};
    
    assets.forEach(asset => {
      const type = asset.assetsType || 'other';
      if (!breakdown[type]) {
        breakdown[type] = {
          count: 0,
          totalValue: 0,
          assets: []
        };
      }
      
      breakdown[type].count++;
      breakdown[type].totalValue += asset.currentValue || 0;
      breakdown[type].assets.push(asset);
    });
    
    return breakdown;
  }

  /**
   * Categorize income by source
   * @param {Array} income - Income array
   * @returns {Object} - Income breakdown by source
   */
  categorizeIncome(income) {
    const breakdown = {};
    
    income.forEach(inc => {
      const source = inc.incomeSource || 'other';
      if (!breakdown[source]) {
        breakdown[source] = {
          count: 0,
          totalAmount: 0,
          frequency: inc.frequency,
          income: []
        };
      }
      
      breakdown[source].count++;
      breakdown[source].totalAmount += inc.amount || 0;
      breakdown[source].income.push(inc);
    });
    
    return breakdown;
  }

  /**
   * Categorize liabilities by type
   * @param {Array} liabilities - Liabilities array
   * @returns {Object} - Liability breakdown by type
   */
  categorizeLiabilities(liabilities) {
    const breakdown = {};
    
    liabilities.forEach(liab => {
      const type = liab.type || 'other';
      if (!breakdown[type]) {
        breakdown[type] = {
          count: 0,
          totalAmount: 0,
          liabilities: []
        };
      }
      
      breakdown[type].count++;
      breakdown[type].totalAmount += liab.outstandingAmount || 0;
      breakdown[type].liabilities.push(liab);
    });
    
    return breakdown;
  }

  /**
   * Generate financial insights based on calculated metrics
   * @param {Object} metrics - Financial metrics
   * @returns {Array} - Array of insights
   */
  generateFinancialInsights(metrics) {
    const insights = [];
    
    // Net worth insights
    if (metrics.netWorth > 0) {
      insights.push({
        type: 'positive',
        category: 'net_worth',
        message: `Positive net worth of $${metrics.netWorth.toLocaleString()} indicates healthy financial position`
      });
    } else if (metrics.netWorth < 0) {
      insights.push({
        type: 'warning',
        category: 'net_worth',
        message: `Negative net worth of $${Math.abs(metrics.netWorth).toLocaleString()} requires immediate attention`
      });
    }

    // Credit utilization insights
    if (metrics.creditUtilization > 30) {
      insights.push({
        type: 'warning',
        category: 'credit_utilization',
        message: `High credit utilization at ${metrics.creditUtilization.toFixed(1)}% - aim for under 30%`
      });
    } else if (metrics.creditUtilization <= 10) {
      insights.push({
        type: 'positive',
        category: 'credit_utilization',
        message: `Excellent credit utilization at ${metrics.creditUtilization.toFixed(1)}%`
      });
    }

    // Debt-to-income ratio insights
    if (metrics.debtToIncomeRatio > 0.4) {
      insights.push({
        type: 'warning',
        category: 'debt_to_income',
        message: `High debt-to-income ratio of ${(metrics.debtToIncomeRatio * 100).toFixed(1)}% - consider debt reduction`
      });
    }

    // Emergency fund insights
    const emergencyFundTarget = metrics.monthlyIncome * 6;
    if (metrics.totalAssets < emergencyFundTarget) {
      insights.push({
        type: 'recommendation',
        category: 'emergency_fund',
        message: `Consider building emergency fund of $${emergencyFundTarget.toLocaleString()} (6 months expenses)`
      });
    }

    return insights;
  }
}

module.exports = new DataAggregationService();



