---
title: "GitHub Integration & Sync System"
date: 2026-02-12
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: github-integration
tags: [github, sync, api, automation, version-control]
---

# GitHub Integration System

## কেন GitHub Integration?

আমার পুরো website GitHub repository এ hosted। সব content, code, projects সব GitHub এ version-controlled। তাই GitHub API integration করে automatic sync করি।

**Repository:** `github.com/Akhinoor14/A3KM-Studio`  
**Hosting:** GitHub Pages / Vercel

## GitHub Personal Access Token

### Token কী?

GitHub API ব্যবহার করার জন্য একটা secret key দরকার - সেটাই Personal Access Token (PAT).

**Token Scopes Needed:**
- `repo` - Full repository access
- `read:user` - Read user profile
- `write:discussion` - Comment posting (planned)

### Token Generation:

1. GitHub → Settings → Developer Settings
2. Personal Access Tokens → Tokens (classic)
3. Generate New Token (classic)
4. Select scopes: `repo`
5. Generate token → Copy করে save করো

**⚠️ Important:** Token একবারই দেখা যায়! Save না করলে আবার generate করতে হবে।

### Token Storage:

**Only Boss Admin Panel এ store করা হয়:**

**Location:** `Only-boss/managers/shared/`

**Storage Method:**
- localStorage তে encrypted format এ save
- Base64 encoding (basic protection)
- Never exposed in frontend code
- Never committed to GitHub

**Files:**
- `unified-token-manager.js` - Token management logic
- `github-token-manager.js` - GitHub-specific functions
- `token-loader.js` - Auto-load saved token
- `api-config-manager.html` - Token input interface

## Token Management Dashboard

### Token Health Dashboard:

**Location:** `Only-boss/managers/shared/token-health-dashboard.html`

**Features:**
- Token status (Valid / Expired / Invalid)
- Last使用 time
- Expiry countdown (if token has expiry date)
- Quick actions (Test / Refresh / Delete)

### Token Verification Test:

**Test File:** `Only-boss/managers/shared/token-verification-test.html`

**What It Tests:**
1. Token format validation
2. GitHub API connection test
3. Repository access check
4. Read/Write permission verify
5. Rate limit check

**Test Process:**
```javascript
async function verifyToken() {
    const token = getStoredToken();
    const response = await fetch('https://api.github.com/user', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
}
```

## GitHub Sync Features

### 1. **Automatic Content Upload**

যখন Only Boss panel থেকে content upload করি:

**Process:**
1. Content create করি (post/project/book)
2. "Publish" button click করি
3. JavaScript GitHub API call করে
4. File GitHub repository তে upload হয়
5. Commit message auto-generate হয়
6. Success notification show করে

**Files:**
- `Only-boss/managers/posts/github-sync.js`
- `Only-boss/managers/content-editing/github-sync.js`
- `Only-boss/managers/Content-studio/github-content-uploader.js`

### 2. **Real-Time Cross-Device Sync**

Multiple devices থেকে কাজ করলেও sync থাকে:

**How It Works:**
1. Device A থেকে content upload
2. GitHub repository update হয়
3. Device B page refresh করলে new content load হয়
4. Auto-refresh system check করে every 5 minutes

**File:** `Optimization/realtime-github-sync.js`

**Features:**
- Background sync check
- New content notification
- Auto-reload option
- Conflict detection (planned)

### 3. **Automatic Cross-Device Sync**

**Location:** `Optimization/auto-refresh.js`

**What It Does:**
- Checks GitHub for updates every 5 minutes
- Compares last commit hash with current
- If different → new content available
- Shows notification "New content available, refresh?"
- Auto-reload করা যায়

**Implementation:**
```javascript
setInterval(async () => {
    const latestCommit = await fetch(
        'https://api.github.com/repos/Akhinoor14/A3KM-Studio/commits/main'
    );
    const sha = latestCommit.sha;
    if (sha !== lastKnownSHA) {
        showRefreshNotification();
    }
}, 300000); // 5 minutes
```

## GitHub API Usage

### API Endpoints Used:

**1. Get File Content:**
```
GET /repos/Akhinoor14/A3KM-Studio/contents/{path}
```
Used for: Reading JSON data files, fetching content

**2. Create/Update File:**
```
PUT /repos/Akhinoor14/A3KM-Studio/contents/{path}
```
Used for: Uploading new content, updating existing files

**3. Get Repository Info:**
```
GET /repos/Akhinoor14/A3KM-Studio
```
Used for: Stats, last update time

