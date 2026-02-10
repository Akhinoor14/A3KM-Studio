# GitHub API Sync Setup Guide

## 📖 Overview
Your blog post system now includes **automatic GitHub cloud sync**! Posts saved in your browser will automatically upload to GitHub for permanent cloud storage.

---

## 🚀 Quick Setup

### Step 1: Get GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `A3KM Blog Sync Token`
4. Set expiration: **No expiration** (or your preference)
5. Select these permissions:
   - ✅ `repo` (Full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN** - you won't see it again!

### Step 2: Save Token in Only-boss

1. Open: `Only-boss/dashboard/only-boss-dashboard-redesigned.html`
2. Click **"API Configuration"** card
3. Find **"GitHub API Token"** field
4. Paste your token
5. Click **"Save"**

**OR** Enter token directly when prompted in the Post Creator.

---

## ✨ Features

### 🔄 Automatic Sync
- **Auto-uploads** every time you publish a new post
- Works in the background - no interruption
- Instant cloud backup

### 📊 Sync Status
- **Green**: Successfully synced to GitHub ✅
- **Orange**: Sync failed or offline ⚠️
- **Spinner**: Syncing in progress ⏳

### 🔧 Manual Controls
- **Sync Now**: Force immediate sync
- **Pull**: Download posts from GitHub
- **Push**: Upload local posts to GitHub

---

## 🎯 How It Works

```
User Creates Post → Saves to Browser localStorage → Auto-syncs to GitHub → Appears on Website
                                                    ↓
                                        GitHub Repository (posts.json)
                                                    ↓
                                        Mobile & Desktop can pull from GitHub
```

---

## 📱 Mobile & Desktop Integration

Both mobile and desktop blog listings automatically:
1. Load from local `posts.json` file
2. Merge with posts from browser `localStorage`
3. Display all combined posts seamlessly

**GitHub sync ensures:**
- Posts persist forever (not just in browser)
- Accessible across devices
- Backed up in version control
- Can be edited directly in GitHub if needed

---

## 🛠️ API Configuration Manager

The token is stored via the **API Configuration Manager**:
- Path: `Only-boss/managers/shared/api-config-manager.html`
- Stores in `localStorage` under key: `github_api_token`
- Shared across all Only-boss tools
- Secure (not exposed in code)

---

## ⚙️ Technical Details

### GitHub API Endpoints Used
```
GET  /repos/{owner}/{repo}/contents/{path}  - Fetch posts.json
PUT  /repos/{owner}/{repo}/contents/{path}  - Update posts.json
GET  /rate_limit                            - Check API limits
```

### Rate Limits
- **Authenticated**: 5,000 requests/hour
- **Unauthenticated**: 60 requests/hour

Your blog sync uses minimal requests:
- 1-2 requests per post publish
- Well within limits for normal usage

### File Path in Repository
```
Content Studio/written-posts/posts.json
```

This file stores all blog posts in JSON format:
```json
{
  "posts": [
    {
      "id": "post-001",
      "title": "My First Post",
      "content": "<p>Post content...</p>",
      ...
    }
  ],
  "lastUpdated": "2026-02-10T12:00:00.000Z",
  "syncedFrom": "A3KM Blog Manager"
}
```

---

## 🔐 Security Notes

1. **Token Security**
   - Stored in browser localStorage (client-side only)
   - Never sent to any server except GitHub API
   - Not in public code/commits

2. **Best Practices**
   - Use token with minimal permissions (`repo` only)
   - Regenerate if compromised
   - Set expiration if preferred

3. **Privacy**
   - Posts go to YOUR GitHub repository only
   - You control visibility (public/private repo)
   - Can delete posts from GitHub anytime

---

## 🐛 Troubleshooting

### "Cloud Sync: Offline"
**Cause**: No GitHub token configured  
**Fix**: Follow Step 2 above to add token

### "Sync Failed"
**Possible causes:**
1. Invalid token - regenerate and re-enter
2. Token expired - create new one
3. No internet connection
4. Rate limit exceeded (rare)

**Fix**: Click "Sync Now" button to retry

### "API error: 404"
**Cause**: `posts.json` doesn't exist yet  
**Fix**: System will auto-create on first sync (ignore this error)

### Token Not Working
1. Check token has `repo` permission
2. Verify correct repository name in code: `Akhinoor14/A3KM-Studio`
3. Try regenerating token

---

## 📞 Support

For issues or questions:
- Check browser console for error messages (F12)
- Verify token in API Configuration Manager
- Test with manual "Sync Now" button
- Check GitHub API rate limit status

---

## 🎉 Benefits

✅ **Never lose posts** - backed up on GitHub  
✅ **Version control** - see post history  
✅ **Cross-device** - access from anywhere  
✅ **Automatic** - no manual work  
✅ **Fast** - syncs in 1-2 seconds  
✅ **Reliable** - GitHub's infrastructure  

---

**Created**: February 10, 2026  
**Author**: Md Akhinoor Islam  
**System**: A3KM Blog Manager
