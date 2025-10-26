const logger = require('./logger');

/**
 * Prompt Building Utilities
 * 
 * This utility provides functions for building, formatting, and optimizing
 * prompts for the AWS Bedrock Claude 3 Sonnet recommendation system.
 */

class PromptBuilder {
  constructor() {
    this.systemPrompts = {
      financialAdvisor: "You are an AI financial advisor with expertise in personal finance, investment strategies, debt management, and credit optimization.",
      budgetAnalyst: "You are a professional budget analyst specializing in expense optimization and savings strategies.",
      investmentAdvisor: "You are a certified investment advisor with deep knowledge of portfolio management and risk assessment.",
      debtCounselor: "You are a debt management specialist focused on helping people reduce debt and improve financial health.",
      creditSpecialist: "You are a credit optimization expert with knowledge of credit scores, utilization, and improvement strategies."
    };

    this.responseFormats = {
      structured: "Provide your response in a structured format with clear sections and actionable recommendations.",
      bulletPoints: "Format your response as bullet points for easy reading.",
      numbered: "Provide numbered recommendations with clear priorities.",
      conversational: "Respond in a conversational, friendly tone while maintaining professionalism."
    };
  }

  /**
   * Build a general financial recommendation prompt
   * @param {Object} financialData - Aggregated financial data
   * @param {Object} options - Prompt options
   * @returns {string} Formatted prompt
   */
  buildGeneralPrompt(financialData, options = {}) {
    const {
      includeSummary = true,
      responseFormat = 'structured',
      focusAreas = ['overall_health', 'improvement_areas', 'actionable_steps']
    } = options;

    let prompt = `${this.systemPrompts.financialAdvisor}\n\n`;
    
    if (includeSummary) {
      prompt += this._buildFinancialSummary(financialData);
    }

    prompt += `\nBased on this comprehensive financial data, provide general, actionable financial recommendations.\n`;
    prompt += `Focus on overall financial health, potential areas for improvement, and general advice.\n\n`;

    if (focusAreas.includes('overall_health')) {
      prompt += `- Analyze the user's overall financial health\n`;
    }
    if (focusAreas.includes('improvement_areas')) {
      prompt += `- Identify specific areas for improvement\n`;
    }
    if (focusAreas.includes('actionable_steps')) {
      prompt += `- Provide 3-5 key actionable recommendations\n`;
    }

    prompt += `\n${this.responseFormats[responseFormat]}`;

    return this._optimizePrompt(prompt);
  }

  /**
   * Build a budget analysis prompt
   * @param {Object} financialData - Aggregated financial data
   * @param {Object} options - Prompt options
   * @returns {string} Formatted prompt
   */
  buildBudgetPrompt(financialData, options = {}) {
    const {
      includeIncomeAnalysis = true,
      includeExpenseAnalysis = true,
      includeSavingsRecommendations = true,
      responseFormat = 'structured'
    } = options;

    let prompt = `${this.systemPrompts.budgetAnalyst}\n\n`;
    prompt += this._buildFinancialSummary(financialData);

    prompt += `\nAnalyze the user's budget and provide detailed recommendations:\n\n`;

    if (includeIncomeAnalysis) {
      prompt += `- Income Analysis: Evaluate income sources and stability\n`;
    }
    if (includeExpenseAnalysis) {
      prompt += `- Expense Analysis: Identify spending patterns and optimization opportunities\n`;
    }
    if (includeSavingsRecommendations) {
      prompt += `- Savings Strategy: Suggest ways to increase savings rate\n`;
    }

    prompt += `\nProvide specific, actionable budgeting strategies and spending optimization tips.\n`;
    prompt += `${this.responseFormats[responseFormat]}`;

    return this._optimizePrompt(prompt);
  }

