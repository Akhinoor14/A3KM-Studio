# 🔐 Admin Panel Access Guide

## 📍 How to Access Admin Panel

### **Method 1: Local Access (Development)**

যদি তুমি local এ কাজ করো:

**Direct File:**
```
d:\A3KM-Studio\Only-boss\auth\login.html
```
- Simply double-click করে খোলো
- Browser এ `file:///d:/A3KM-Studio/Only-boss/auth/login.html` show করবে

**Via Live Server (Recommended):**
```
http://localhost:5500/Only-boss/auth/login.html
```
- VS Code এ Live Server extension চালু করো
- Right-click on `index.html` → "Open with Live Server"
- Then navigate to: `/Only-boss/auth/login.html`

---

### **Method 2: Production Access (After Deploy)**

Vercel এ deploy করার পর:

**URL Pattern:**
```
https://YOUR-PROJECT-NAME.vercel.app/Only-boss/auth/login.html
```

**How to find YOUR-PROJECT-NAME:**

1. **Via Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Sign in with your account
   - Find your project
   - Copy the domain shown (e.g., `a3km-studio.vercel.app`)

2. **Via Git Repository:**
   - If you deployed from GitHub
   - Project name = Repository name
   - Default: `https://REPO-NAME.vercel.app`

3. **Custom Domain (if set):**
   - যদি custom domain setup করা থাকে
   - Example: `https://a3kmstudio.com/Only-boss/auth/login.html`

---

## 🔑 Login Credentials

### **Step 1: Google Sign In**

Authorized Admin Emails (only these 2 can access):
- ✅ `a3kmstudio@gmail.com`
- ✅ `mdakhinoorislam.official.2005@gmail.com`

**What happens:**
1. Click "Sign in with Google"
2. Google popup opens
3. Select your authorized email
4. If email not in list → ❌ Access Denied
5. If authorized → Proceed to Step 2

---

### **Step 2: Password Entry**

After successful Google sign-in, enter the 6-digit password.

**Password Format:**
- 6 digits (numbers only)
- SHA-256 hashed in system
- Set during initial setup

**Forgot password?**
- Contact developer to reset
- Requires access to Firebase console
- Or check your secure password manager

---

## 📱 Quick Access Links

### **Production URLs** (Replace with your actual domain):

```
Main Site:
https://YOUR-DOMAIN.vercel.app

Admin Login:
https://YOUR-DOMAIN.vercel.app/Only-boss/auth/login.html

Admin Dashboard:
https://YOUR-DOMAIN.vercel.app/Only-boss/dashboard/only-boss-dashboard-redesigned.html
```

### **Local Development URLs:**

```
Main Site:
http://localhost:5500/index.html

Admin Login:
http://localhost:5500/Only-boss/auth/login.html

Admin Dashboard:
http://localhost:5500/Only-boss/dashboard/only-boss-dashboard-redesigned.html
```

---

## 🛡️ Security Features

### **Two-Layer Authentication:**

```
Layer 1: Google OAuth
├─ Checks if email is authorized
├─ Only 2 specific emails allowed
└─ Firebase Authentication

Layer 2: SHA-256 Password
├─ 6-digit numeric password
├─ Hashed before storage
└─ Session-based (expires after closing)
```

### **Session Management:**

- ✅ Secure session storage
- ✅ Auto-logout after browser close
- ✅ Fingerprint validation
- ✅ Timestamp checks
- ⚠️ Don't share session cookies!

---

## 🚨 Troubleshooting

### **Problem: "Not Authorized" error**

**Cause:** Your email is not in the admin list

**Solution:**
1. Check you're using the correct Google account:
   - a3kmstudio@gmail.com OR
   - mdakhinoorislam.official.2005@gmail.com
2. If using correct email but still error:
   - Check Firebase Authentication settings
   - Verify email in admin list in code

**Where to check:**
```javascript
// In: Only-boss/auth/login-script.js
const ADMIN_EMAILS = [
    'a3kmstudio@gmail.com',
    'mdakhinoorislam.official.2005@gmail.com'
];
```

