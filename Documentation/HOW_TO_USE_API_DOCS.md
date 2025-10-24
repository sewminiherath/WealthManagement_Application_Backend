# How to Use Your API Documentation

You now have **complete API documentation** for your Financial Manager backend! Here's how to use each file:

---

## 📚 **Documentation Files**

### 1. **API_REFERENCE.md** (Detailed Reference)
**17,527 bytes** | **Complete Documentation**

**When to use:**
- Learning how each endpoint works
- Understanding request/response formats
- Checking field requirements and validations
- Looking up query parameters

**What's inside:**
- ✅ All 24 endpoints with full details
- ✅ Request/response examples
- ✅ Field validations and requirements
- ✅ Query parameters for filtering and pagination
- ✅ Error response formats
- ✅ Status codes explanation
- ✅ Testing examples in multiple languages

**Perfect for:** Deep dive into API functionality

---

### 2. **API_QUICK_REFERENCE.md** (Cheat Sheet)
**8,525 bytes** | **Quick Lookup**

**When to use:**
- Quick endpoint lookup
- Rapid testing
- Remembering field names
- Finding enum values

**What's inside:**
- ✅ All endpoints in table format
- ✅ Quick copy-paste examples
- ✅ Enum value lists
- ✅ Common query patterns
- ✅ Browser console snippets

**Perfect for:** Day-to-day development work

---

### 3. **Financial_Manager_API.postman_collection.json** (Postman Collection)
**14,537 bytes** | **Ready-to-Import**

**When to use:**
- Testing endpoints with Postman
- Sharing API with team members
- Automated testing

**What's inside:**
- ✅ 27 pre-configured requests
- ✅ All 4 financial endpoints (Income, Assets, Liabilities, Credit Cards)
- ✅ Example request bodies
- ✅ Query parameters
- ✅ Environment variable (BASE_URL)

**Perfect for:** Visual API testing

---

### 4. **API_EXAMPLES.md** (Existing)
**11,528 bytes** | **Code Examples**

**What's inside:**
- ✅ cURL examples
- ✅ Real-world scenarios
- ✅ Step-by-step workflows

---

## 🚀 **Quick Start Guide**

### **Step 1: Choose Your Tool**

#### Option A: Use Postman (Recommended for beginners)
1. Download Postman: https://www.postman.com/downloads/
2. Open Postman
3. Click **Import** button
4. Drag and drop `Financial_Manager_API.postman_collection.json`
5. Collection appears in left sidebar
6. Click any request and hit **Send**!

#### Option B: Use Browser Console (No installation needed)
1. Open http://localhost:3000 in browser
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Copy examples from `API_QUICK_REFERENCE.md`
5. Paste and run!

#### Option C: Use cURL (Command line)
1. Open terminal
2. Copy examples from `API_REFERENCE.md`
3. Paste and run!

---

### **Step 2: Test Your First Endpoint**

#### Get All Income Records
**Postman:**
1. Open Postman collection
2. Click "Income" → "Get All Income"
3. Click **Send**

**Browser Console:**
```javascript
fetch('http://localhost:3000/api/income')
  .then(r => r.json())
  .then(console.log);
```

**cURL:**
```bash
curl http://localhost:3000/api/income
```

---

### **Step 3: Create Your First Record**

#### Create an Income Record
**Postman:**
1. Click "Income" → "Create Income"
2. Check **Body** tab (JSON already filled in)
3. Modify values if needed
4. Click **Send**

**Browser Console:**
```javascript
fetch('http://localhost:3000/api/income', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    incomeSource: "Monthly Salary",
    amount: 5000,
    frequency: "monthly",
    dateReceived: "2025-01-15"
  })
})
.then(r => r.json())
.then(console.log);
```

**PowerShell:**
```powershell
$body = @{
  incomeSource = "Monthly Salary"
  amount = 5000
  frequency = "monthly"
  dateReceived = "2025-01-15"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/income" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## 📖 **Documentation Workflow**

### For Quick Lookups:
1. Open `API_QUICK_REFERENCE.md`
2. Find your endpoint
3. Copy the example
4. Test it!

### For Detailed Information:
1. Open `API_REFERENCE.md`
2. Read the full endpoint documentation
3. Check field requirements
4. Review examples

### For Visual Testing:
1. Import Postman collection
2. Set BASE_URL variable (already set to localhost:3000)
3. Test all endpoints visually

---

## 🎯 **Common Use Cases**

### Use Case 1: "What fields does Income need?"
**Answer in:** `API_REFERENCE.md` → Income → Create Income → Field Requirements

### Use Case 2: "How do I filter by type?"
**Answer in:** `API_QUICK_REFERENCE.md` → Query Parameters section

### Use Case 3: "What are the valid enum values for frequency?"
**Answer in:** `API_QUICK_REFERENCE.md` → Income API → Frequency Options

### Use Case 4: "I want to test all endpoints quickly"
**Answer:** Import `Financial_Manager_API.postman_collection.json` into Postman

---

## 📝 **Tips & Tricks**

### Tip 1: Keep Quick Reference Open
Keep `API_QUICK_REFERENCE.md` open in a second tab for fast lookups during development.

### Tip 2: Use Postman Variables
In Postman, the collection uses `{{BASE_URL}}` variable. You can change it in:
- Collection → Variables tab
- Or create an Environment

### Tip 3: Save IDs for Testing
After creating a record, save its `_id` for update/delete testing:
```javascript
// Create and save ID
fetch('/api/income', {method: 'POST', ...})
  .then(r => r.json())
  .then(data => {
    const id = data.data._id;
    console.log('Saved ID:', id);
    // Use this ID for updates/deletes
  });
