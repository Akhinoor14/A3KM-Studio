# YouTube API Setup Guide

## ⚙️ কিভাবে YouTube API Key পাবে

### Step 1: Google Cloud Console এ যাও
1. যাও: https://console.cloud.google.com/
2. Google account দিয়ে login করো

### Step 2: Project তৈরি কর
1. উপরে **"Select a project"** ক্লিক করো
2. **"New Project"** ক্লিক করো
3. Project name দাও (যেমন: "A3KM Studio API")
4. **"Create"** ক্লিক করো

### Step 3: YouTube Data API v3 Enable কর
1. বাম পাশে **"APIs & Services"** → **"Library"** এ যাও
2. Search box এ লিখ: **"YouTube Data API v3"**
3. Result এ ক্লিক করো
4. **"Enable"** button ক্লিক করো

### Step 4: API Key তৈরি কর
1. বাম পাশে **"APIs & Services"** → **"Credentials"** এ যাও
2. উপরে **"+ CREATE CREDENTIALS"** ক্লিক করো
3. **"API key"** select করো
4. API key তৈরি হয়ে যাবে, copy করে নাও

### Step 5: API Key Restrict কর (Security)
1. **"Restrict Key"** ক্লিক করো অথবা key এর পাশের edit icon ক্লিক করো
2. **Application restrictions** section এ:
   - **"HTTP referrers (websites)"** select করো
   - **"Add an item"** ক্লিক করো
   - তোমার website URL add করো (যেমন: `https://akhinoor14.github.io/*`)
   - আরও URL add করতে পারো যেমন: `http://localhost:*` (testing এর জন্য)

3. **API restrictions** section এ:
   - **"Restrict key"** select করো
   - **"YouTube Data API v3"** select করো

4. **"Save"** ক্লিক করো

### Step 6: API Key Configure কর
1. File খোলো: `Content Studio/video-content/youtube-api-config.js`
2. এই line খুঁজে পাও:
   ```javascript
   API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
   ```
3. Replace করো তোমার actual API key দিয়ে:
   ```javascript
   API_KEY: 'AIzaSyD...',  // তোমার actual key
   ```
4. File save করো

## ✅ Test করো

1. Browser এ `video-gallery.html` খোলো
2. Browser console খোলো (F12 বা Right Click → Inspect)
3. দেখো কোন error আসছে কিনা
4. Success হলে দেখবে:
   - ✅ Video duration সঠিক দেখাচ্ছে (JSON এর fake data না)
   - ✅ View count real-time update হচ্ছে
   - Console এ দেখবে: "✅ Fetched stats for X videos"

## 📊 API Quota Information

**Free Tier Limits:**
- Daily quota: **10,000 units**
- Each video stats request: **1 unit**
- 50 videos per request: **1 unit** (optimal!)

**তোমার gallery এর জন্য:**
- যদি 100টা video থাকে = 2 requests = 2 units
- প্রতিবার page load এ: ~2-3 units
- দিনে 3000+ times page load করতে পারবে!

**Cache System:**
- Stats cache হয় 1 hour এর জন্য
- localStorage এ save থাকে
- Re-visit করলে API call লাগবে না

## 🚨 Common Errors & Solutions

### Error: "API key not valid"
**Solution:**
- API key সঠিকভাবে copy হয়েছে কিনা check কর
- Space বা extra character নেই তো?
- YouTube Data API v3 enable করেছো কিনা check কর

### Error: "Daily quota exceeded"
**Solution:**
- পরের দিন পর্যন্ত অপেক্ষা কর (quota midnight PST এ reset হয়)
- অথবা Billing enable কর (paid tier)
- অথবা cache duration বাড়াও: `CACHE_DURATION: 86400000` (24 hours)

### Error: "Referer not allowed"
**Solution:**
- API key restrictions check কর
- তোমার actual domain/URL add করো
- Local testing এর জন্য `http://localhost:*` add কর

### Warning: "Using static data from videos.json"
**Solution:**
- এটা warning, error না
- Means: API key configure করা নেই
- Video gallery এখনও কাজ করবে, কিন্তু static data দেখাবে

## 🎯 Best Practices

1. **API key secure রাখো:**
   - GitHub এ public করার আগে `.gitignore` এ add কর
   - Client-side key শুধু domain restriction দিয়ে protect কর

2. **Cache optimize কর:**
   - Cache duration minimum 1 hour রাখো
   - localStorage limit (5-10MB) মনে রাখো

3. **Error handling:**
   - API fail করলে fallback to JSON data
   - User এর কাছে error message friendly রাখো

4. **Quota management:**
   - প্রয়োজন ছাড়া API call করো না
   - Batch requests use কর (50 videos at once)
   - Consider increasing cache for production

## 📝 File Structure

```
Content Studio/video-content/
├── video-gallery.html          # Main gallery page (API integrated)
├── youtube-api-config.js       # API configuration (ADD YOUR KEY HERE)
├── videos.json                 # Static data (fallback)
└── YOUTUBE-API-SETUP.md        # This guide
```

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)

---

**Need help?** Console check কর, সেখানে helpful messages পাবে! 💡
