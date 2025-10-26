# Morgan Logging Configuration

## Overview
Enhanced Morgan HTTP request logger implementation with file rotation, custom formatting, and environment-specific configurations.

## Date Updated
October 24, 2025

## Features Implemented

### 1. File-Based Logging with Rotation
- **Access Logs** (`logs/access.log`) - All successful HTTP requests
- **Error Logs** (`logs/error.log`) - Only 4xx and 5xx errors
- **Daily Rotation** - Logs rotate automatically every day
- **Compression** - Old logs are gzipped to save space
- **Auto-Cleanup** - Keeps 14 days of access logs, 30 days of error logs

### 2. Custom Tokens

#### `colored-response-time`
Color-codes response times for easy visual identification:
- 🟢 **Green**: < 100ms (fast)
- 🟡 **Yellow**: 100-500ms (acceptable)
- 🔴 **Red**: > 500ms (slow)

#### `colored-status`
Color-codes HTTP status codes:
- 🟢 **Green**: 2xx (success)
- 🔵 **Cyan**: 3xx (redirect)
- 🟡 **Yellow**: 4xx (client error)
- 🔴 **Red**: 5xx (server error)

#### `user-id`
Logs the authenticated user's ID from `req.user._id`.
Shows `anonymous` for unauthenticated requests.

### 3. Skip Conditions

Morgan automatically skips logging for:
- `/health` - Health check endpoint
- `/api/health` - API health check endpoint
- `/favicon.ico` - Browser favicon requests

This reduces log noise from automated monitoring tools and browsers.

### 4. Environment-Specific Behavior

#### Development Mode
```
NODE_ENV=development
```

**Console Output:**
- Colored, formatted output for easy reading
- Shows: METHOD URL STATUS RESPONSE_TIME - SIZE
- Example: `GET /api/items 200 45.234ms - 1024`
- Logs to stdout (visible in terminal)

**Single Stream:**
- Console only, no files

#### Production Mode
```
NODE_ENV=production
```

**File Output:**
- Logs to `logs/access.log` (all requests)
- Logs to `logs/error.log` (errors only)
- Also logs errors to console via custom logger

**Three Streams:**
1. All requests → access.log
2. Errors only → error.log
3. Errors only → console (via custom logger)

**Format:**
Apache combined log format with user ID:
```
192.168.1.1 - user123 [24/Oct/2025:10:30:45 +0000] "GET /api/items HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0"
```

---

## File Structure

### Configuration File
```
src/config/morgan.js
```

**Exports:** `getMorganMiddleware()` function

**Returns:** Array of Morgan middleware instances based on environment

### Log Files Location
```
logs/
├── access.log              # Current access log
├── access.log.1.gz         # Yesterday's access log (compressed)
├── access.log.2.gz         # 2 days ago
├── error.log               # Current error log
├── error.log.1.gz          # Yesterday's error log
└── ...
```

**Git Ignored:** The entire `logs/` directory is in `.gitignore`

---

## Implementation Details

### 1. Rotating File Streams

#### Access Log Stream
```javascript
const createAccessLogStream = () => {
  return rfs.createStream('access.log', {
    interval: '1d',      // Rotate daily
    path: path.join(__dirname, '../../logs'),
    compress: 'gzip',    // Compress rotated files
    maxFiles: 14,        // Keep 14 days
  });
};
```

#### Error Log Stream
```javascript
const createErrorLogStream = () => {
  return rfs.createStream('error.log', {
    interval: '1d',      // Rotate daily
    path: path.join(__dirname, '../../logs'),
    compress: 'gzip',    // Compress rotated files
    maxFiles: 30,        // Keep 30 days (longer retention for errors)
  });
};
```

### 2. Skip Functions

#### Skip Health Checks
```javascript
const skipHealthChecks = (req, res) => {
  return req.url === '/health' || 
         req.url === '/api/health' || 
         req.url === '/favicon.ico';
};
```

#### Skip Successful Requests (for error logging)
```javascript
const skipSuccessful = (req, res) => {
  return res.statusCode < 400;
};
```

### 3. Custom Logger Integration

```javascript
const customLoggerStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};
```

Integrates Morgan with `src/utils/logger.js` for consistent logging format.

---

## Usage in server.js

### Import
```javascript
const getMorganMiddleware = require('./src/config/morgan');
```

