# 📋 Quick Reference - Adding Content

## Copy-Paste Templates

### ✅ FREE Content
```json
{
  "id": "unique-id-here",
  "title": "Title Here",
  "accessType": "free",
  "description": "Description",
  "category": "category-name",
  "thumbnail": "path/to/image.jpg"
}
```

### 💰 PAID Content
```json
{
  "id": "unique-id-here",
  "title": "Title Here",
  "accessType": "paid",
  "price": {
    "amount": 199,
    "currency": "BDT"
  },
  "description": "Description",
  "category": "category-name",
  "thumbnail": "path/to/image.jpg"
}
```

### 🎁 PAID with Discount
```json
{
  "id": "unique-id-here",
  "title": "Title Here",
  "accessType": "paid",
  "price": {
    "amount": 199,
    "originalPrice": 299,
    "discount": 33,
    "currency": "BDT"
  },
  "description": "Description",
  "category": "category-name",
  "thumbnail": "path/to/image.jpg"
}
```

---

## ⚡ Before Adding Checklist

- [ ] ID is unique
- [ ] `accessType` = `"free"` OR `"paid"`
- [ ] If PAID → has `price.amount`
- [ ] All file paths are correct
- [ ] Thumbnail exists
- [ ] No syntax errors (check https://jsonlint.com)

---

## 🗂️ File Locations

| Content Type | JSON File Location |
|--------------|-------------------|
| **Courses** | `Content Studio/educational-videos/courses.json` |
| **Books** | `Content Studio/books-pdfs/books.json` |
| **Papers** | `Content Studio/research-papers/papers.json` |
| **Projects** | `Projects Code/projects.json` |

---

## 🔧 Validation Tool

**Check for errors BEFORE deploying:**

1. Go to: `/Only-boss/managers/content-validator.html`
2. Click: **Validate All Content**
3. Fix any ❌ errors shown
4. Review ⚠️ warnings
5. Deploy when all clear ✅

---

## ❗ Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| No `accessType` | Defaults to FREE | Add `"accessType": "free"` or `"paid"` |
| `accessType: "paid"` but no `price` | ❌ ERROR | Add `"price": { "amount": 199 }` |
| Forget comma after previous item | ❌ JSON error | Add `,` at end of previous `}` |
| Wrong quotes (`'` instead of `"`) | ❌ JSON error | Use double quotes `"` always |
| Duplicate ID | Conflicts | Make each ID unique |

---

## 💵 Price Guidelines

| Content Level | Suggested Range |
|--------------|-----------------|
| **Beginner** | ৳49 - ৳199 |
| **Intermediate** | ৳199 - ৳499 |
| **Advanced** | ৳499 - ৳999 |
| **Combo Pack** | 20-30% off total |

---

## 🚀 After Adding

1. **Test locally** (browser console: F12)
2. **Validate** (content-validator.html)
3. **Git commit & push**
4. **Check live site** after deploy
5. **Test purchase flow** if PAID

---

## 📞 Need Help?

**Full Guide:** `/Documentation/ADDING-NEW-CONTENT.md`  
**Validation Tool:** `/Only-boss/managers/content-validator.html`  
**Developer:** Contact if technical issue

---

**Last Updated:** March 6, 2026
