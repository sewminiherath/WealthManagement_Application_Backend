# AWS Bedrock Recommendation System Documentation

## Overview

This document describes the AI-powered financial recommendation system integrated with AWS Bedrock Claude 3 Sonnet. The system analyzes user financial data and provides personalized recommendations across multiple financial areas.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [API Endpoints](#api-endpoints)
3. [Configuration](#configuration)
4. [Usage Examples](#usage-examples)
5. [Caching System](#caching-system)
6. [Error Handling](#error-handling)
7. [Performance Considerations](#performance-considerations)

## System Architecture

### Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Routes    │───▶│   Controllers    │───▶│  Bedrock Service│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Data Aggregation │    │   AWS Bedrock   │
                       │     Service      │    │  Claude 3 Sonnet│
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Cache Service  │
                       └──────────────────┘
```

### Data Flow

1. **Request** → API endpoint receives recommendation request
2. **Data Aggregation** → Service pulls financial data from all models
3. **Cache Check** → Check if recommendation exists in cache
4. **AI Processing** → If not cached, send data to Claude 3 Sonnet
5. **Response** → Return personalized recommendations
6. **Caching** → Store response for future requests

## API Endpoints

### Base URL
```
/api/recommendations
```

### Endpoints

#### 1. General Recommendations
```http
GET /api/recommendations/general
```

**Description**: Get comprehensive financial health recommendations

**Response**:
```json
{
  "success": true,
  "data": {
    "recommendations": "AI-generated financial advice...",
    "financialSummary": {
      "netWorth": 50000,
      "totalAssets": 100000,
      "totalLiabilities": 50000,
      "monthlyIncome": 5000,
      "creditUtilization": 25.5
    },
    "insights": [...],
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "model": "anthropic.claude-3-sonnet-20240229-v1:0",
    "fromCache": false
  }
}
```

#### 2. Budget Analysis
```http
GET /api/recommendations/budget
```

**Description**: Get budget analysis and spending recommendations

**Response**:
```json
{
  "success": true,
  "data": {
    "recommendations": "Budget optimization advice...",
    "budgetMetrics": {
      "monthlyIncome": 5000,
      "totalAssets": 100000,
      "totalLiabilities": 50000,
      "creditCardDebt": 5000,
      "debtToIncomeRatio": 0.1
    },
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "model": "anthropic.claude-3-sonnet-20240229-v1:0",
    "fromCache": true
  }
}
```

#### 3. Investment Recommendations
```http
GET /api/recommendations/investment
```

**Description**: Get investment strategy recommendations

**Response**:
```json
{
  "success": true,
  "data": {
    "recommendations": "Investment strategy advice...",
    "investmentProfile": {
      "totalAssets": 100000,
      "assetBreakdown": {...},
      "netWorth": 50000,
      "monthlyIncome": 5000
    },
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "model": "anthropic.claude-3-sonnet-20240229-v1:0",
    "fromCache": false
  }
}
```

#### 4. Debt Management
```http
GET /api/recommendations/debt
```

**Description**: Get debt management and payoff recommendations

#### 5. Credit Optimization
```http
GET /api/recommendations/credit
```

**Description**: Get credit optimization recommendations

#### 6. Financial Summary
```http
GET /api/recommendations/summary
```

**Description**: Get financial summary and metrics without AI recommendations

#### 7. All Recommendations
```http
GET /api/recommendations/all
```

**Description**: Get all recommendation types in one request

#### 8. Cache Management

##### Get Cache Statistics
```http
GET /api/recommendations/cache/stats
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalEntries": 15,
    "validEntries": 12,
    "expiredEntries": 3,
    "maxSize": 100,
    "defaultTTL": 30
  }
}
```

##### Clear All Cache
```http
DELETE /api/recommendations/cache
```

##### Clear Cache by Type
```http
DELETE /api/recommendations/cache/:type
```

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Optional: Override default model parameters
BEDROCK_MAX_TOKENS=1000
BEDROCK_TEMPERATURE=0.7
BEDROCK_TOP_P=0.9
```

### AWS Bedrock Setup

1. **Enable Model Access**:
   - Go to AWS Bedrock Console
   - Navigate to "Model access"
   - Request access to "Claude 3 Sonnet"
   - Wait for approval (usually instant)

2. **IAM Permissions**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel"
         ],
         "Resource": [
           "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
         ]
       }
     ]
   }
   ```

## Usage Examples

### cURL Examples

#### Get General Recommendations
```bash
curl -X GET "http://localhost:3000/api/recommendations/general" \
  -H "Content-Type: application/json"
```

#### Get Budget Analysis
```bash
curl -X GET "http://localhost:3000/api/recommendations/budget" \
  -H "Content-Type: application/json"
```

#### Get All Recommendations
```bash
curl -X GET "http://localhost:3000/api/recommendations/all" \
  -H "Content-Type: application/json"
```

#### Check Cache Statistics
```bash
curl -X GET "http://localhost:3000/api/recommendations/cache/stats" \
  -H "Content-Type: application/json"
```

#### Clear Cache
```bash
curl -X DELETE "http://localhost:3000/api/recommendations/cache" \
  -H "Content-Type: application/json"