### Apply Middleware
```javascript
const morganMiddleware = getMorganMiddleware();
morganMiddleware.forEach(middleware => app.use(middleware));
```

**Why forEach?**
In production, `getMorganMiddleware()` returns an array of 3 middleware instances (access log, error log file, error log console). We need to apply all of them.

---

## Log Examples

### Development Console Output
```
GET /api/items 200 45.234ms - 1024
POST /api/auth/login 200 123.456ms - 512
GET /api/users/123 404 12.345ms - 98
POST /api/items 500 234.567ms - 156
```

### Production access.log
```
::1 - anonymous [24/Oct/2025:10:30:45 +0000] "GET /api/items HTTP/1.1" 200 1024 "-" "PostmanRuntime/7.26.8"
::1 - 671a5b8c9d4e2f3a1b5c6d7e [24/Oct/2025:10:31:12 +0000] "POST /api/items HTTP/1.1" 201 512 "-" "PostmanRuntime/7.26.8"
::1 - 671a5b8c9d4e2f3a1b5c6d7e [24/Oct/2025:10:31:45 +0000] "GET /api/users/profile HTTP/1.1" 200 256 "-" "PostmanRuntime/7.26.8"
```

### Production error.log
```
::1 - anonymous [24/Oct/2025:10:32:15 +0000] "GET /api/users/999 HTTP/1.1" 404 98 "-" "PostmanRuntime/7.26.8"
::1 - 671a5b8c9d4e2f3a1b5c6d7e [24/Oct/2025:10:33:20 +0000] "POST /api/items HTTP/1.1" 500 156 "-" "PostmanRuntime/7.26.8"
```

---

## Log File Rotation Schedule

### Daily Rotation (1am server time)
- `access.log` → `access.log.1.gz`
- `error.log` → `error.log.1.gz`
- New empty files created

### Automatic Cleanup
- **Access logs**: Deleted after 14 days
- **Error logs**: Deleted after 30 days
- Compressed files use minimal disk space

### Disk Space Estimation
- **1000 req/day**: ~1-2 MB uncompressed, ~200-400 KB compressed
- **10,000 req/day**: ~10-20 MB uncompressed, ~2-4 MB compressed
- **Error logs**: Typically 10-20% of access log size

---

## Benefits

### 1. Debugging
- **Colored output** in development makes issues easy to spot
- **Separate error log** for quick error analysis
- **User tracking** shows which user caused errors

### 2. Monitoring
- **File-based logs** can be ingested by monitoring tools
- **Standard format** compatible with log analysis software (ELK, Splunk)
- **Health check filtering** reduces noise

### 3. Compliance
- **30-day error retention** meets most compliance requirements
- **Compressed storage** reduces costs
- **Automatic cleanup** prevents disk space issues

### 4. Performance
- **Skipped routes** reduce logging overhead
- **Async file writing** doesn't block requests
- **Compressed old logs** save disk I/O

---

## Log Analysis Tools

### Compatible Tools
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Graylog**
- **AWS CloudWatch Logs**
- **Azure Monitor**
- **Google Cloud Logging**

### Simple Analysis (Command Line)
```bash
# Count requests by status code
grep "HTTP/1.1" logs/access.log | awk '{print $9}' | sort | uniq -c

# Find slow requests (>1000ms)
grep -E "[0-9]{4,}\.[0-9]+ ms" logs/access.log

# Count errors by endpoint
grep " 500 " logs/error.log | awk '{print $7}' | sort | uniq -c

# Find requests from specific user
grep "671a5b8c9d4e2f3a1b5c6d7e" logs/access.log
```

---

## Customization Options

### Change Rotation Interval
```javascript
interval: '1d',    // Daily
interval: '7d',    // Weekly
interval: '1h',    // Hourly
interval: '500M',  // Every 500MB
```

### Change Log Retention
```javascript
maxFiles: 14,      // Keep 14 files
maxFiles: 30,      // Keep 30 files
maxFiles: 0,       // Keep forever
```

### Add Custom Tokens
```javascript
morgan.token('custom-token', (req, res) => {
  return req.customValue;
});
```

### Change Log Format
```javascript
// Add more fields
const customFormat = ':method :url :status :response-time ms - :user-id';

// Use predefined formats
'combined'   // Apache combined
'common'     // Apache common
'dev'        // Development
'short'      // Shorter than default
'tiny'       // Minimal
```