  /**
   * Build an investment recommendation prompt
   * @param {Object} financialData - Aggregated financial data
   * @param {Object} options - Prompt options
   * @returns {string} Formatted prompt
   */
  buildInvestmentPrompt(financialData, options = {}) {
    const {
      riskTolerance = 'moderate',
      timeHorizon = 'long-term',
      includeDiversification = true,
      responseFormat = 'structured'
    } = options;

    let prompt = `${this.systemPrompts.investmentAdvisor}\n\n`;
    prompt += this._buildFinancialSummary(financialData);

    prompt += `\nBased on the user's financial profile, provide personalized investment recommendations:\n\n`;
    prompt += `- Risk Tolerance: ${riskTolerance}\n`;
    prompt += `- Time Horizon: ${timeHorizon}\n`;
    prompt += `- Current Assets: $${financialData.totalAssets.toLocaleString()}\n`;
    prompt += `- Net Worth: $${financialData.netWorth.toLocaleString()}\n\n`;

    if (includeDiversification) {
      prompt += `- Diversification Strategy: Suggest asset allocation and diversification\n`;
    }
    prompt += `- Investment Vehicles: Recommend suitable investment options\n`;
    prompt += `- Risk Management: Address risk factors and mitigation strategies\n\n`;

    prompt += `Provide 2-3 specific investment recommendations with rationale.\n`;
    prompt += `${this.responseFormats[responseFormat]}`;

    return this._optimizePrompt(prompt);
  }

  /**
   * Build a debt management prompt
   * @param {Object} financialData - Aggregated financial data
   * @param {Object} options - Prompt options
   * @returns {string} Formatted prompt
   */
  buildDebtPrompt(financialData, options = {}) {
    const {
      includeRepaymentStrategy = true,
      includeConsolidation = true,
      includeNegotiation = true,
      responseFormat = 'structured'
    } = options;

    let prompt = `${this.systemPrompts.debtCounselor}\n\n`;
    prompt += this._buildFinancialSummary(financialData);

    prompt += `\nAnalyze the user's debt situation and provide actionable debt management strategies:\n\n`;

    if (includeRepaymentStrategy) {
      prompt += `- Repayment Strategy: Suggest debt payoff methods (snowball, avalanche, etc.)\n`;
    }
    if (includeConsolidation) {
      prompt += `- Debt Consolidation: Evaluate consolidation opportunities\n`;
    }
    if (includeNegotiation) {
      prompt += `- Interest Rate Negotiation: Tips for reducing interest rates\n`;
    }

    prompt += `- Payment Optimization: Strategies to accelerate debt payoff\n`;
    prompt += `- Budget Allocation: How much to allocate to debt vs. savings\n\n`;

    prompt += `Provide 2-3 specific debt management recommendations with clear action steps.\n`;
    prompt += `${this.responseFormats[responseFormat]}`;

    return this._optimizePrompt(prompt);
  }

  /**
   * Build a credit optimization prompt
   * @param {Object} financialData - Aggregated financial data
   * @param {Object} options - Prompt options
   * @returns {string} Formatted prompt
   */
  buildCreditPrompt(financialData, options = {}) {
    const {
      includeUtilizationTips = true,
      includePaymentStrategies = true,
      includeCreditBuilding = true,
      responseFormat = 'structured'
    } = options;

    let prompt = `${this.systemPrompts.creditSpecialist}\n\n`;
    prompt += this._buildFinancialSummary(financialData);

    prompt += `\nAnalyze the user's credit situation and provide optimization recommendations:\n\n`;

    if (includeUtilizationTips) {
      prompt += `- Credit Utilization: Current utilization is ${financialData.creditUtilization.toFixed(1)}% - provide optimization tips\n`;
    }
    if (includePaymentStrategies) {
      prompt += `- Payment Strategies: Tips for improving payment history and reducing balances\n`;
    }
    if (includeCreditBuilding) {
      prompt += `- Credit Building: Strategies to improve credit score over time\n`;
    }

    prompt += `- Credit Card Management: Best practices for credit card usage\n`;
    prompt += `- Credit Monitoring: Importance of regular credit monitoring\n\n`;

    prompt += `Provide 2-3 specific credit optimization tips with actionable steps.\n`;
    prompt += `${this.responseFormats[responseFormat]}`;

    return this._optimizePrompt(prompt);
  }

