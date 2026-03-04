---
title: "CV File Rename & Sitewide Link Fix"
description: "Documents the renaming of the CV PDF file from a problematic filename with apostrophe, spaces, and @ symbol to a clean URL-safe filename, and the bulk update of all 34 HTML files across desktop and mobile that referenced the old filename."
date: 2026-03-05
lastUpdated: 2026-03-05
version: "1.0.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: development-setup
difficulty: beginner
readTime: "6 min"
wordCount: 900
tags: [cv, pdf, fix, rename, vercel, deployment, broken-links]
status: complete
featured: false
prerequisites:
  - "Access to the A3KM Studio project root"
  - "PowerShell (Windows)"
relatedDocs:
  - "./NAVBAR-STANDARDIZATION.md"
  - "../01-website-overview/HOME-PAGE-BUILD.md"
changelog:
  - version: "1.0.0"
    date: "2026-03-05"
    changes: "Initial documentation of the CV rename fix"
---

# 📄 CV File Rename & Sitewide Link Fix

> **📚 Overview:** The CV download button was broken across the entire A3KM Studio website when deployed on Vercel. The root cause was the PDF filename containing an apostrophe, spaces, and an `@` symbol — characters that break URL encoding in production. This document explains the fix: rename the file to a clean URL-safe name, then update all 34 HTML files that referenced it.

---

## 📋 Table of Contents