---

## Dependencies

### Production Dependencies
```json
{
  "morgan": "^1.10.1",
  "rotating-file-stream": "^3.2.7"
}
```

### Installation
```bash
npm install morgan rotating-file-stream
```

---

## Testing

### Test Development Logging
1. Start server in development mode:
   ```bash
   npm run dev
   ```

2. Make requests:
   ```bash
   curl http://localhost:3000/api/items
   ```

3. Check console for colored output

### Test Production Logging
1. Start server in production mode:
   ```bash
   NODE_ENV=production npm start
   ```

2. Make requests (including errors):
   ```bash
   curl http://localhost:3000/api/items
   curl http://localhost:3000/api/nonexistent
   ```

3. Check log files:
   ```bash
   # View access log
   cat logs/access.log
   
   # View error log
   cat logs/error.log
   
   # View compressed logs
   zcat logs/access.log.1.gz
   ```

### Test Health Check Skipping
```bash
# These should NOT appear in logs
curl http://localhost:3000/health
curl http://localhost:3000/api/health
```

### Test User ID Logging
1. Login to get JWT token:
   ```bash
   TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}' \
     | jq -r '.token')
   ```

2. Make authenticated request:
   ```bash
   curl http://localhost:3000/api/users/profile \
     -H "Authorization: Bearer $TOKEN"
   ```

3. Check logs for user ID instead of "anonymous"

---

## Troubleshooting

### Issue: No log files created
**Solution:**
- Check that `logs/` directory exists
- Check file permissions on `logs/` directory
- Check NODE_ENV is set to "production"

### Issue: Logs not rotating
**Solution:**
- Wait for rotation time (1am server time)
- Check server has been running past rotation time
- Manually trigger by restarting server

### Issue: Disk space filling up
**Solution:**
- Reduce `maxFiles` setting
- Increase `interval` (rotate less frequently)
- Compress logs manually: `gzip logs/*.log`

### Issue: Can't read compressed logs
**Solution:**
```bash
# Use zcat or gunzip
zcat logs/access.log.1.gz
gunzip -c logs/access.log.1.gz

# Or decompress permanently
gunzip logs/access.log.1.gz
```

### Issue: Health checks appearing in logs
**Solution:**
- Check skip function is working
- Verify exact URL path matches skip condition
- Add additional paths to skip function

---

## Best Practices

### 1. Log Retention
- **Access logs**: 7-14 days sufficient for most cases
- **Error logs**: 30-90 days for investigation
- **Compliance**: Check your industry requirements

### 2. Log Analysis
- Set up automated log analysis
- Create alerts for high error rates
- Monitor slow response times
- Track authentication failures

### 3. Security
- Don't log sensitive data (passwords, tokens, credit cards)
- Consider GDPR implications of logging user IDs
- Protect log files with proper permissions
- Rotate logs before they contain too much data

### 4. Performance
- Skip unnecessary routes (health checks, static files)
- Use async file streams (default in morgan)
- Monitor log file sizes
- Archive old logs to cold storage

---

## Configuration Summary

| Setting | Development | Production |
|---------|------------|------------|
| **Output** | Console | Files + Console (errors) |
| **Format** | dev (colored) | combined (Apache) |
| **Access Log** | No | Yes (14 days) |
| **Error Log** | No | Yes (30 days) |
| **Compression** | N/A | Yes (gzip) |
| **User Tracking** | No | Yes |
| **Skip Health** | Yes | Yes |

---

## Related Files

- **Configuration**: `src/config/morgan.js`
- **Server Setup**: `server.js`
- **Custom Logger**: `src/utils/logger.js`
- **Log Directory**: `logs/`
- **Git Ignore**: `.gitignore` (line 16: `logs/`)

---

## Future Enhancements

Possible improvements:
- [ ] JSON format for structured logging
- [ ] Integration with external logging services (Loggly, Papertrail)
- [ ] Request ID generation and tracking
- [ ] Performance metrics aggregation
- [ ] Real-time log streaming to dashboard
- [ ] Log filtering by user role
- [ ] Request/response body logging (with sanitization)

---

**Morgan Logging Configuration Complete! ✅**

*For general logging utilities, see `src/utils/logger.js`*
*For server configuration, see `Documentation/08-Server-Configuration.md`*