  /**
   * Build financial summary section for prompts
   * @param {Object} financialData - Aggregated financial data
   * @returns {string} Formatted financial summary
   * @private
   */
  _buildFinancialSummary(financialData) {
    return `
Financial Data Summary:
- Total Assets: $${financialData.totalAssets.toLocaleString()}
- Total Liabilities: $${financialData.totalLiabilities.toLocaleString()}
- Total Credit Card Debt: $${financialData.totalCreditCardDebt.toLocaleString()}
- Monthly Income: $${financialData.monthlyIncome.toLocaleString()}
- Net Worth: $${financialData.netWorth.toLocaleString()}
- Debt-to-Income Ratio: ${(financialData.debtToIncomeRatio * 100).toFixed(1)}%
- Credit Utilization: ${financialData.creditUtilization.toFixed(1)}%

Asset Breakdown:
${financialData.assets.map(asset => `- ${asset.name}: $${asset.value.toLocaleString()} (${asset.type})`).join('\n')}

Income Sources:
${financialData.income.map(inc => `- ${inc.source}: $${inc.amount.toLocaleString()} (${inc.frequency})`).join('\n')}

Liabilities:
${financialData.liabilities.map(liab => `- ${liab.name}: $${liab.amount.toLocaleString()} (${liab.type})`).join('\n')}

Credit Cards:
${financialData.creditCards.map(cc => `- ${cc.bank} ${cc.card}: $${cc.balance.toLocaleString()}/$${cc.limit.toLocaleString()}`).join('\n')}
    `.trim();
  }

  /**
   * Optimize prompt for better performance
   * @param {string} prompt - Original prompt
   * @returns {string} Optimized prompt
   * @private
   */
  _optimizePrompt(prompt) {
    // Remove excessive whitespace
    prompt = prompt.replace(/\n{3,}/g, '\n\n');
    
    // Ensure prompt ends with clear instruction
    if (!prompt.endsWith('.') && !prompt.endsWith('!') && !prompt.endsWith('?')) {
      prompt += '.';
    }

    // Log prompt length for monitoring
    logger.info('Prompt generated', {
      length: prompt.length,
      wordCount: prompt.split(' ').length
    });

    return prompt;
  }

  /**
   * Validate financial data before building prompts
   * @param {Object} financialData - Financial data to validate
   * @returns {Object} Validation result
   */
  validateFinancialData(financialData) {
    const errors = [];
    const warnings = [];

    // Required fields
    const requiredFields = ['totalAssets', 'totalLiabilities', 'monthlyIncome', 'netWorth'];
    requiredFields.forEach(field => {
      if (financialData[field] === undefined || financialData[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Data quality checks
    if (financialData.totalAssets < 0) {
      warnings.push('Total assets is negative');
    }
    if (financialData.monthlyIncome <= 0) {
      warnings.push('Monthly income is zero or negative');
    }
    if (financialData.creditUtilization > 100) {
      warnings.push('Credit utilization exceeds 100%');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get prompt statistics
   * @param {string} prompt - Prompt to analyze
   * @returns {Object} Prompt statistics
   */
  getPromptStats(prompt) {
    return {
      length: prompt.length,
      wordCount: prompt.split(' ').length,
      lineCount: prompt.split('\n').length,
      hasFinancialData: prompt.includes('Financial Data Summary'),
      hasInstructions: prompt.includes('Provide') || prompt.includes('Analyze'),
      estimatedTokens: Math.ceil(prompt.length / 4) // Rough estimate
    };
  }

  /**
   * Create a custom prompt with specific requirements
   * @param {Object} financialData - Financial data
   * @param {Object} requirements - Custom requirements
   * @returns {string} Custom prompt
   */
  buildCustomPrompt(financialData, requirements) {
    const {
      advisorType = 'financialAdvisor',
      focusAreas = [],
      responseFormat = 'structured',
      customInstructions = '',
      includeData = true
    } = requirements;

    let prompt = `${this.systemPrompts[advisorType]}\n\n`;
    
    if (includeData) {
      prompt += this._buildFinancialSummary(financialData);
    }

    if (customInstructions) {
      prompt += `\n${customInstructions}\n`;
    }

    if (focusAreas.length > 0) {
      prompt += `\nFocus on the following areas:\n`;
      focusAreas.forEach(area => {
        prompt += `- ${area}\n`;
      });
    }

    prompt += `\n${this.responseFormats[responseFormat]}`;

    return this._optimizePrompt(prompt);
  }
}

// Export singleton instance
module.exports = new PromptBuilder();