**4. Get Commits:**
```
GET /repos/Akhinoor14/A3KM-Studio/commits
```
Used for: Sync detection, version history

### Rate Limits:

**Authenticated Requests:** 5000 requests/hour  
**Unauthenticated:** 60 requests/hour

**Current Usage:** ~100-200 requests/day  
**Buffer:** More than enough!

## Content Upload Workflow

### Blog Post Upload Example:

1. **Create Post** → `Only-boss/managers/posts/create-post.html`
   - Write content in markdown
   - Select category
   - Add metadata (title, tags, date)
   - Click "Save Draft" or "Publish"

2. **GitHub Sync Triggered**
   - Content converted to markdown format
   - Frontmatter added (YAML metadata)
   - Filename generated: `post-{timestamp}-{slug}.md`
   - API call to GitHub

3. **File Uploaded**
   - Path: `Content Studio/written-posts/`
   - Commit message: "Add new post: {title}"
   - Author: Md Akhinoor Islam
   - Committed to `main` branch

4. **posts.json Updated**
   - New entry added to `Content Studio/written-posts/posts.json`
   - Metadata stored
   - Post immediately visible on website

5. **Success Notification**
   - "Post published successfully!"
   - Shows GitHub commit link
   - Option to view live post

## Version Control Benefits

### History Tracking:
- Every content change tracked
- Can revert to any previous version
- See who changed what and when
- Commit messages explain الت changes

### Backup:
- GitHub is automatic backup
- All content safe in cloud
- Can clone to any device
- Never lose data

### Collaboration:
- Others can contribute (if I allow)
- Pull request system
- Code review possible
- Issue tracking integrated

## API Configuration

### Configuration Manager:

**File:** `Only-boss/managers/shared/api-config-manager.html`

**Settings:**
- Repository name
- Branch name (main/master)
- API base URL
- Timeout duration
- Retry attempts

### API Configuration Check:

**File:** `Only-boss/managers/shared/api-config-check.js`

**Checks:**
- Is token valid?
- Is repository accessible?
- Are file paths correct?
- Is quota sufficient?

## Error Handling

### Common Errors & Solutions:

**1. Token Expired:**
- Error: `401 Unauthorized`
- Solution: Generate new token
- Dashboard shows expiry warning beforehand

**2. Rate Limit Exceeded:**
- Error: `403 Forbidden`
- Solution: Wait 1 hour or use another token
- Dashboard shows remaining quota

**3. File Already Exists:**
- Error: `422 Validation Failed`
- Solution: Use update endpoint instead of create
- Auto-handled in code

**4. Network Error:**
- Error: `Network request failed`
- Solution: Check internet, retry
- Auto-retry 3 times before failing

**5. Invalid Path:**
- Error: `404 Not Found`
- Solution: Check folder structure, fix path
- Validation before API call

## GitHub Actions Integration (Planned)

Future automation plans:

### Auto-Deploy:
- Push to GitHub → Auto-deploy to host
- Run tests before deploy
- Build optimization
- Cache invalidation

### Auto-Backup:
- Daily automatic backup
- Export to external storage
- Database snapshots
- File archives

### Content Processing:
- Image optimization on upload
- Thumbnail generation
- Markdown validation
- Link checking

## Security Best Practices

### What I Do:

✅ **Never commit tokens** - .gitignore করা আছে  
✅ **Encrypt before storage** - Base64 encoded  
✅ **Use minimal scopes** - Only needed permissions  
✅ **Rotate tokens regularly** - Every 6 months  
✅ **Monitor API usage** - Check dashboard daily  
✅ **Log all actions** - Activity tracking  

### What To Avoid:

❌ Token শেয়ার করা  
❌ Public code এ token রাখা  
❌ Browser console এ log করা  
❌ Screenshot এ token দেখানো  
❌ Email/chat এ পাঠানো  

## Sync Troubleshooting

### Problem: Content not syncing

**Check:**
1. Is token valid? → Token Health Dashboard
2. Is internet working? → Network tab in DevTools
3. Is GitHub down? → github.com/status
4. Are file paths correct? → Browser console logs

**Solution:**
- Refresh token
- Check network
- Verify paths
- Retry manual sync

### Problem: Slow sync speed

**Reasons:**
- Large file sizes
- Poor internet connection
- GitHub API rate limiting
- Server load

**Solutions:**
- Compress files before upload
- Use better network
- Batch uploads instead of one-by-one
- Upload during low-traffic hours

---

**শেষ Update:** 2026-02-12  
**GitHub Stars:** আমার repo তে star দিতে ভুলো না! 😊
