# Recommendation API Quick Reference

## Quick Start

### 1. Environment Setup
```bash
# Add to .env file
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### 2. Start Server
```bash
npm start
```

### 3. Test Endpoints
```bash
# Get general recommendations
curl http://localhost:3000/api/recommendations/general

# Get all recommendations
curl http://localhost:3000/api/recommendations/all
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recommendations/general` | GET | General financial recommendations |
| `/api/recommendations/budget` | GET | Budget analysis and optimization |
| `/api/recommendations/investment` | GET | Investment strategy recommendations |
| `/api/recommendations/debt` | GET | Debt management strategies |
| `/api/recommendations/credit` | GET | Credit optimization tips |
| `/api/recommendations/summary` | GET | Financial summary without AI |
| `/api/recommendations/all` | GET | All recommendation types |
| `/api/recommendations/cache/stats` | GET | Cache statistics |
| `/api/recommendations/cache` | DELETE | Clear all cache |
| `/api/recommendations/cache/:type` | DELETE | Clear cache by type |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "recommendations": "AI-generated advice...",
    "financialSummary": { ... },
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "model": "anthropic.claude-3-sonnet-20240229-v1:0",
    "fromCache": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Error description"
}
```

## JavaScript Examples

### Basic Usage
```javascript
// Get general recommendations
const response = await fetch('/api/recommendations/general');
const data = await response.json();
console.log(data.data.recommendations);
```

### All Recommendations
```javascript
// Get all recommendation types
const response = await fetch('/api/recommendations/all');
const data = await response.json();

console.log('General:', data.data.general.recommendations);
console.log('Budget:', data.data.budget.recommendations);
console.log('Investment:', data.data.investment.recommendations);
```

### Cache Management
```javascript
// Check cache stats
const stats = await fetch('/api/recommendations/cache/stats');
const cacheData = await stats.json();
console.log('Cache entries:', cacheData.data.totalEntries);

// Clear cache
await fetch('/api/recommendations/cache', { method: 'DELETE' });
```

## Common Use Cases

### 1. Dashboard Integration
```javascript
// Load all recommendations for dashboard
const loadDashboard = async () => {
  const response = await fetch('/api/recommendations/all');
  const data = await response.json();
  
  if (data.success) {
    updateDashboard(data.data);
  }
};
```

### 2. Specific Analysis
```javascript
// Get budget analysis only
const getBudgetAnalysis = async () => {
  const response = await fetch('/api/recommendations/budget');
  const data = await response.json();
  
  return data.data.recommendations;
};
```

### 3. Cache Optimization
```javascript
// Check if recommendations are cached
const checkCacheStatus = async () => {
  const response = await fetch('/api/recommendations/general');
  const data = await response.json();
  
  if (data.data.fromCache) {
    console.log('Served from cache');
  } else {
    console.log('Generated fresh');
  }
};
```

## Error Handling

### Common Errors
```javascript
const handleRecommendations = async () => {
  try {
    const response = await fetch('/api/recommendations/general');
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error:', data.error);
      console.log('Message:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## Performance Tips

### 1. Use Caching
- First request: 2-5 seconds
- Cached request: < 100ms
- Cache TTL: 30 minutes

### 2. Batch Requests
```javascript
// Get all recommendations at once
const getAllAtOnce = async () => {
  const response = await fetch('/api/recommendations/all');
  return response.json();
};

// Instead of multiple individual requests
const getIndividually = async () => {
  const general = await fetch('/api/recommendations/general');
  const budget = await fetch('/api/recommendations/budget');
  // ... more requests
};
```

### 3. Monitor Cache
```javascript
// Check cache before making requests
const getCacheStats = async () => {
  const response = await fetch('/api/recommendations/cache/stats');
  const data = await response.json();
  
  console.log('Cache hit rate:', data.data.validEntries / data.data.totalEntries);
};
```

## Troubleshooting

### 1. No Recommendations Generated
- Check AWS credentials
- Verify Bedrock model access
- Check database connection

### 2. Slow Response Times
- Check cache statistics
- Monitor AWS API limits
- Verify network connection

### 3. Cache Issues
- Clear cache: `DELETE /api/recommendations/cache`
- Check cache stats: `GET /api/recommendations/cache/stats`
- Restart server if needed

## Testing

### Manual Testing
```bash
# Test all endpoints
curl http://localhost:3000/api/recommendations/general
curl http://localhost:3000/api/recommendations/budget
curl http://localhost:3000/api/recommendations/investment
curl http://localhost:3000/api/recommendations/debt
curl http://localhost:3000/api/recommendations/credit
curl http://localhost:3000/api/recommendations/summary
curl http://localhost:3000/api/recommendations/all
```

### Load Testing
```bash
# Test cache performance
for i in {1..10}; do
  curl -s http://localhost:3000/api/recommendations/general | jq '.data.fromCache'
done
```

## Security Notes

1. **AWS Credentials**: Store securely, never commit to code
2. **API Keys**: Rotate regularly
3. **Rate Limiting**: Implement for production use
4. **Data Privacy**: Financial data is not logged

## Support

- **Documentation**: `/Documentation/AWS_BEDROCK_RECOMMENDATION_SYSTEM.md`
- **API Info**: `GET /api/recommendations`
- **Health Check**: `GET /api/health`
- **Cache Stats**: `GET /api/recommendations/cache/stats`



