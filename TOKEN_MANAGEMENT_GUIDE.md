# 🔐 BACKEND TOKEN MANAGEMENT - COMPLETE GUIDE

## ✅ How Tokens Work Across the System

### 🎯 Overview:
Token Manager-এ যে tokens add করবেন, সেগুলো **automatically** সব জায়গায় use হবে:
- ✅ SOLIDWORKS Upload Manager
- ✅ Any GitHub API operations
- ✅ Auto rate-limit management
- ✅ Token rotation when limit exceeded

**NO manual configuration needed anywhere!**

---

## 🔐 Token Flow

```
Backend Token Manager
        ↓
   Add Tokens (encrypted)
        ↓
Backend Server (Token Pool)
        ↓
   ├─→ Upload Manager (auto-uses tokens)
   ├─→ GitHub API calls (auto-uses tokens)
   ├─→ Rate limit detection (auto-switches tokens)
   └─→ All other operations (auto-uses tokens)
```

---

## 📋 Step-by-Step Setup

### Step 1: Start Backend Server
```bash
cd "Backend projects"
python secure-proxy-server.py
```

**Expected:**
```
 * Running on http://localhost:5000
 * Backend server started successfully
```

---

### Step 2: Add GitHub Tokens

**Navigate to:** `backend-token-manager.html`

**You'll see:**
1. ✅ Status bar showing "Connected"
2. ✅ Server Status section
3. ✅ "Add GitHub Tokens" section

**How to add:**
1. Enter admin password (set in backend config)
2. Paste GitHub Personal Access Token(s):
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ghp_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
   ghp_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
   ```
3. Click "Add Tokens"

**Success Message:**
```
✅ Success! Added 3 token(s). Total: 3

🔐 Tokens are now active and will be automatically used by:
• SOLIDWORKS Upload Manager
• All GitHub API operations
• Auto rate-limit management

No manual configuration needed - backend handles everything!
```

---

### Step 3: Verify Tokens Active

**After adding tokens, check:**

1. **Dashboard Status Bar:**
   - Shows: "Tokens: 3"
   - Rate limit: "180/hr" (60 × 3 tokens)

2. **Upload Manager Status Bar:**
   - Shows: "Tokens: 3"
   - Connection: Green (active)

3. **Token Manager Analytics:**
   - Click "View Analytics"
   - See all tokens listed with status

---

## 🚀 Using Tokens (Automatic!)

### Upload Files (SOLIDWORKS Upload Manager)

**Just upload normally - tokens used automatically:**

```javascript
// Example: Upload SOLIDWORKS files
// Backend automatically:
// 1. Selects available token from pool
// 2. Checks rate limit
// 3. Uses token for upload
// 4. Switches to next token if rate limited

// You just call:
uploadFilesToGitHub(files, 'CW/Day 01', 'Upload SOLIDWORKS files');

// Backend handles:
// ✅ Token selection
// ✅ Rate limit checking
// ✅ Auto token rotation
// ✅ Error handling
```

**No token management in your code!**

---

## 🔄 Token Rotation

Backend automatically rotates tokens when:
1. **Rate limit exceeded** → Switches to next token
2. **Token expired** → Marks as invalid, uses next
3. **Token revoked** → Auto-detects, skips it

**Example:**
```
Request 1 → Uses Token 1 (58/60 remaining)
Request 2 → Uses Token 1 (57/60 remaining)
Request 3 → Uses Token 1 (56/60 remaining)
...
Request 60 → Uses Token 1 (0/60 remaining)
Request 61 → Auto-switches to Token 2 (59/60 remaining)
Request 62 → Uses Token 2 (58/60 remaining)
```

**You never see this happening - it's automatic!**

---

## 📊 Token Analytics

**View token usage statistics:**

1. Navigate to: `backend-token-manager.html`
2. Scroll to "Analytics & Monitoring"
3. Click "View Analytics"

**You'll see:**
- Total tokens configured
- Active tokens count
- Rate-limited tokens
- Invalid tokens
- Total requests made
- Success/error counts
- Each token's individual stats
- Top endpoints used
- Recent requests log

---

## 🔧 Token Management Operations

### Add More Tokens

**When to add:**
- Need higher rate limits
- Current tokens rate-limited
- Want backup tokens

**How:**
1. Open Backend Token Manager
2. Enter admin password
3. Paste new token(s)
4. Click "Add Tokens"

**Result:**
- New tokens immediately available
- Rate limit increases automatically
- All pages see new token count

---

### View All Tokens

**See what tokens are configured:**

1. Enter admin password
2. Click "View Tokens"

**Shows:**
- Token IDs (last 8 characters)
- Status (active/rate-limited/invalid)
- Usage counts
- Last used time
- Rate limit status

**Security:** Full tokens never displayed!

---

### Remove Invalid Tokens

**Remove tokens that are:**
- Expired
- Revoked
- No longer needed

**How:**
1. Enter admin password
2. Click "Remove Invalid Tokens"

**Result:**
- Invalid tokens removed
- Only active tokens remain
- Rate limit adjusts automatically

---

## 🎯 Integration Points

### 1. SOLIDWORKS Upload Manager

**Functions that use tokens:**
```javascript
// Upload files
uploadFilesToGitHub(files, targetPath, message)
// → Backend auto-uses token pool