- [🐛 The Problem](#the-problem)
- [🔍 Root Cause Analysis](#root-cause-analysis)
- [✅ The Fix](#the-fix)
- [📂 Files Updated](#files-updated)
- [🔄 How to Update CV in Future](#how-to-update-cv-in-future)

---

## 🐛 The Problem {#the-problem}

The CV download button across every page of the website linked to a file that **appeared to work locally** on Windows but **broke completely on Vercel** (cloud deployment).

**Symptom:** Clicking "Download CV" on any page resulted in a 404 error or a download that failed silently.

---

## 🔍 Root Cause Analysis {#root-cause-analysis}

**Old filename:**
```
Md Akhinnor Islam's CV @2026.pdf
```

This filename contains three categories of problematic characters:

| Character | Problem |
|---|---|
| `'` (apostrophe) | Breaks URL parsing; becomes `%27` which confuses some servers |
| ` ` (spaces) | Must be URL-encoded as `%20`; unreliable across hosting platforms |
| `@` (at symbol) | Has special meaning in URLs (user:pass@host); breaks Vercel routing |

**On Windows locally:** Windows file system and browsers handle these characters tolerantly via local `file://` paths.

**On Vercel (production):** The HTTPS URL `https://a3km.vercel.app/About%20me/CV/Md%20Akhinnor%20Islam%27s%20CV%20%402026.pdf` fails because Vercel's static file server rejects the `@` symbol in path-encoded form.

---

## ✅ The Fix {#the-fix}

### Step 1 — Rename the File

```powershell
Rename-Item `
  -Path "d:\Skill\Website\A3KM Studio\About me\CV\Md Akhinnor Islam's CV @2026.pdf" `
  -NewName "Akhinoor_Islam_CV_2026.pdf"
```

**New filename:** `Akhinoor_Islam_CV_2026.pdf`

Rules followed in the new name:
- ✅ No spaces (replaced with `_`)
- ✅ No apostrophes
- ✅ No `@` symbol
- ✅ No special URL characters
- ✅ Descriptive and professional

**New file path:**
```
A3KM Studio/About me/CV/Akhinoor_Islam_CV_2026.pdf
```

### Step 2 — Bulk Update All HTML Files (Desktop)

A PowerShell script was used to replace all occurrences of the old filename pattern across all desktop HTML files:

```powershell
$files = Get-ChildItem -Path "d:\Skill\Website\A3KM Studio" `
  -Recurse -Include "*.html" `
  -Exclude "*\mobile\*", "*\Archive\*" | 
  Where-Object { $_.FullName -notmatch "\\mobile\\" -and $_.FullName -notmatch "\\Archive\\" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -match "Akhinnor Islam|@2026|Islam%27s|%40") {
        $newContent = $content `
            -replace [regex]::Escape("Md Akhinnor Islam's CV @2026.pdf"), "Akhinoor_Islam_CV_2026.pdf" `
            -replace [regex]::Escape("Md%20Akhinnor%20Islam%27s%20CV%20%402026.pdf"), "Akhinoor_Islam_CV_2026.pdf" `
            -replace [regex]::Escape("Md%20Akhinoor%20Islam%27s%20CV%20%402026.pdf"), "Akhinoor_Islam_CV_2026.pdf"
        Set-Content $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated: $($file.Name)"
    }
}
```

**Result:** 33 desktop HTML files updated.

### Step 3 — Fix Mobile Home File

The mobile homepage had a URL-encoded old path that needed manual correction:

**File:** `mobile/home/index.html` line 237  
**Old value:**
```
../../About%20me/CV/Md%20Akhinnor%20Islam%27s%20CV%20%402026.pdf
```
**New value:**
```
../../About me/CV/Akhinoor_Islam_CV_2026.pdf
```

---

## 📂 Files Updated {#files-updated}

### Desktop HTML Files (33 files)

All files in `A3KM Studio/` root and subdirectories (excluding `mobile/` and `Archive/`):

| Category | Files |
|---|---|
| Homepage | `Home/index.html` |
| About | `About me/about.html` |
| Contact | `Contact/contact.html` |
| Content Studio hub | `Content Studio/hub.html` |
| All Content Studio pages | books-pdfs, educational-videos, research-papers, written-posts, video-content |
| All Project pages | Every `.html` in `Projects Code/` |
| Documentation pages | `Documentation/index.html`, `viewer.html`, `viewer-enhanced.html` |
| Archive/legacy pages | Several archived index pages |

### Mobile HTML Files (1 file)

| File | Fix Applied |
|---|---|
| `mobile/home/index.html` | URL-encoded old path → new clean path |

### Mobile Files Already Correct (no change needed)

All other mobile pages (`mobile/about/`, `mobile/projects/`, `mobile/content-studio/` etc.) already contained the correct new filename from a prior update — no change was needed.

---

## 🔄 How to Update CV in Future {#how-to-update-cv-in-future}

When uploading a new CV version:

### ✅ Rules for CV File Naming

1. **No spaces** — use underscores instead: `Akhinoor_Islam_CV_2027.pdf`
2. **No apostrophes** — never use `'` in filenames
3. **No @ symbol** — never use `@` in filenames
4. **No parentheses, brackets, or special chars** — stick to letters, numbers, underscores, hyphens
5. **ASCII only** — no Unicode characters in filenames

### Steps to Update

1. **Place new CV file:**
   ```
   A3KM Studio/About me/CV/Akhinoor_Islam_CV_2027.pdf
   ```

2. **Bulk update all links** using PowerShell:
   ```powershell
   Get-ChildItem -Path "d:\Skill\Website\A3KM Studio" -Recurse -Include "*.html" |
   ForEach-Object {
       $c = Get-Content $_.FullName -Raw -Encoding UTF8
       if ($c -match "Akhinoor_Islam_CV_2026") {
           $c = $c -replace "Akhinoor_Islam_CV_2026", "Akhinoor_Islam_CV_2027"
           Set-Content $_.FullName -Value $c -Encoding UTF8
           Write-Host "Updated: $($_.Name)"
       }
   }
   ```

3. **Delete old CV file** (optional, after confirming new one works on Vercel).

---

## ⚠️ Important Notes

- Vercel serves static files. Any filename with `'`, `@`, or unencoded spaces in the path will **fail silently** or give a 404 on production even if it works locally.
- The `download="..."` attribute in anchor tags controls the **suggested filename** for the browser download dialog. Always keep this in sync with the actual filename:
  ```html
  <a href="../About me/CV/Akhinoor_Islam_CV_2026.pdf"
     download="Akhinoor_Islam_CV_2026.pdf">
  ```
- The `CV_PDF_PATH` JavaScript variable (used by the PDF viewer) must also be updated when changing the CV filename. Search for `CV_PDF_PATH` across all files when renaming.
