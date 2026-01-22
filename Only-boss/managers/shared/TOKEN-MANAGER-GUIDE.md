# Centralized GitHub Token Manager

## 🎯 Overview
একবার GitHub token input দিলে সব managers (Content Studio + Certificate Manager) এ automatically কাজ করবে।

## 📁 Files Created

### 1. `github-token-manager.js` (Core Logic)
**Location:** `Only-boss/managers/shared/`

**Features:**
- ✅ Token save/load from localStorage
- ✅ Token validation with GitHub API
- ✅ Token encryption (basic with base64)
- ✅ Token expiry tracking (90 days)
- ✅ Status monitoring
- ✅ Singleton pattern for consistency

### 2. `token-input-card.html` (UI Card)
**Location:** `Only-boss/managers/shared/`

**Features:**
- ✅ Beautiful gradient UI
- ✅ Token input with show/hide
- ✅ Save, Validate, Clear buttons
- ✅ Status display (valid/invalid/expired)
- ✅ Progress bar
- ✅ Shows all 6 connected managers
- ✅ Responsive design

## 🔧 How to Use in Managers

### Method 1: Direct Import in HTML
```html
<!-- Add to any manager HTML file -->
<script src="../shared/github-token-manager.js"></script>

<script>
  // Get token
  const token = githubTokenManager.getToken();
  
  // Check if token exists
  if (githubTokenManager.hasToken()) {
    // Use token
    const uploader = new GitHubContentUploader({
      token: token,
      owner: 'Akhinoor14',
      repo: 'A3KM-Studio'
    });
  } else {
    alert('Please set GitHub token first!');
    window.location.href = '../shared/token-input-card.html';
  }
</script>
```

### Method 2: Check Token on Page Load
```javascript
// Add to manager's initialization
window.addEventListener('DOMContentLoaded', () => {
  // Check token
  if (!githubTokenManager.hasToken()) {
    const redirect = confirm(
      'GitHub token not found! Go to Token Manager?'
    );
    if (redirect) {
      window.location.href = '../shared/token-input-card.html';
    }
    return;
  }
  
  // Validate token
  const status = githubTokenManager.getTokenStatus();
  if (status.expired) {
    alert('Token expired! Please update token.');
    window.location.href = '../shared/token-input-card.html';
    return;
  }
  
  // Token is good, proceed
  initializeManager();
});
```

### Method 3: Auto-initialize GitHub Uploader
```javascript
// Helper function to get uploader with token
function getGitHubUploader() {
  const token = githubTokenManager.getToken();
  
  if (!token) {
    throw new Error('No GitHub token found!');
  }
  
  return new GitHubContentUploader({
    token: token,
    owner: 'Akhinoor14',
    repo: 'A3KM-Studio',
    onProgress: (msg) => console.log(msg),
    onError: (err) => console.error(err)
  });
}

// Usage in upload function
async function uploadContent() {
  try {
    const uploader = getGitHubUploader();
    // Use uploader...
  } catch (error) {
    alert(error.message);
    window.location.href = '../shared/token-input-card.html';
  }
}
```

## 🎨 Token Card Features

### Status Display
- **No Token**: Red - token দিতে হবে
- **Valid**: Green - token ঠিক আছে
- **Invalid**: Red - token expired বা invalid
- **Days Until Expiry**: Token কতদিন valid থাকবে

### Actions
1. **💾 Save Token**: Token save করবে + validate করবে
2. **✓ Validate**: Existing token validate করবে
3. **🗑️ Clear Token**: Token delete করবে (confirmation সহ)

### Connected Managers (6)
1. 📚 Books Manager
2. 🎥 Videos Manager  
3. 📄 Papers Manager
4. 📝 Posts Manager
5. 📹 Vlogs Manager
6. 🎓 Certificates Manager

## 📊 Implementation Plan

### Phase 1: Update All Managers ✅ (To Do)
Each manager এ add করতে হবে:

**Books Manager:**
```html
<script src="../shared/github-token-manager.js"></script>
```

**Videos Manager:**
```html
<script src="../shared/github-token-manager.js"></script>
```

**Papers Manager:**
```html
<script src="../shared/github-token-manager.js"></script>
```

**Posts Manager:**
```html
<script src="../shared/github-token-manager.js"></script>
```

**Vlogs Manager:**
```html
<script src="../shared/github-token-manager.js"></script>
```

**Certificates Manager:**
```html
<script src="../shared/github-token-manager.js"></script>
```

### Phase 2: Remove Individual Token Inputs
প্রতিটি manager থেকে individual GitHub token input field remove করে:
```javascript
// Old code (REMOVE):
<input type="password" id="githubToken" placeholder="Enter GitHub token">

// New code (KEEP):
// Token automatically loaded from githubTokenManager
const token = githubTokenManager.getToken();
```

### Phase 3: Add Token Check Button
প্রতিটি manager এ একটা button add করতে হবে:
```html
<button onclick="window.open('../shared/token-input-card.html', '_blank')">
  🔐 Manage GitHub Token
</button>
```

## 🔐 Security Features

### 1. Basic Encryption
- Token saved as base64 (not plain text)
- Not true encryption but better than nothing

### 2. Validation
- Checks token format (ghp_ or github_pat_)
- Validates with GitHub API
- Shows validation status

### 3. Expiry Tracking
- Tracks when token was added
- Shows days until expiry (90 days default)
- Warns if expired

### 4. Status Monitoring
- Valid/Invalid/Expired states
- Last validated timestamp
- Visual indicators

## 📝 API Reference

### GitHubTokenManager Class

#### Methods:
- `saveToken(token)` - Save token to localStorage
- `getToken()` - Get token from localStorage
- `hasToken()` - Check if token exists
- `clearToken()` - Remove token
- `validateToken(token)` - Validate with GitHub API
- `isTokenExpired()` - Check if >90 days old
- `getTokenStatus()` - Get full status object
- `getTokenInfo()` - Get display info

#### Usage Example:
```javascript
// Save token
githubTokenManager.saveToken('ghp_xxxxxx');

// Get token
const token = githubTokenManager.getToken();

// Check status
const status = githubTokenManager.getTokenStatus();
console.log(status.valid); // true/false
console.log(status.expired); // true/false

// Get info for UI
const info = githubTokenManager.getTokenInfo();
console.log(info.maskedToken); // "ghp_xxxx...xxxx"
console.log(info.daysUntilExpiry); // 85
```

## 🚀 Next Steps

1. **Test Token Card**: Open `token-input-card.html` এবং token input দিয়ে test করো
2. **Update Managers**: সব managers এ githubTokenManager import করো
3. **Remove Old Inputs**: Individual token inputs remove করো
4. **Add Links**: প্রতিটি manager এ token card এর link add করো
5. **Test Integration**: সব managers থেকে upload test করো

## ✅ Benefits

1. **একবার input**: Token একবার দিলেই হবে
2. **Automatic sync**: সব managers এ auto-load হবে
3. **Centralized control**: একটা জায়গা থেকে manage করা যাবে
4. **Status monitoring**: Token কখন expire হবে দেখা যাবে
5. **Better UX**: Users কে bar bar token দিতে হবে না
6. **Security**: Basic encryption + validation

## 🎯 Summary

আগে: প্রতিটি manager এ আলাদা আলাদা token input করতে হতো (6 বার)
এখন: একবার token দিলে সব জায়গায় কাজ করবে (1 বার) ✨

Token Manager Card খুলে token দাও → সব managers এ auto-load হবে! 🚀