```

### Tip 4: Browser Extension
Install a JSON formatter extension (like JSONView) to make responses easier to read in the browser.

---

## 🔍 **Finding Information Fast**

| What You Need | Where to Find It |
|---------------|------------------|
| **Endpoint URL** | Quick Reference (tables) |
| **Required fields** | Reference (Field Requirements) |
| **Enum values** | Quick Reference (options lists) |
| **Query parameters** | Both docs (Query Parameters) |
| **Example request** | Both docs (examples everywhere) |
| **Error format** | Reference (Error Responses) |
| **Status codes** | Reference (HTTP Status Codes) |
| **Virtual fields** | Reference (Credit Cards section) |

---

## 🧪 **Testing Workflow**

### Recommended Testing Order:

1. **Test GET endpoints** (no data needed)
   ```
   GET /api/income
   GET /api/assets
   GET /api/liabilities
   GET /api/credit-cards
   ```

2. **Create test data** (POST)
   ```
   POST /api/income (create 1-2 records)
   POST /api/assets (create 1-2 records)
   POST /api/liabilities (create 1 record)
   POST /api/credit-cards (create 1 record)
   ```

3. **Test GET with filters**
   ```
   GET /api/income?frequency=monthly
   GET /api/assets?assetsType=savings
   ```

4. **Test UPDATE** (PUT)
   ```
   PUT /api/income/:id (change amount)
   ```

5. **Test DELETE**
   ```
   DELETE /api/income/:id (delete one record)
   ```

---

## 💡 **Best Practices**

### For Development:
- ✅ Use Postman for complex requests
- ✅ Use Browser Console for quick tests
- ✅ Keep Quick Reference open
- ✅ Save commonly used IDs

### For Documentation:
- ✅ Add notes to Postman requests
- ✅ Create Postman environments (dev, prod)
- ✅ Share collection with team
- ✅ Keep docs updated

### For Learning:
- ✅ Start with GET requests (simplest)
- ✅ Then try POST (creates data)
- ✅ Practice with PUT (updates)
- ✅ Finally DELETE (removes data)

---

## 🎓 **Learning Path**

### Beginner Level:
1. Read `API_QUICK_REFERENCE.md` introduction
2. Import Postman collection
3. Test "Get All" endpoints
4. Create one record via Postman

### Intermediate Level:
1. Read `API_REFERENCE.md` in detail
2. Test all CRUD operations
3. Try query parameters (filtering, sorting)
4. Test from browser console

### Advanced Level:
1. Build a simple frontend that calls these endpoints
2. Implement authentication (if needed)
3. Create automated tests
4. Deploy to production

---

## 📌 **Quick Links**

### Internal Docs:
- `API_REFERENCE.md` - Full documentation
- `API_QUICK_REFERENCE.md` - Cheat sheet
- `API_EXAMPLES.md` - Code examples
- `FINANCIAL_API_DOCUMENTATION.md` - Feature overview
- `README.md` - Project setup

### External Resources:
- Postman Download: https://www.postman.com/downloads/
- JSON Formatter: Search "JSON Formatter" in browser extension store
- cURL Documentation: https://curl.se/docs/

---

## 🆘 **Troubleshooting**

### "Connection Refused" Error
**Solution:** Make sure server is running
```bash
npm run dev
```

### "404 Not Found" Error
**Solution:** Check endpoint URL in docs

### "Validation Error" Response
**Solution:** Check required fields in `API_REFERENCE.md`

### "Cannot Parse JSON" Error
**Solution:** Ensure Content-Type is `application/json`

---

## ✅ **Checklist: Getting Started**

- [ ] Server is running (`npm run dev`)
- [ ] Downloaded Postman (optional but recommended)
- [ ] Imported Postman collection
- [ ] Opened `API_QUICK_REFERENCE.md` in editor
- [ ] Tested first GET request
- [ ] Created first record (POST)
- [ ] Bookmarked this guide

---

## 🎉 **You're Ready!**

You now have:
- ✅ Complete API documentation (17KB)
- ✅ Quick reference cheat sheet (8KB)
- ✅ Postman collection (14KB) with 27 requests
- ✅ Working API on http://localhost:3000

**Start testing your endpoints and building amazing applications!** 🚀

---

**Questions?** Check the detailed documentation in `API_REFERENCE.md` or `FINANCIAL_API_DOCUMENTATION.md`

**Last Updated:** October 24, 2025  
**API Version:** 3.0.0