---

### **Problem: Wrong password**

**Cause:** Incorrect 6-digit password entered

**Solution:**
1. Check password manager for correct password
2. Make sure it's 6 digits (numbers only)
3. No spaces before/after
4. If forgotten → Developer reset required

---

### **Problem: Page not loading**

**Cause:** Wrong URL or server not running

**Solution:**

**For Local:**
```bash
# Start live server in VS Code
# OR use Python server:
python -m http.server 8000

# Then navigate to:
http://localhost:8000/Only-boss/auth/login.html
```

**For Production:**
1. Check Vercel deployment status
2. Verify domain is correct
3. Check browser console (F12) for errors
4. Try incognito mode (clear cache)

---

### **Problem: Logged in but dashboard blank**

**Cause:** Session not properly set or JS error

**Solution:**
1. Open browser console (F12)
2. Check for errors (red text)
3. Clear localStorage/sessionStorage:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```
4. Try logging in again

---

### **Problem: Session expires too quickly**

**Cause:** Browser/system clock mismatch or strict security

**Current timeout:** Session ends when browser closes

**To extend (optional):**
```javascript
// In login-script.js, modify:
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours instead of session-only
```

---

## 📋 Admin Panel Features Access

Once logged in, you have access to:

### **Dashboard Cards:**

| Feature | URL Path |
|---------|----------|
| **Payment Requests** | `/Only-boss/managers/payment-requests-manager.html` |
| **User Access Manager** | `/Only-boss/managers/user-access-manager.html` |
| **Combo Packages** | `/Only-boss/managers/combo-manager.html` |
| **Content Validator** | `/Only-boss/managers/content-validator.html` |
| **Content Hub** | `/Only-boss/managers/Content-studio/content-managers-hub.html` |

---

## 🔒 Best Security Practices

### **Do's:**
- ✅ Always logout when done
- ✅ Use strong 6-digit password
- ✅ Don't share credentials
- ✅ Access only from trusted devices
- ✅ Enable 2FA on Google account
- ✅ Keep browser updated

### **Don'ts:**
- ❌ Don't save password in browser
- ❌ Don't access from public WiFi
- ❌ Don't share session cookies
- ❌ Don't leave browser open unattended
- ❌ Don't use on shared computers

---

## 🆘 Emergency Access

### **If locked out:**

1. **Check Email Access:**
   - Can you access the Google account?
   - Try password reset on Google

2. **Check Password:**
   - Do you have backup of 6-digit password?
   - Check password manager

3. **Contact Developer:**
   - If all else fails
   - Developer can reset in Firebase
   - Requires verification of identity

### **Lost Both Email & Password:**
- Developer must reset entire auth system
- Requires direct Firebase console access
- Security verification needed

---

## 📞 Support Contact

**For Admin Access Issues:**
- Developer Email: [Developer's email]
- Response Time: 24-48 hours
- Emergency: [Emergency contact if critical]

**For Technical Issues:**
- Check Documentation folder first
- Review error messages in browser console
- Include screenshots when reporting

---

## ✅ Quick Checklist (First Time Setup)

Before accessing admin panel:

```
□ Vercel deployment complete
□ Firebase project configured
□ Admin emails added to ADMIN_EMAILS array
□ 6-digit password set and saved securely
□ Firebase domain authorized (add Vercel domain)
□ Google OAuth configured in Firebase
□ Test login with both admin emails
□ Verify all manager pages load correctly
□ Bookmark admin login URL
```

---

## 🎯 Quick Start (After Everything Set Up)

**1. Open Admin Login:**
```
Production: https://YOUR-DOMAIN.vercel.app/Only-boss/auth/login.html
Local: http://localhost:5500/Only-boss/auth/login.html
```

**2. Sign in with Google:**
- Use authorized admin email

**3. Enter Password:**
- 6-digit numeric password

**4. Access Dashboard:**
- Automatically redirects to dashboard
- Click cards to access different managers

**5. When Done:**
- Click "Logout" button
- Or close browser (session ends)

---

**Last Updated:** March 6, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
