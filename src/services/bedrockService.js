const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { bedrockClient, CLAUDE_MODEL_ID, DEFAULT_MODEL_PARAMS } = require('../config/bedrock');
const logger = require('../utils/logger');

/**
 * AWS Bedrock Service
 * 
 * Handles communication with Claude 3 Haiku model
 * Provides methods for generating financial recommendations
 */

class BedrockService {
  constructor() {
    this.client = bedrockClient;
    this.modelId = CLAUDE_MODEL_ID;
  }

  /**
   * Generate financial recommendations using Claude 3 Haiku
   * @param {string} prompt - The prompt to send to Claude
   * @param {Object} options - Optional parameters for the model
   * @returns {Promise<Object>} - The response from Claude
   */
  async generateRecommendations(prompt, options = {}) {
    try {
      const modelParams = {
        ...DEFAULT_MODEL_PARAMS,
        ...options,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      };

      const command = new InvokeModelCommand({
        modelId: this.modelId,
        body: JSON.stringify(modelParams),
        contentType: 'application/json',
        accept: 'application/json'
      });

      logger.info('Sending request to Claude 3 Sonnet', {
        modelId: this.modelId,
        promptLength: prompt.length
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(response.body);

      logger.info('Received response from Claude 3 Sonnet', {
        responseLength: responseBody.content?.[0]?.text?.length || 0
      });

      return {
        success: true,
        content: responseBody.content?.[0]?.text || 'No response generated',
        usage: responseBody.usage || {},
        model: this.modelId
      };

    } catch (error) {
      logger.error('Error generating recommendations with Bedrock', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        content: 'Unable to generate recommendations at this time. Please try again later.'
      };
    }
  }

  /**
   * Generate budget analysis recommendations
   * @param {Object} financialData - User's financial data
   * @returns {Promise<Object>} - Budget recommendations
   */
  async getBudgetAnalysis(financialData) {
    const prompt = this.buildBudgetAnalysisPrompt(financialData);
    return await this.generateRecommendations(prompt);
  }

  /**
   * Generate investment recommendations
   * @param {Object} financialData - User's financial data
   * @returns {Promise<Object>} - Investment recommendations
   */
  async getInvestmentRecommendations(financialData) {
    const prompt = this.buildInvestmentPrompt(financialData);
    return await this.generateRecommendations(prompt);
  }

  /**
   * Generate debt management recommendations
   * @param {Object} financialData - User's financial data
   * @returns {Promise<Object>} - Debt management recommendations
   */
  async getDebtManagementRecommendations(financialData) {
    const prompt = this.buildDebtManagementPrompt(financialData);
    return await this.generateRecommendations(prompt);
  }

  /**
   * Generate credit optimization recommendations
   * @param {Object} financialData - User's financial data
   * @returns {Promise<Object>} - Credit optimization recommendations
   */
  async getCreditOptimizationRecommendations(financialData) {
    const prompt = this.buildCreditOptimizationPrompt(financialData);
    return await this.generateRecommendations(prompt);
  }

  /**
   * Generate general financial health recommendations
   * @param {Object} financialData - User's financial data
   * @returns {Promise<Object>} - General financial recommendations
   */
  async getGeneralRecommendations(financialData) {
    const prompt = this.buildGeneralPrompt(financialData);
    return await this.generateRecommendations(prompt);
  }

  /**
   * Build budget analysis prompt
   * @param {Object} data - Financial data
   * @returns {string} - Formatted prompt
   */
  buildBudgetAnalysisPrompt(data) {
    return `
You are a financial advisor analyzing a user's budget and spending patterns. Based on the following financial data, provide specific, actionable budget recommendations:

FINANCIAL DATA:
- Total Assets: $${data.totalAssets || 0}
- Total Income (Monthly): $${data.monthlyIncome || 0}
- Total Liabilities: $${data.totalLiabilities || 0}
- Credit Card Debt: $${data.creditCardDebt || 0}
- Net Worth: $${data.netWorth || 0}

ASSET BREAKDOWN:
${data.assets?.map(asset => `- ${asset.assetsName}: $${asset.currentValue} (${asset.assetsType})`).join('\n') || 'No assets recorded'}

INCOME BREAKDOWN:
${data.income?.map(inc => `- ${inc.incomeSource}: $${inc.amount} (${inc.frequency})`).join('\n') || 'No income recorded'}

LIABILITIES:
${data.liabilities?.map(liab => `- ${liab.liabilityName}: $${liab.outstandingAmount} (${liab.type}, ${liab.interestRate}% APR)`).join('\n') || 'No liabilities recorded'}

CREDIT CARDS:
${data.creditCards?.map(card => `- ${card.cardName} (${card.bankName}): $${card.outstandingBalance}/$${card.creditLimit} (${card.interestRate}% APR)`).join('\n') || 'No credit cards recorded'}

Please provide:
1. Budget analysis and spending recommendations
2. Areas where expenses can be reduced
3. Suggested emergency fund amount
4. Monthly savings targets
5. Specific actionable steps

Keep recommendations practical, specific, and easy to understand. Focus on immediate actions the user can take.
    `.trim();
  }

  /**
   * Build investment recommendations prompt
   * @param {Object} data - Financial data
   * @returns {string} - Formatted prompt
   */
  buildInvestmentPrompt(data) {
    return `
You are a financial advisor providing investment recommendations. Based on the following financial data, suggest appropriate investment strategies:

FINANCIAL PROFILE:
- Net Worth: $${data.netWorth || 0}
- Total Assets: $${data.totalAssets || 0}
- Monthly Income: $${data.monthlyIncome || 0}
- Age/Experience: General adult (assume moderate risk tolerance)

CURRENT ASSETS:
${data.assets?.map(asset => `- ${asset.assetsName}: $${asset.currentValue} (${asset.assetsType}, ${asset.interestRate}% return)`).join('\n') || 'No current investments'}

DEBT SITUATION:
- Total Debt: $${data.totalLiabilities || 0}
- Credit Card Debt: $${data.creditCardDebt || 0}

Please provide:
1. Portfolio diversification recommendations
2. Asset allocation suggestions (stocks, bonds, real estate, etc.)
3. Risk assessment and appropriate investment vehicles
4. Timeline for different investment goals
5. Specific investment options to consider
6. Emergency fund recommendations

Focus on practical, achievable investment strategies that match the user's financial situation.
    `.trim();
  }

  /**
   * Build debt management prompt
   * @param {Object} data - Financial data
   * @returns {string} - Formatted prompt
   */
  buildDebtManagementPrompt(data) {
    return `
You are a financial advisor specializing in debt management. Based on the following financial data, provide a comprehensive debt payoff strategy:

DEBT ANALYSIS:
- Total Liabilities: $${data.totalLiabilities || 0}
- Credit Card Debt: $${data.creditCardDebt || 0}
- Monthly Income: $${data.monthlyIncome || 0}

DETAILED DEBT BREAKDOWN:
${data.liabilities?.map(liab => `- ${liab.liabilityName}: $${liab.outstandingAmount} (${liab.interestRate}% APR, due ${liab.dueDate})`).join('\n') || 'No liabilities recorded'}

CREDIT CARD DETAILS:
${data.creditCards?.map(card => `- ${card.cardName}: $${card.outstandingBalance}/$${card.creditLimit} (${card.interestRate}% APR, due ${card.dueDate})`).join('\n') || 'No credit cards recorded'}

Please provide:
1. Debt payoff priority order (highest interest first, or snowball method)
2. Monthly payment recommendations for each debt
3. Timeline for debt freedom
4. Strategies to avoid accumulating more debt
5. Options for debt consolidation or refinancing
6. How to improve credit score while paying off debt

Make recommendations specific, actionable, and tailored to the user's income level.
    `.trim();
  }

  /**
   * Build credit optimization prompt
   * @param {Object} data - Financial data
   * @returns {string} - Formatted prompt
   */
  buildCreditOptimizationPrompt(data) {
    return `
You are a credit optimization specialist. Based on the following financial data, provide strategies to improve credit score and optimize credit usage:

CREDIT PROFILE:
- Total Credit Card Debt: $${data.creditCardDebt || 0}
- Available Credit: $${data.availableCredit || 0}
- Credit Utilization: ${data.creditUtilization || 0}%

CREDIT CARD DETAILS:
${data.creditCards?.map(card => `- ${card.cardName} (${card.bankName}): $${card.outstandingBalance}/$${card.creditLimit} (${card.interestRate}% APR, due ${card.dueDate})`).join('\n') || 'No credit cards recorded'}

INCOME & ASSETS:
- Monthly Income: $${data.monthlyIncome || 0}
- Total Assets: $${data.totalAssets || 0}

Please provide:
1. Credit utilization optimization strategies
2. Payment timing recommendations
3. Credit score improvement timeline
4. Credit card management best practices
5. When to apply for new credit
6. Strategies to reduce interest payments
7. Credit monitoring and maintenance tips

Focus on practical steps that can be implemented immediately to improve credit health.
    `.trim();
  }

  /**
   * Build general financial recommendations prompt
   * @param {Object} data - Financial data
   * @returns {string} - Formatted prompt
   */
  buildGeneralPrompt(data) {
    return `
You are a comprehensive financial advisor. Based on the following financial data, provide overall financial health recommendations:

FINANCIAL OVERVIEW:
- Net Worth: $${data.netWorth || 0}
- Total Assets: $${data.totalAssets || 0}
- Total Liabilities: $${data.totalLiabilities || 0}
- Monthly Income: $${data.monthlyIncome || 0}
- Credit Card Debt: $${data.creditCardDebt || 0}

ASSET PORTFOLIO:
${data.assets?.map(asset => `- ${asset.assetsName}: $${asset.currentValue} (${asset.assetsType})`).join('\n') || 'No assets recorded'}

INCOME SOURCES:
${data.income?.map(inc => `- ${inc.incomeSource}: $${inc.amount} (${inc.frequency})`).join('\n') || 'No income recorded'}

DEBT OBLIGATIONS:
${data.liabilities?.map(liab => `- ${liab.liabilityName}: $${liab.outstandingAmount} (${liab.interestRate}% APR)`).join('\n') || 'No liabilities recorded'}

Please provide:
1. Overall financial health assessment
2. Top 3 financial priorities to focus on
3. Short-term goals (next 6 months)
4. Medium-term goals (1-2 years)
5. Long-term financial planning recommendations
6. Risk management suggestions
7. Emergency fund recommendations
8. Retirement planning considerations

Provide a balanced, comprehensive financial strategy that addresses immediate needs while building for the future.
    `.trim();
  }
}

module.exports = new BedrockService();


