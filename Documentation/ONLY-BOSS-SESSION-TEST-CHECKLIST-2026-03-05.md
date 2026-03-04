---
title: "Only Boss Session Test Checklist"
date: 2026-03-05
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: testing-verification
tags: [only-boss, checklist, qa, command-center, books-manager, api-monitor]
---

# ✅ Only Boss Session - Test Checklist (Post-Fix)

এই checklist follow করলে পুরো session‑এ করা fix গুলো UI level + functional level verify করা যাবে।

---

## 1) Command Center - API Status Verification

### Steps
1. Open `Only-boss/managers/shared/command-center.html`
2. API Configuration tab এ থাকুন
3. Page load হওয়ার 2–5 seconds wait করুন

### Expected
- GitHub API: `Connected ✅ (username)`
- Rate Limit: `xxxx/5000` format
- Uploader: `Ready ✅`
- Live API Call Monitor panel visible
- API Call History panel visible

### Fail Signs
- `Username: undefined`
- `No Token` even when token exists
- Monitor panel hidden/blank

---

## 2) Test Connection Button Verification

### Steps
1. `Test Connection` button click
2. Toast/result message observe করুন
3. Live API monitor values update হচ্ছে কিনা দেখুন

### Expected
- Success message includes username
- Last API URL update
- Last call time refresh
- Response status shows `200 OK`
- Rate limit snapshot updated
- History panel এ new entry add

---

## 3) Dashboard Navigation Verification

### Steps
1. Open redesigned dashboard
2. `Content Managers` single card click
3. Hub page থেকে Books/Papers/Videos/Vlogs/Posts এ navigate করুন

### Expected
- Single consolidated card visible
- Hub থেকে 5 manager link works
- No duplicate content manager cards in command center

---

## 4) Script Path Integrity Verification

### Target Managers
- books-manager-new.html
- papers-manager.html
- educational-videos-manager.html
- vlogs-manager.html
- posts-manager.html

### Expected
- No 404 for:
  - `../shared/unified-token-manager.js`
  - `../shared/central-api-gateway.js`
- No `CentralAPIGateway is not defined`

---

## 5) Books Category Dropdown Verification

### Steps
1. Open Books Manager upload tab
2. Category field click
3. Search input এ `arti` লিখুন
4. `Artificial Intelligence` select করুন

### Expected
- Grouped category dropdown visible
- Search suggestions real-time filter
- Match count updates
- Selection হলে display updates with selected value
- Hidden category input populated

---

## 6) Upload Submit Pre-Validation Verification

### Steps
1. Required fields পূরণ করুন
2. Category select না করে submit (negative test)
3. Category select করে submit (positive flow)

### Expected
- No category হলে validation alert
- Category selected হলে এগিয়ে যায়
- `GITHUB_TOKEN is not defined` error আর আসে না

---

## 7) Token Indicator Verification (Books Page)

### Steps
1. Books Manager reload করুন
2. Header badge observe করুন
3. Refresh/debug actions trigger করুন (if available)

### Expected
- Badge states:
  - Checking → Active অথবা Missing/Error
- Active হলে username show করতে পারে

---

## 8) Live vs Static Proof (UI-Based)

### Steps
1. Command Center monitor panel দেখুন
2. 30–90 second wait করুন (auto refresh window)
3. `Test Connection` আবার click করুন

### Expected
- Last call time changes
- History panel new row add করে
- Rate limit count or timestamp refresh হয়
- Response duration changes across calls

---

## 9) Smoke Regression (Quick)

- Command Center খুলছে ✅
- Dashboard খুলছে ✅
- Hub page খুলছে ✅
- Books Manager load হচ্ছে ✅
- Category select কাজ করছে ✅
- Upload submit handler crash করছে না ✅

---

## 10) If Any Failure Happens

1. Hard reload (`Ctrl + Shift + R`)
2. Token আবার save করুন (API Config)
3. Test Connection run করুন
4. তারপর books flow পুনরায় test করুন
5. Persist করলে affected file + timestamp note করে fix report update করুন

---

## Pass/Fail Record Template

| Test Area | Result | Notes |
|-----------|--------|-------|
| API status | ⬜ Pass / ⬜ Fail | |
| Test connection | ⬜ Pass / ⬜ Fail | |
| Manager paths | ⬜ Pass / ⬜ Fail | |
| Category dropdown | ⬜ Pass / ⬜ Fail | |
| Upload validation | ⬜ Pass / ⬜ Fail | |
| Live monitor | ⬜ Pass / ⬜ Fail | |

---

**শেষ Update:** 2026-03-05