```

### JavaScript Examples

#### Fetch General Recommendations
```javascript
const getGeneralRecommendations = async () => {
  try {
    const response = await fetch('/api/recommendations/general');
    const data = await response.json();
    
    if (data.success) {
      console.log('Recommendations:', data.data.recommendations);
      console.log('From Cache:', data.data.fromCache);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Fetch All Recommendation Types
```javascript
const getAllRecommendations = async () => {
  try {
    const response = await fetch('/api/recommendations/all');
    const data = await response.json();
    
    if (data.success) {
      console.log('General:', data.data.general.recommendations);
      console.log('Budget:', data.data.budget.recommendations);
      console.log('Investment:', data.data.investment.recommendations);
      console.log('Debt Management:', data.data.debtManagement.recommendations);
      console.log('Credit Optimization:', data.data.creditOptimization.recommendations);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Caching System

### How It Works

1. **Cache Key Generation**: Based on financial data hash
2. **TTL (Time To Live)**: 30 minutes default
3. **Cache Size Limit**: 100 entries maximum
4. **Automatic Cleanup**: Expired entries removed automatically

### Cache Benefits

- **Reduced API Costs**: Fewer calls to AWS Bedrock
- **Faster Response Times**: Cached responses return immediately
- **Rate Limit Protection**: Prevents hitting AWS rate limits

### Cache Management

```javascript
// Get cache statistics
const stats = await fetch('/api/recommendations/cache/stats');

// Clear all cache
await fetch('/api/recommendations/cache', { method: 'DELETE' });

// Clear specific type
await fetch('/api/recommendations/cache/general', { method: 'DELETE' });
```

## Error Handling

### Common Error Responses

#### AWS Bedrock Service Unavailable
```json
{
  "success": false,
  "error": "Failed to generate recommendations",
  "message": "Unable to generate recommendations at this time. Please try again later."
}
```

#### Database Connection Error
```json
{
  "success": false,
  "error": "Failed to fetch financial data",
  "message": "Database connection error"
}
```

#### Invalid AWS Credentials
```json
{
  "success": false,
  "error": "AWS authentication failed",
  "message": "Invalid AWS credentials"
}
```

### Error Handling Best Practices

1. **Graceful Degradation**: System continues to work even if AI is unavailable
2. **User-Friendly Messages**: Clear error messages for users
3. **Logging**: Comprehensive error logging for debugging
4. **Retry Logic**: Automatic retry for transient failures

## Performance Considerations

### Optimization Strategies

1. **Caching**: Reduces API calls and improves response times
2. **Parallel Processing**: Multiple recommendation types generated simultaneously
3. **Data Aggregation**: Efficient database queries
4. **Prompt Engineering**: Optimized prompts for better responses

### Monitoring

#### Key Metrics to Monitor

- **Response Time**: Average time for recommendation generation
- **Cache Hit Rate**: Percentage of requests served from cache
- **AWS API Usage**: Number of Bedrock API calls
- **Error Rate**: Percentage of failed requests

#### Performance Benchmarks

- **Cached Response**: < 100ms
- **New AI Response**: 2-5 seconds
- **Data Aggregation**: < 500ms
- **Cache Operations**: < 10ms

### Scaling Considerations

1. **Database Indexing**: Ensure proper indexes on financial data
2. **Cache Size**: Monitor cache memory usage
3. **AWS Limits**: Monitor Bedrock API rate limits
4. **Load Balancing**: Consider multiple server instances

## Security Considerations

### Data Privacy

1. **Financial Data**: Never logged in plain text
2. **AWS Credentials**: Stored securely in environment variables
3. **API Keys**: Rotated regularly
4. **Data Encryption**: All data encrypted in transit

### Access Control

1. **API Authentication**: Consider adding authentication for production
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Input Validation**: Validate all incoming requests
4. **Audit Logging**: Log all recommendation requests

## Troubleshooting

### Common Issues

#### 1. AWS Bedrock Access Denied
**Error**: `AccessDeniedException`
**Solution**: 
- Check IAM permissions
- Verify model access in Bedrock console
- Ensure correct AWS region

#### 2. Invalid Model ID
**Error**: `ValidationException`
**Solution**:
- Verify model ID in configuration
- Check model availability in your region

#### 3. Cache Not Working
**Symptoms**: Always getting new responses
**Solution**:
- Check cache service initialization
- Verify cache key generation
- Monitor cache statistics

#### 4. Slow Response Times
**Causes**:
- No cache hits
- Large financial datasets
- AWS API latency
**Solutions**:
- Implement caching
- Optimize data aggregation
- Use CDN for static responses

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=recommendation:*
```

## Future Enhancements

### Planned Features

1. **User-Specific Recommendations**: Personalize based on user history
2. **Real-Time Updates**: WebSocket support for live recommendations
3. **Advanced Analytics**: Detailed financial insights and trends
4. **Mobile Optimization**: Mobile-specific recommendation formats
5. **Multi-Language Support**: Recommendations in multiple languages

### Integration Opportunities

1. **Frontend Dashboard**: Real-time recommendation display
2. **Email Notifications**: Scheduled recommendation emails
3. **SMS Alerts**: Critical financial alerts
4. **Third-Party Integrations**: Connect with banking APIs

## Support

For technical support or questions:

1. **Documentation**: Check this documentation first
2. **Logs**: Review application logs for error details
3. **AWS Console**: Check Bedrock service status
4. **Community**: Join our developer community

---

*Last Updated: January 2024*
*Version: 1.0.0*



