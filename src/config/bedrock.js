const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');

/**
 * AWS Bedrock Configuration
 * 
 * Configures the Bedrock client for Claude 3 Haiku integration
 * Handles AWS credentials and region settings
 */

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Claude 3 Haiku model configuration
const CLAUDE_MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';

// Default model parameters
const DEFAULT_MODEL_PARAMS = {
  max_tokens: 1000,
  temperature: 0.7,
  top_p: 0.9,
  anthropic_version: 'bedrock-2023-05-31',
};

module.exports = {
  bedrockClient,
  CLAUDE_MODEL_ID,
  DEFAULT_MODEL_PARAMS,
};


