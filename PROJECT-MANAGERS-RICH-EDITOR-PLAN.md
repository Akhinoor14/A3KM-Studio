# 📋 Project Managers Rich Text Editor Implementation Plan

## Overview
Add full rich text editors (like Content Studio managers) to all Project Manager description fields - both Add/Upload modals and Edit modals. Also upgrade sample templates to use rich HTML formatting.

---

## 📊 Scope Summary

**Total Files:** 5 Project Manager HTML files
**Total Tasks:** 10 major upgrades
- 5 Add/Upload modal description fields
- 5 Edit modal description fields  
- 3 managers have prebuilt templates that need HTML upgrade

---

## 🎯 Files & Details

### 1️⃣ **arduino-manager.html** (Arduino Projects)
**Theme:** Red (#CC0000)

#### Add Modal - `projectDescription` Textarea
- **Current:** Plain `<textarea id="projectDescription">`
- **Location:** ~Line 582
- **Has Templates:** ✅ YES - 3 template buttons
  - Basic Template (`insertTemplate('basic')`)
  - Sensor Project (`insertTemplate('sensor')`)
  - Advanced System (`insertTemplate('advanced')`)
- **Template Function:** Line ~1404
- **Template Format:** Currently plain text with markdown-style formatting (`**bold**`, `- lists`)

**Actions:**
1. Replace textarea with rich text editor (`richProjectDesc`)
2. Add full toolbar (H2/H3, Bold/Italic/Underline/Strikethrough, Super/Sub, Lists, Indent/Outdent, Alignment, Blockquote, HR, Color, Clear, Word Count)
3. Upgrade 3 template functions to output HTML instead of markdown:
   - Convert `**text**` → `<strong>text</strong>`
   - Convert `- item` → `<li>item</li>` in `<ul>`
   - Add proper heading tags `<h2>`, `<h3>`
   - Add blockquotes with styled `<blockquote>` tags
4. Add CSS for `#richProjectDesc`
5. Update template insertion to use `.innerHTML` instead of `.value`

#### Edit Modal - `editDescription` Textarea
- **Current:** Plain `<textarea id="editDescription" class="form-input" rows="4">`
- **Location:** ~Line 2586
- **Populate JS:** Line ~1889, ~2219
- **Save JS:** Line ~1957

**Actions:**
1. Replace textarea with rich text editor (`editRichDesc`)
2. Add full toolbar (same as add modal)
3. Add CSS for `#editRichDesc`
4. Update populate JS: `.value =` → `.innerHTML =`
5. Update save JS: `.value.trim()` → `?.innerHTML || ''`
6. Add DOMContentLoaded functions (color picker, heading/blockquote insert, word count)

---

### 2️⃣ **matlab-manager.html** (MATLAB Projects)
**Theme:** Red (#CC0000)

#### Add Modal - `projectDescription` Textarea
- **Current:** Plain `<textarea id="projectDescription" required>`
- **Location:** ~Line 555
- **Has Templates:** ✅ YES - 3 template buttons
  - Simulation (`insertTemplate('simulation')`)
  - Analysis (`insertTemplate('analysis')`)
  - Visualization (`insertTemplate('visualization')`)
- **Template Function:** Line ~1943
- **Template Format:** Plain text with markdown-style formatting

**Actions:**
1. Replace textarea with rich text editor (`richProjectDesc`)
2. Add full toolbar
3. Upgrade 3 template functions to HTML format:
   - `**Simulation Overview:**` → `<h2>Simulation Overview:</h2>`
   - Lists with `<ul><li>` structure
   - Blockquotes for key sections
4. Add CSS for `#richProjectDesc`
5. Update template insertion to `.innerHTML`

#### Edit Modal - `editDescription` Textarea
- **Current:** Plain `<textarea id="editDescription" rows="4">`
- **Location:** ~Line 2283
- **Populate JS:** Need to locate
- **Save JS:** Need to locate

**Actions:**
1. Replace textarea with rich text editor (`editRichDesc`)
2. Add full toolbar
3. Add CSS for `#editRichDesc`
4. Update populate & save JS
5. Add DOMContentLoaded functions

---

### 3️⃣ **solidworks-manager.html** (SolidWorks Projects)
**Theme:** Red (#CC0000)

#### Add Modal - `projectDescription` Textarea
- **Current:** Plain `<textarea id="projectDescription" required>`
- **Location:** ~Line 511
- **Has Templates:** ✅ YES - 3 template buttons
  - Mechanical Design (`insertTemplate('mechanical')`)
  - Assembly (`insertTemplate('assembly')`)
  - Part (`insertTemplate('part')`)
- **Template Function:** Line ~2225
- **Template Format:** Plain text with markdown formatting

**Actions:**
1. Replace textarea with rich text editor (`richProjectDesc`)
2. Add full toolbar
3. Upgrade 3 template functions to HTML:
   - `**Design Specifications:**` → `<h2>Design Specifications:</h2>`
   - Component lists with proper `<ul><li>`
   - Styled blockquotes for important notes
4. Add CSS for `#richProjectDesc`
5. Update template insertion

#### Edit Modal - `editDescription` Textarea
- **Current:** Plain `<textarea id="editDescription" class="form-input" rows="4">`
- **Location:** ~Line 2527
- **Populate JS:** Need to locate
- **Save JS:** Need to locate

**Actions:**
1. Replace textarea with rich text editor (`editRichDesc`)
2. Add full toolbar
3. Add CSS, update JS
4. Add DOMContentLoaded functions

---

### 4️⃣ **programming-manager.html** (Competitive Programming)
**Theme:** Red (#CC0000)

#### Add Modal - `projectDescription` Textarea
- **Current:** Plain `<textarea class="form-textarea" id="projectDescription" rows="4" required>`
- **Location:** ~Line 560
- **Has Templates:** ❌ NO (competitive programming problems - user writes problem descriptions)

**Actions:**
1. Replace textarea with rich text editor (`richProjectDesc`)
2. Add full toolbar (will help format problem statements with examples, constraints etc.)
3. Add CSS for `#richProjectDesc`
4. Update form save JS to use `.innerHTML`

#### Edit Modal
- **Status:** ❌ NOT FOUND - programming manager may not have edit functionality
- **Action:** Verify if edit modal exists, if not, skip

---

### 5️⃣ **websites-manager.html** (Website Projects)
**Theme:** Red (#CC0000)

#### Add Modal - `fDescription` Textarea
- **Current:** Plain `<textarea class="form-textarea" id="fDescription" required>`
- **Location:** ~Line 473
- **Has Templates:** ❌ NO

**Actions:**
1. Replace textarea with rich text editor (`richFDescription`)
2. Add full toolbar
3. Add CSS for `#richFDescription`
4. Update form save JS

#### Edit Modal - `eDescription` Textarea
- **Current:** Plain `<textarea class="form-textarea" id="eDescription" style="min-height:80px;">`
- **Location:** ~Line 639
- **Populate JS:** ~Line 985 area
- **Save JS:** ~Line 1022 area

**Actions:**
1. Replace textarea with rich text editor (`editRichDescription`)
2. Add full toolbar
3. Add CSS for `#editRichDescription`
4. Update populate: `.value =` → `.innerHTML =`
5. Update save: `.value` → `?.innerHTML || ''`
6. Add DOMContentLoaded functions

---

## 🎨 Rich Text Editor Specifications

### Full Toolbar Features (All Managers)
```
[H2] [H3] [¶ Para] | [B] [I] [U] [S] | [x²] [x₂] | [• List] [1. List] [→] [←] | 
[≡L] [≡C] [≡R] [≡J] | [❝ Quote] [── HR] | [↩] [↪] | [🎨] [✖]
[Word Count: X words]
```

### Editor Styling
- **Theme Color:** Red (`#CC0000`, `#8B0000`)
- **Min Height:** 200px (upload/add), 200px (edit)
- **Background:** Dark red-tinted (`rgba(8,0,0,0.95)`)
- **Toolbar Background:** `rgba(139,0,0,0.12)`
- **Border:** Red theme borders
- **Placeholder:** Light gray semi-transparent
- **Font:** `'Noto Sans Bengali', 'Segoe UI', sans-serif`

### CSS Additions for Each Manager
```css
#richProjectDesc:empty::before { content: attr(data-placeholder); color: rgba(255,255,255,0.3); }
#richProjectDesc h2 { font-size:1.25em; font-weight:700; color:#FF5252; margin:10px 0 4px; }
#richProjectDesc h3 { font-size:1.05em; font-weight:600; color:#FF8A80; margin:8px 0 3px; }
#richProjectDesc blockquote { border-left:3px solid #CC0000; padding:6px 12px; background:rgba(204,0,0,0.08); }
#richProjectDesc hr { border:none; border-top:1px solid rgba(204,0,0,0.4); margin:10px 0; }
```

### JavaScript Functions (Each Modal)
```javascript
// Color picker toggle
function setProjectDescColor(color) { document.execCommand('foreColor', false, color); }

// Heading insertion
function insertProjectDescHeading(tag) { document.execCommand('formatBlock', false, '<' + tag + '>'); }

// Blockquote
function insertProjectDescBlockquote() { document.execCommand('formatBlock', false, '<blockquote>'); }

// Word counter with color feedback
function updateProjectDescWordCount() {
  const words = text.split(/\s+/).length;
  counter.style.color = words < 20 ? '#FF9800' : words > 150 ? '#f44336' : '#4CAF50';
}

// DOMContentLoaded for palette toggle + Tab/Enter handlers
```

---

## 📝 Template HTML Upgrade Examples

### Before (Plain Text Markdown):
```
**Components Used:**
- Arduino UNO
- [Component 1]
- [Component 2]

**Features:**
- [Feature 1]
- Easy to understand
```

### After (Rich HTML):
```html
<h2>Components Used:</h2>
<ul>
  <li>Arduino UNO</li>
  <li><em>[Component 1]</em></li>
  <li><em>[Component 2]</em></li>
</ul>

<h2>Features:</h2>
<ul>
  <li><strong>[Feature 1]</strong></li>
  <li>Easy to understand</li>
</ul>
```

### Template Conversion Rules:
1. `**Heading:**` → `<h2>Heading:</h2>` or `<h3>` for sub-sections
2. `- List item` → `<li>List item</li>` wrapped in `<ul>`
3. `[placeholder]` → `<em>[placeholder]</em>` (italic for user to fill)
4. Important notes → wrap in `<blockquote>`
5. Technical terms → `<strong>term</strong>`
6. Add `<hr>` between major sections

---

## 🔄 Implementation Pattern (Per File)

### For Each Add Modal:
1. **CSS Addition** - Add `#richProjectDesc` styles (or appropriate ID) after existing textarea styles
2. **HTML Replacement** - Replace `<textarea>` with:
   - `<input type="hidden" id="[old-id]">`
   - Full toolbar `<div>` with all buttons
   - `<div id="richProjectDesc" contenteditable="true">`
3. **Template Function Update** (if exists) - Convert markdown to HTML, use `.innerHTML =`
4. **Form Submit JS** - Change `.value` to `.innerHTML`

### For Each Edit Modal:
1. **CSS Addition** - Add `#editRichDesc` styles
2. **HTML Replacement** - Same as add modal
3. **Populate Function** - Change `.value = data` → `.innerHTML = data`
4. **Save Function** - Change `.value` → `?.innerHTML || ''`
5. **DOMContentLoaded** - Add color picker, heading/quote functions, word count, event listeners

---

## ✅ Verification Checklist (Per Manager)

- [ ] Add modal textarea replaced with rich editor
- [ ] Add modal CSS added
- [ ] Add modal templates upgraded to HTML (if applicable)
- [ ] Add modal form submit uses `.innerHTML`
- [ ] Edit modal textarea replaced with rich editor  
- [ ] Edit modal CSS added
- [ ] Edit modal populate uses `.innerHTML`
- [ ] Edit modal save uses `.innerHTML`
- [ ] Edit modal DOMContentLoaded functions added
- [ ] Color palette works
- [ ] Word count updates
- [ ] Tab indentation works in lists
- [ ] Enter exits nested lists properly
- [ ] All toolbar buttons functional

---

## 🚀 Execution Order

**Phase 1 - Template Managers** (Priority - have sample templates to upgrade):
1. arduino-manager.html (add + edit + 3 templates)
2. matlab-manager.html (add + edit + 3 templates)
3. solidworks-manager.html (add + edit + 3 templates)

**Phase 2 - Simple Managers**:
4. websites-manager.html (add + edit, no templates)
5. programming-manager.html (add only, verify edit exists)

---

## 📦 Total Modifications Per File

### arduino-manager.html
- 10 replacements (5 add modal, 5 edit modal)
- Plus 3 template function upgrades

### matlab-manager.html  
- 10 replacements (5 add modal, 5 edit modal)
- Plus 3 template function upgrades

### solidworks-manager.html
- 10 replacements (5 add modal, 5 edit modal)
- Plus 3 template function upgrades

### websites-manager.html
- 10 replacements (5 add modal, 5 edit modal)

### programming-manager.html
- 5 replacements (add modal only, unless edit exists)

---

## 💾 Pattern Reference from Content Studio

Use the **EXACT same pattern** successfully applied to:
- books-manager-new.html → `richSummary` (add), `editRichSummary` (edit)
- papers-manager.html → `richAbstract` (add), `editRichAbstract` (edit)
- educational-videos-manager.html → `richCourseSummary` (add), `editRichCourseSummary` (edit)
- vlogs-manager.html → `richVlogDesc` (add), `editRichVlogDesc` (edit)
- posts-manager.html → `richPostDesc` (add), `editRichPostDesc` (edit)

All use identical toolbar, styling, and event handling.

---

## ⚠️ Special Considerations

1. **Project Manager Templates:** Must convert plain text with markdown formatting to actual HTML
2. **Color Consistency:** All project managers use red theme (#CC0000)
3. **Placeholder Text:** Keep existing placeholder hints
4. **Required Fields:** Maintain `required` validation logic in hidden input
5. **Form Structure:** Some managers use `.form-grid`, others use custom layouts
6. **Word Count:** Red if > 150 words, Orange if < 20 words, Green otherwise

---

## 📊 Estimated Complexity

| Manager | Add Modal | Edit Modal | Templates | Total |
|---------|-----------|------------|-----------|-------|
| Arduino | 5 edits | 5 edits | 3 upgrades | **13** |
| MATLAB | 5 edits | 5 edits | 3 upgrades | **13** |
| SolidWorks | 5 edits | 5 edits | 3 upgrades | **13** |
| Websites | 5 edits | 5 edits | - | **10** |
| Programming | 5 edits | TBD | - | **5-10** |
| **TOTAL** | | | | **54-59 operations** |

---

## 🎯 Success Criteria

1. ✅ All description fields use rich text editor
2. ✅ Sample templates insert properly formatted HTML
3. ✅ Edit modals load existing HTML content correctly
4. ✅ Save functions preserve HTML formatting
5. ✅ All toolbar buttons work (bold, lists, colors, etc.)
6. ✅ Word count displays with color feedback
7. ✅ Consistent red theme styling across all managers
8. ✅ No console errors
9. ✅ Existing projects display correctly in edit mode

---

**Created:** March 7, 2026  
**Status:** 📋 Plan Ready - Awaiting Approval  
**Next Step:** Get user approval, then execute phase by phase