// Update file
updateFileOnGitHub(filePath, file, message)
// → Backend auto-uses token pool

// Delete file
deleteFileFromGitHub(filePath, message)
// → Backend auto-uses token pool

// Get folder contents
getGitHubFolderContents(folderPath)
// → Backend auto-uses token pool
```

**All functions automatically:**
- ✅ Use backend token pool
- ✅ Handle rate limits
- ✅ Rotate tokens
- ✅ Show notifications

---

### 2. Backend Connection Core

**GitHub API requests:**
```javascript
// Make any GitHub API request
backendConnection.githubRequest('/repos/user/repo/contents/path', {
    method: 'GET'
});

// Backend automatically:
// ✅ Adds Authorization header with token
// ✅ Checks rate limit
// ✅ Rotates to next token if needed
// ✅ Handles errors
```

---

### 3. Custom Operations

**Create your own GitHub operations:**
```javascript
async function myCustomGitHubOperation() {
    try {
        // Just call githubRequest - tokens handled automatically
        const result = await backendConnection.githubRequest(
            '/repos/Akhinoor14/A3KM-Studio/issues',
            {
                method: 'POST',
                body: JSON.stringify({
                    title: 'New Issue',
                    body: 'Issue description'
                })
            }
        );
        
        console.log('Issue created:', result);
        
    } catch (error) {
        console.error('Failed:', error);
        // Error automatically shown in notification
    }
}
```

**No token management code needed!**

---

## 🔐 Security Features

### 1. Encryption
- All tokens encrypted at rest (AES-256)
- Never stored in plain text
- Decrypted only when needed

### 2. Admin Authentication
- Password required for all operations
- Password hashed with SHA-256
- No unauthorized access

### 3. Token Privacy
- Full tokens never displayed in UI
- Only last 8 characters shown as ID
- Logs don't contain full tokens

### 4. Secure Storage
- Tokens stored in backend only
- Not in frontend localStorage
- Not in browser memory
- Not in console logs

---

## 📈 Rate Limits Explained

### Single Token:
- GitHub allows: **60 requests/hour** (unauthenticated)
- With token: **5000 requests/hour**
- In practice: ~**60-100 requests/hour** (safe limit)

### Multiple Tokens (Recommended):
```
1 token  = 60/hr   effective rate
2 tokens = 120/hr  effective rate
3 tokens = 180/hr  effective rate
5 tokens = 300/hr  effective rate
10 tokens = 600/hr effective rate
```

**Backend automatically:**
1. Tracks usage per token
2. Switches when limit approached
3. Waits for reset if all limited
4. Shows clear error messages

---

## 🧪 Testing Token Integration

### Test 1: Token Addition
```
1. Start backend server
2. Open Backend Token Manager
3. Add 1 token
4. Check status bar: "Tokens: 1"
5. Check dashboard: "Tokens: 1"
6. Check upload manager: "Tokens: 1"
```
✅ **Expected:** Token count updates everywhere

---

### Test 2: Upload with Tokens
```
1. Ensure tokens added
2. Open SOLIDWORKS Upload Manager
3. Select files
4. Click upload
5. Watch console for: "🔐 Using backend-managed token pool"
6. Upload succeeds
```
✅ **Expected:** Upload works without manual token config

---

### Test 3: Token Rotation
```
1. Add multiple tokens
2. Make rapid uploads (60+ requests)
3. Watch backend logs
4. See token rotation happening
5. No rate limit errors
```
✅ **Expected:** Automatic token switching

---

### Test 4: Invalid Token Handling
```
1. Add invalid token
2. Try upload
3. Backend detects invalid token
4. Switches to next valid token
5. Upload succeeds
```
✅ **Expected:** Graceful handling, auto-recovery

---

## 🐛 Troubleshooting

### Issue: "No tokens configured"

**Cause:** No tokens added yet

**Solution:**
1. Open Backend Token Manager
2. Add at least 1 token
3. Verify status shows "Tokens: 1"

---

### Issue: "Rate limit exceeded"

**Cause:** All tokens rate-limited

**Solutions:**
1. **Wait:** Rate limits reset after 1 hour
2. **Add more tokens:** Increases capacity
3. **Check analytics:** See which tokens limited

---

### Issue: "Token invalid"

**Cause:** Token expired/revoked

**Solutions:**
1. Generate new token on GitHub
2. Add new token via Token Manager
3. Remove invalid tokens

---

### Issue: Uploads fail with 401/403

**Cause:** Token lacks permissions

**Solution:**
1. Check GitHub token has these scopes:
   - ✅ `repo` (full control)
   - ✅ `workflow` (if updating workflows)
2. Generate new token with correct scopes
3. Add via Token Manager

---

## 📝 GitHub Token Generation

### How to create Personal Access Token:

1. **Go to:** GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Click:** "Generate new token (classic)"

3. **Select scopes:**
   - ✅ `repo` - Full control of private repositories
   - ✅ `workflow` - Update GitHub Action workflows

4. **Expiration:** Choose "No expiration" or custom

5. **Generate token**

6. **Copy token:** `ghp_xxxxxxxxxxxxxxxxxxxx`

7. **Add to Backend Token Manager** ← Paste here!

---

## 🎉 Success Criteria

### ✅ Tokens Working Correctly:

- [ ] Backend server running
- [ ] At least 1 token added
- [ ] Status bars show token count
- [ ] Upload works without manual token
- [ ] No 401/403 errors
- [ ] Rate limits handled automatically
- [ ] Analytics show token usage

### ✅ Perfect Integration:

- [ ] Upload Manager uses tokens automatically
- [ ] No hardcoded tokens in code
- [ ] Token rotation works
- [ ] Invalid tokens handled gracefully
- [ ] Clear error messages
- [ ] Notifications working

**If all checked: TOKEN SYSTEM PERFECT!** 🔐

---

## 🔥 Key Takeaways

### ✅ DO:
- Add tokens via Backend Token Manager
- Use multiple tokens for higher limits
- Monitor analytics regularly
- Remove invalid tokens periodically
- Keep backend server running

### ❌ DON'T:
- Hardcode tokens in frontend code
- Share tokens publicly
- Commit tokens to Git
- Store tokens in localStorage
- Skip admin password

---

## 🚀 Quick Reference

### Add Token:
```
Backend Token Manager → Enter Password → Paste Token → Add
```

### Use Token (Automatic):
```
Upload Manager → Select Files → Upload
(Backend handles everything)
```

### Check Status:
```
Any page → Status Bar → See token count
```

### View Analytics:
```
Token Manager → View Analytics → See all stats
```

---

## 🎯 Final Notes

**Token Manager-এ add করা প্রতিটি token:**
- ✅ Encrypted এবং secure storage-এ save হয়
- ✅ Automatically সব GitHub operations-এ use হয়
- ✅ Rate limit exceed হলে auto-switch করে
- ✅ Invalid হলে skip করে next token use করে
- ✅ কোনো manual configuration লাগে না!

**এক জায়গায় token add করলেই সব জায়গায় কাজ করবে!** 🔐🚀
