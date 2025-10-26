/**
 * Test Script for AWS Bedrock Recommendation System
 * 
 * This script tests all recommendation endpoints to ensure they work correctly
 * Run with: node test-recommendations.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = [
  '/api/recommendations',
  '/api/recommendations/general',
  '/api/recommendations/budget',
  '/api/recommendations/investment',
  '/api/recommendations/debt',
  '/api/recommendations/credit',
  '/api/recommendations/summary',
  '/api/recommendations/all',
  '/api/recommendations/cache/stats'
];

/**
 * Make HTTP request
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            url
          });
        } catch (error) {
          reject({
            error: 'Invalid JSON response',
            data,
            url
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject({
        error: error.message,
        url
      });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        url
      });
    });
  });
}

/**
 * Test individual endpoint
 */
async function testEndpoint(endpoint) {
  console.log(`\n🧪 Testing: ${endpoint}`);
  console.log('─'.repeat(50));
  
  try {
    const result = await makeRequest(`${BASE_URL}${endpoint}`);
    
    if (result.status === 200) {
      console.log(`✅ Status: ${result.status}`);
      
      if (result.data.success) {
        console.log('✅ Success: true');
        
        // Check for specific data based on endpoint
        if (endpoint.includes('/general') && result.data.data?.recommendations) {
          console.log('✅ Has recommendations');
          console.log(`📊 From Cache: ${result.data.data.fromCache || 'N/A'}`);
        }
        
        if (endpoint.includes('/cache/stats') && result.data.data?.totalEntries !== undefined) {
          console.log(`📊 Cache Entries: ${result.data.data.totalEntries}`);
          console.log(`📊 Valid Entries: ${result.data.data.validEntries}`);
        }
        
        if (endpoint.includes('/all') && result.data.data?.general) {
          console.log('✅ Has all recommendation types');
          console.log(`📊 General Success: ${result.data.data.general.success}`);
          console.log(`📊 Budget Success: ${result.data.data.budget.success}`);
        }
        
      } else {
        console.log('❌ Success: false');
        console.log(`❌ Error: ${result.data.error || 'Unknown error'}`);
        console.log(`❌ Message: ${result.data.message || 'No message'}`);
      }
      
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`❌ Response: ${JSON.stringify(result.data, null, 2)}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.error || error.message}`);
    if (error.data) {
      console.log(`❌ Response: ${error.data}`);
    }
  }
}

/**
 * Test cache functionality
 */
async function testCacheFunctionality() {
  console.log('\n🔄 Testing Cache Functionality');
  console.log('─'.repeat(50));
  
  try {
    // First request (should not be cached)
    console.log('📤 First request (should generate new)...');
    const firstRequest = await makeRequest(`${BASE_URL}/api/recommendations/general`);
    
    if (firstRequest.data.success && firstRequest.data.data) {
      console.log(`📊 From Cache: ${firstRequest.data.data.fromCache}`);
      
      // Second request (should be cached)
      console.log('📤 Second request (should be cached)...');
      const secondRequest = await makeRequest(`${BASE_URL}/api/recommendations/general`);
      
      if (secondRequest.data.success && secondRequest.data.data) {
        console.log(`📊 From Cache: ${secondRequest.data.data.fromCache}`);
        
        if (firstRequest.data.data.fromCache === false && secondRequest.data.data.fromCache === true) {
          console.log('✅ Cache working correctly');
        } else {
          console.log('⚠️ Cache may not be working as expected');
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ Cache test error: ${error.error || error.message}`);
  }
}

/**
 * Test error handling
 */
async function testErrorHandling() {
  console.log('\n🚨 Testing Error Handling');
  console.log('─'.repeat(50));
  
  try {
    // Test invalid endpoint
    const invalidRequest = await makeRequest(`${BASE_URL}/api/recommendations/invalid`);
    
    if (invalidRequest.status === 404) {
      console.log('✅ 404 error handled correctly');
    } else {
      console.log(`⚠️ Unexpected status: ${invalidRequest.status}`);
    }
    
  } catch (error) {
    console.log(`✅ Error handling working: ${error.error || error.message}`);
  }
}

/**
 * Test performance
 */
async function testPerformance() {
  console.log('\n⚡ Testing Performance');
  console.log('─'.repeat(50));
  
  const iterations = 3;
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    
    try {
      const result = await makeRequest(`${BASE_URL}/api/recommendations/summary`);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      results.push(duration);
      console.log(`📊 Request ${i + 1}: ${duration}ms`);
      
    } catch (error) {
      console.log(`❌ Request ${i + 1} failed: ${error.error || error.message}`);
    }
  }
  
  if (results.length > 0) {
    const avgDuration = results.reduce((a, b) => a + b, 0) / results.length;
    console.log(`📊 Average Response Time: ${avgDuration.toFixed(2)}ms`);
    
    if (avgDuration < 1000) {
      console.log('✅ Performance: Good (< 1s)');
    } else if (avgDuration < 5000) {
      console.log('⚠️ Performance: Acceptable (< 5s)');
    } else {
      console.log('❌ Performance: Poor (> 5s)');
    }
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting AWS Bedrock Recommendation System Tests');
  console.log('═'.repeat(60));
  
  // Check if server is running
  try {
    const healthCheck = await makeRequest(`${BASE_URL}/api/health`);
    if (healthCheck.status === 200) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server health check failed');
      return;
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('💡 Make sure to start the server with: npm start');
    return;
  }
  
  // Test all endpoints
  for (const endpoint of ENDPOINTS) {
    await testEndpoint(endpoint);
  }
  
  // Test cache functionality
  await testCacheFunctionality();
  
  // Test error handling
  await testErrorHandling();
  
  // Test performance
  await testPerformance();
  
  console.log('\n🎉 Test Suite Complete');
  console.log('═'.repeat(60));
  console.log('📋 Summary:');
  console.log('• All endpoints tested');
  console.log('• Cache functionality verified');
  console.log('• Error handling checked');
  console.log('• Performance measured');
  console.log('\n💡 Check the output above for any ❌ errors that need attention');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});



