# 🖥️ PROGRAMMING SECTION — FULL PLAN & ANALYSIS
> A3KM Studio | Md Akhinoor Islam | March 2026

---

## 1. কেন এই সেকশন থাকা উচিত — Portfolio Analysis

### 🌍 Top Programmers তাদের Portfolio-তে কী রাখে?

Research করে দেখা গেছে world-class programmer portfolios (ThePrimagen, Fireship, NeetCode, Lee215, Errichto, etc.) এ যা থাকে:

| Segment | কেন রাখে |
|---|---|
| **Problem Solving** (LeetCode/Codeforces solutions) | Problem-solving ability প্রমাণ করতে |
| **Data Structures implementations** | Core computer science দক্ষতা দেখাতে |
| **Algorithm implementations** | Algorithmic thinking দেখাতে |
| **Mini Projects / Scripts** | Practical coding ability প্রমাণ করতে |
| **Language-specific challenges** | Specific language mastery দেখাতে |
| **Automation tools** | Real-world use case দেখাতে |
| **Competitive programming** | Speed + accuracy প্রমাণ করতে |
| **Code explanations + comments** | Teaching ability + depth বোঝাতে |

### ✅ তোমার Portfolio-তে কী রাখা উচিত

তুমি এখন Python শিখছ, KUET Engineering student, A3KM Studio creator। তোমার জন্য specific priority:

**Phase 1 — এখনই শুরু (Python learning journey):**
- ✅ Pattern printing (শুরুর দিকের problems)
- ✅ Basic algorithms (sorting, searching)
- ✅ Problem solving — Easy/Medium (LeetCode/HackerRank)
- ✅ Python scripts (automation, calculators, tools)
- ✅ Data structures — list, dict, set implementations

**Phase 2 — বাড়তে থাকলে add করবে:**
- ✅ OOP projects in Python
- ✅ File processing / data analysis (NumPy, Pandas)
- ✅ Web scraping scripts
- ✅ API integration projects
- ✅ JavaScript problem solving

**Phase 3 — Advanced:**
- ✅ C/C++ competitive programming
- ✅ Algorithm visualizations
- ✅ Database query solutions (SQL)
- ✅ Multi-language comparison (same problem, diff languages)

---

## 2. Home Page Card Design

### 📦 Card এর নাম ও Position

- **Card title:** `Programming`  
- **Icon:** `<i class="fas fa-code"></i>` (বা `fa-terminal`)  
- **Color accent:** তোমার theme এর মতোই — Dark Red/Black/White  
- **Position:** Projects section-এর পরে, অথবা Content Studio-তে নতুন row  

### 🎨 Card-এ কী দেখাবে

```
┌─────────────────────────────────────────────┐
│  < / >  PROGRAMMING                         │
│  ─────────────────────────────────────────  │
│  Python · JavaScript · C++ · MATLAB         │
│                                             │
│  [42 Solutions]  [8 Projects]  [5 Scripts]  │
│                                             │
│  ● Easy  ●● Medium  ●●● Hard               │
│                                             │
│  [🔴 Explore Code →]                        │
└─────────────────────────────────────────────┘
```

### Card Data (programs.json-এ থাকা stats থেকে dynamic):
- Total solutions count
- Language badges (Python, JS, C++)
- Difficulty distribution
- Latest added date

---

## 3. Data Structure — `programs.json`

**Path:** `d:\Skill\Website\A3KM Studio\Content Code\programming\programs.json`

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-03-06T00:00:00Z",

  "statistics": {
    "total": 0,
    "byLanguage": {
      "python": 0, "javascript": 0, "cpp": 0,
      "java": 0, "matlab": 0, "c": 0
    },
    "byDifficulty": { "easy": 0, "medium": 0, "hard": 0 },
    "byCategory": {
      "problem-solving": 0, "data-structures": 0,
      "algorithms": 0, "mini-projects": 0,
      "automation": 0, "pattern-printing": 0
    }
  },

  "languages": [
    {
      "id": "python",
      "name": "Python",
      "icon": "fab fa-python",
      "color": "#3776AB",
      "badge": "#FFD43B",
      "version": "3.12",
      "canRunInBrowser": true,
      "runner": "pyodide"
    },
    {
      "id": "javascript",
      "name": "JavaScript",
      "icon": "fab fa-js-square",
      "color": "#F7DF1E",
      "badge": "#000000",
      "version": "ES2024",
      "canRunInBrowser": true,
      "runner": "native-eval"
    },
    {
      "id": "cpp",
      "name": "C++",
      "icon": "fas fa-copyright",
      "color": "#00599C",
      "badge": "#ffffff",
      "version": "C++17",
      "canRunInBrowser": false,
      "runner": "judge0"
    },
    {
      "id": "java",
      "name": "Java",
      "icon": "fab fa-java",
      "color": "#ED8B00",
      "badge": "#ffffff",
      "canRunInBrowser": false,
      "runner": "judge0"
    },
    {
      "id": "c",
      "name": "C",
      "icon": "fas fa-c",
      "color": "#A8B9CC",
      "badge": "#000000",
      "canRunInBrowser": false,
      "runner": "judge0"
    }
  ],

  "categoryGroups": [
    {
      "id": "problem-solving",
      "name": "Problem Solving",
      "icon": "fas fa-puzzle-piece",
      "order": 1,
      "subcategories": [
        "Arrays & Strings",
        "Linked Lists",
        "Stacks & Queues",
        "Trees & Graphs",
        "Dynamic Programming",
        "Greedy Algorithms",
        "Backtracking",
        "Binary Search",
        "Two Pointers",
        "Sliding Window",
        "Math & Number Theory",
        "Bit Manipulation",
        "Hash Maps",
        "Sorting & Searching",
        "Matrix",
        "Intervals"
      ]
    },
    {
      "id": "data-structures",
      "name": "Data Structures",
      "icon": "fas fa-layer-group",
      "order": 2,
      "subcategories": [
        "Array Implementation",
        "Linked List",
        "Stack",
        "Queue",
        "Hash Table",
        "Binary Tree",
        "BST",
        "Heap",
        "Graph",
        "Trie"
      ]
    },
    {
      "id": "algorithms",
      "name": "Algorithms",
      "icon": "fas fa-diagram-project",
      "order": 3,
      "subcategories": [
        "Sorting Algorithms",
        "Searching Algorithms",
        "Graph Algorithms",
        "String Algorithms",
        "Mathematical Algorithms",
        "Divide & Conquer",
        "Dynamic Programming Patterns"
      ]
    },
    {
      "id": "mini-projects",
      "name": "Mini Projects",
      "icon": "fas fa-rocket",
      "order": 4,
      "subcategories": [
        "Calculators & Tools",
        "File Processing",
        "Web Scraping",
        "API Integration",
        "Data Analysis",
        "Games",
        "Utilities"
      ]
    },
    {
      "id": "automation",
      "name": "Automation Scripts",
      "icon": "fas fa-robot",
      "order": 5,
      "subcategories": [
        "File Automation",
        "Text Processing",
        "Web Automation",
        "System Scripts",
        "Batch Processing"
      ]
    },
    {
      "id": "pattern-printing",
      "name": "Pattern Printing",
      "icon": "fas fa-border-all",
      "order": 6,
      "subcategories": [
        "Star Patterns",
        "Number Patterns",
        "Character Patterns",
        "Diamond Patterns",
        "Pyramid Patterns"
      ]
    }
  ],

  "programs": [
    {
      "id": "prog-001",
      "title": "Two Sum",
      "slug": "two-sum",
      "language": "python",
      "category": "problem-solving",
      "subcategory": "Arrays & Strings",
      "difficulty": "Easy",
      "difficultyLevel": 1,
      "source": "LeetCode",
      "sourceNumber": "1",
      "sourceUrl": "",
      "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "approach": "HashMap single pass — store complement as key",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "tags": ["HashMap", "Array", "Two Pass", "Classic"],
      "codeFile": "../../Content Storage/programming/python/problem-solving/arrays-strings/two-sum.py",
      "hasTestCases": true,
      "testCases": [
        { "input": "[2,7,11,15]\n9", "expectedOutput": "[0,1]", "label": "Basic" },
        { "input": "[3,2,4]\n6", "expectedOutput": "[1,2]", "label": "Non-obvious" },
        { "input": "[3,3]\n6", "expectedOutput": "[0,1]", "label": "Duplicate" }
      ],
      "sampleInput": "[2,7,11,15]\ntarget = 9",
      "sampleOutput": "[0, 1]",
      "notes": "Classic starter problem. Key insight: complement = target - nums[i]",
      "thumbnail": "",
      "dateAdded": "2026-03-06",
      "featured": true
    }
  ]
}
```

---

## 4. File / Folder Structure

```
A3KM Studio/
├── Content Studio/
│   └── programming/
│       ├── programming-listing.html      ← Listing page (book-listing template)
│       └── code-viewer.html              ← Viewer/runner page
│
├── Content Code/
│   └── programming/
│       └── programs.json                 ← Single source of truth
│
├── Content Storage/
│   └── programming/
│       ├── python/
│       │   ├── problem-solving/
│       │   │   ├── arrays-strings/
│       │   │   ├── linked-lists/
│       │   │   ├── trees-graphs/
│       │   │   ├── dynamic-programming/
│       │   │   └── ...
│       │   ├── data-structures/
│       │   ├── algorithms/
│       │   ├── mini-projects/
│       │   ├── automation/
│       │   └── pattern-printing/
│       ├── javascript/
│       │   └── problem-solving/
│       ├── cpp/
│       │   └── problem-solving/
│       ├── java/
│       └── c/
│
└── Only-boss/
    └── managers/
        └── Content-studio/
            └── programming-manager.html  ← Upload/Edit/Delete manager
```

---

## 5. Listing Page — `programming-listing.html`

**Path:** `Content Studio/programming/programming-listing.html`  
**Template:** Book Listing template (same 2-column sidebar layout)  
**Theme:** Same dark red/black theme

### 5.1 Sidebar Segments

```
LEFT SIDEBAR (260px)
├── 🔍 Search bar (title, tags, problem number)
├── ─────────────────────
├── 📂 CATEGORY
│   ├── ☑ All
│   ├── ☑ Problem Solving
│   ├── ☑ Data Structures
│   ├── ☑ Algorithms
│   ├── ☑ Mini Projects
│   ├── ☑ Automation
│   └── ☑ Pattern Printing
├── ─────────────────────
├── 💻 LANGUAGE
│   ├── ☑ All Languages
│   ├── 🐍 Python
│   ├── ⚡ JavaScript
│   ├── ⚙️ C++
│   ├── ☕ Java
│   └── 📊 MATLAB
├── ─────────────────────
├── ⭐ DIFFICULTY
│   ├── ● Easy (green)
│   ├── ●● Medium (yellow)
│   └── ●●● Hard (red)
├── ─────────────────────
├── 🏷️ SOURCE
│   ├── ☑ LeetCode
│   ├── ☑ HackerRank
│   ├── ☑ Codeforces
│   ├── ☑ GeeksForGeeks
│   └── ☑ Original
├── ─────────────────────
├── 🔧 FEATURES
│   ├── ☑ Has Test Cases
│   ├── ☑ Can Run in Browser
│   └── ☑ Featured
├── ─────────────────────
├── 📅 SORT BY
│   ├── Latest Added
│   ├── Difficulty (Easy→Hard)
│   ├── Language A-Z
│   └── Category
└── ─────────────────────
    [⟳ Reset All Filters]
```

### 5.2 Main Content Area — Card Grid

**Grid:** 3-column (desktop) / 2-column (tablet) — `auto-fill minmax(300px, 1fr)`

**Card Structure:**
```
┌──────────────────────────────────────────┐
│ [🐍 Python]              [● Easy]        │
│ ──────────────────────────────────────── │
│                                          │
│ 📌 #1 · LeetCode                        │
│ Two Sum                                  │
│ ──────────────────────────────────────── │
│ Find two numbers that add up to target.  │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ def twoSum(nums, target):            │ │
│ │     seen = {}                        │ │
│ │     for i, n in enumerate(nums):     │ │
│ │         ...                          │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [Arrays] [HashMap] [Classic]            │
│                                          │
│ ⏱ O(n)   💾 O(n)   📁 Arrays & Strings │
│                                          │
│ [▶ Run Code]         [👁 View & Study]  │
└──────────────────────────────────────────┘
```

### 5.3 Card Color Coding by Language
```css
/* Language tag colors */
Python:     background #3776AB, badge #FFD43B
JavaScript: background #F7DF1E, badge #000
C++:        background #00599C, badge #fff
Java:       background #ED8B00, badge #fff
C:          background #A8B9CC, badge #000
MATLAB:     background #e44b19, badge #fff
```

### 5.4 Difficulty Color System
```
Easy   → color: #00C875 (green)   | ● 
Medium → color: #FFD700 (yellow)  | ●●
Hard   → color: #FF4444 (red)     | ●●●
```

### 5.5 header Stats Bar (lib-header content)
```
[</> Programming]  |  Python Learning Journey
[🗂 42 Programs]  [🐍 Python 28]  [⚡ JS 8]  [⚙️ C++ 6]
```

---

## 6. Viewer Page — `code-viewer.html`

**Path:** `Content Studio/programming/code-viewer.html`  
**Opens via:** `code-viewer.html?id=prog-001`

### 6.1 Layout
```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR                                                  │
├─────────────────────────────────────────────────────────┤
│ ← Back to Listing    [🐍 Python] [● Easy] [LeetCode #1] │
├──────────────────────────────┬──────────────────────────┤
│                              │                          │
│   LEFT PANEL (55%)           │   RIGHT PANEL (45%)      │
│                              │                          │
│   📌 Problem Statement       │   ▶ Code Runner          │
│   ──────────────────         │   ──────────────────     │
│   [title + description]      │   Input:                 │
│   [approach notes]           │   ┌──────────────────┐   │
│   [time/space complexity]    │   │ [2,7,11,15]      │   │
│   [tags]                     │   │ 9                │   │
│                              │   └──────────────────┘   │
│   📜 Code                    │                          │
│   ──────────────────         │   [▶ Run Code]           │
│   [syntax highlighted code]  │                          │
│   [line numbers]             │   Output:                │
│   [copy btn] [download btn]  │   ┌──────────────────┐   │
│                              │   │ [0, 1]           │   │
│   💡 Notes / Explanation     │   └──────────────────┘   │
│   ──────────────────         │                          │
│   [markdown notes]           │   ✅ Test Cases          │
│                              │   ──────────────────     │
│   🔗 Related Problems        │   [TC1 ✓] [TC2 ✓] [TC3✓]│
│                              │                          │
└──────────────────────────────┴──────────────────────────┘
```

### 6.2 Code Syntax Highlighting — Prism.js

**Library:** [Prism.js](https://prismjs.com/) — lightweight, no server needed, works offline

```html
<!-- Prism.js (CDN + local fallback) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>

<!-- Language support -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-cpp.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js"></script>

<!-- Line numbers plugin -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
```

### 6.3 Code Runner Strategy

| Language | Method | Online Required? | Library |
|---|---|---|---|
| **Python** | **Pyodide** (WebAssembly) | ❌ No | [pyodide.org](https://pyodide.org) — 8MB load once |
| **JavaScript** | Sandboxed `<iframe>` with `srcdoc` | ❌ No | Native browser |
| **C / C++ / Java** | **Judge0 API** (free tier) | ✅ Yes | judge0.com REST API |

**Implementation Decision:**
- Python (primary use) → Pyodide — fully offline after first load
- JS → iframe sandbox — কোনো risk নেই, no XSS
- C++/Java → Judge0 public API (free: 50 req/day) → যদি API না থাকে, graceful fallback message দেখাবে

### 6.4 Code Runner — Python (Pyodide)

```javascript
// Load Pyodide from CDN (one time)
let pyodide = null;
async function loadPythonRuntime() {
  if (!pyodide) {
    const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.mjs');
    pyodide = await loadPyodide();
  }
  return pyodide;
}

async function runPythonCode(code, userInput) {
  const py = await loadPythonRuntime();

  // stdin simulation via sys.stdin
  py.runPython(`
    import sys, io
    sys.stdin = io.StringIO("""${userInput}""")
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()
  `);

  try {
    py.runPython(code);
    const stdout = py.runPython("sys.stdout.getvalue()");
    return { success: true, output: stdout };
  } catch (err) {
    const stderr = py.runPython("sys.stderr.getvalue()");
    return { success: false, output: stderr || err.message };
  }
}
```

### 6.5 Code Runner — JavaScript (Sandboxed iframe)

```javascript
function runJavaScriptCode(code, userInput) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-scripts';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const logs = [];
    window.addEventListener('message', function handler(e) {
      if (e.data.type === 'log') logs.push(e.data.value);
      if (e.data.type === 'done') {
        window.removeEventListener('message', handler);
        iframe.remove();
        resolve({ success: true, output: logs.join('\n') });
      }
      if (e.data.type === 'error') {
        window.removeEventListener('message', handler);
        iframe.remove();
        resolve({ success: false, output: e.data.value });
      }
    });

    const iframeCode = `
      const _log = (...args) => parent.postMessage({ type: 'log', value: args.join(' ') }, '*');
      console.log = _log;
      try {
        ${code}
        parent.postMessage({ type: 'done' }, '*');
      } catch(e) {
        parent.postMessage({ type: 'error', value: e.message }, '*');
      }
    `;
    iframe.srcdoc = `<script>${iframeCode}<\/script>`;
  });
}
```

### 6.6 Test Case System

```javascript
// programs.json e stored test cases auto-run করবে
async function runAllTestCases(program, code) {
  const results = [];
  for (const tc of program.testCases) {
    const result = await runCode(program.language, code, tc.input);
    const passed = result.output.trim() === tc.expectedOutput.trim();
    results.push({
      label: tc.label,
      input: tc.input,
      expected: tc.expectedOutput,
      got: result.output.trim(),
      passed
    });
  }
  return results;
}
```

### 6.7 Viewer Features List

- [x] Syntax highlighting (Prism.js) — dark theme (Tomorrow Night)
- [x] Line numbers
- [x] Copy code button (one-click, shows ✓ checkmark)
- [x] Download `.py` / `.js` / `.cpp` file
- [x] Run code button (▶)
- [x] Custom input field (multiline)
- [x] Output panel (with error/success color)
- [x] Auto-run test cases (per problem)
- [x] Test case pass/fail badges
- [x] Problem description panel
- [x] Time/Space complexity display
- [x] Approach notes (markdown)
- [x] Related problems links
- [x] Language badge + difficulty badge
- [x] Source link (LeetCode/HackerRank link if applicable)
- [x] Loading spinner (for Pyodide init)
- [x] "Python runtime loading..." feedback

---

## 7. Manager Page — `programming-manager.html`

**Path:** `Only-boss/managers/Content-studio/programming-manager.html`  
**Theme:** Same orange/gold admin theme (Only-boss style)  
**Auth:** Same auth system as other managers

### 7.1 Manager Sidebar Sections

```
SIDEBAR
├── 📊 Dashboard (stats overview)
├── ➕ Add New Program
├── 📋 Manage All Programs
├── 🔍 Search & Edit
├── 🗑️ Delete Programs
├── 🏷️ Manage Tags
├── 📁 File Manager (upload .py .js .cpp files)
└── 🔄 Sync & Preview
```

### 7.2 Add New Program Form — Fields

```
FORM FIELDS:
─────────────────────────────────────────
BASIC INFO
  ┌─ Title *
  ├─ Language * (dropdown: Python/JS/C++/Java/C)
  ├─ Category * (dropdown from categoryGroups)
  ├─ Subcategory * (dynamic based on category)
  ├─ Difficulty * (Easy / Medium / Hard)
  └─ Description *

SOURCE INFO
  ┌─ Source (LeetCode / HackerRank / Codeforces / GFG / Original)
  ├─ Problem Number (e.g., 1, 42, 200)
  └─ Source URL (optional)

TECHNICAL DETAILS
  ┌─ Approach / Key Insight (text area)
  ├─ Time Complexity (e.g., O(n))
  ├─ Space Complexity (e.g., O(1))
  └─ Tags (comma-separated)

CODE FILE
  └─ Upload .py / .js / .cpp file  [Browse File]
     OR paste code directly in editor

TEST CASES (repeatable rows)
  ┌─ Input (multiline)
  ├─ Expected Output
  └─ Label (e.g., "Basic", "Edge Case")
  [+ Add Test Case]  [- Remove]

NOTES (markdown supported)
  └─ Explanation / Notes [textarea]

SETTINGS
  ┌─ Featured (toggle)
  └─ Date Added (auto: today)

[💾 Save Program]  [👁 Preview]  [🔄 Reset]
```

### 7.3 Manage / Edit Flow

1. Manager loads all programs from `programs.json`
2. Shows filterable table: ID | Title | Language | Category | Difficulty | Date | Actions
3. **Edit** → Opens same form pre-filled
4. **Delete** → Confirm dialog → removes from JSON
5. **Preview** → Opens `code-viewer.html?id=xxx` in new tab
6. **Sync** → Updates statistics in JSON, regenerates listing cache

### 7.4 programs.json Update Logic

```javascript
// Manager reads programs.json from GitHub content API
// (same pattern as books-manager-new.html)
// Edits locally in memory
// Saves via GitHub API PUT request
// Updates statistics block automatically:

function recalculateStats(programs) {
  const stats = {
    total: programs.length,
    byLanguage: {}, byDifficulty: {}, byCategory: {}
  };
  programs.forEach(p => {
    stats.byLanguage[p.language] = (stats.byLanguage[p.language] || 0) + 1;
    stats.byDifficulty[p.difficulty.toLowerCase()] = 
      (stats.byDifficulty[p.difficulty.toLowerCase()] || 0) + 1;
    stats.byCategory[p.category] = (stats.byCategory[p.category] || 0) + 1;
  });
  return stats;
}
```

---

## 8. Listing Page — Complete Logic & Conditions

### 8.1 Filtering Logic (if/else conditions)

```javascript
function filterPrograms(programs, filters) {
  return programs.filter(p => {

    // 1. Search — title, tags, description, problem number match
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = [
        p.title, p.description, p.sourceNumber,
        ...(p.tags || [])
      ].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    // 2. Category filter
    if (filters.category && filters.category !== 'all') {
      if (p.category !== filters.category) return false;
    }

    // 3. Language filter
    if (filters.language && filters.language !== 'all') {
      if (p.language !== filters.language) return false;
    }

    // 4. Difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      if (p.difficulty.toLowerCase() !== filters.difficulty) return false;
    }

    // 5. Source filter
    if (filters.source && filters.source !== 'all') {
      if ((p.source || '').toLowerCase() !== filters.source) return false;
    }

    // 6. Has test cases filter
    if (filters.hasTestCases) {
      if (!p.hasTestCases || !p.testCases?.length) return false;
    }

    // 7. Can run in browser filter
    if (filters.canRun) {
      const lang = languages.find(l => l.id === p.language);
      if (!lang?.canRunInBrowser) return false;
    }

    // 8. Featured filter
    if (filters.featured) {
      if (!p.featured) return false;
    }

    return true;
  });
}
```

### 8.2 Sorting Logic

```javascript
function sortPrograms(programs, sortBy) {
  const sorted = [...programs];
  switch (sortBy) {
    case 'latest':
      return sorted.sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case 'difficulty-asc':
      const order = { easy: 1, medium: 2, hard: 3 };
      return sorted.sort((a,b) => 
        order[a.difficulty.toLowerCase()] - order[b.difficulty.toLowerCase()]);
    case 'difficulty-desc':
      return sorted.sort((a,b) => 
        order[b.difficulty.toLowerCase()] - order[a.difficulty.toLowerCase()]);
    case 'language':
      return sorted.sort((a,b) => a.language.localeCompare(b.language));
    case 'title':
      return sorted.sort((a,b) => a.title.localeCompare(b.title));
    case 'source-number':
      return sorted.sort((a,b) => 
        parseInt(a.sourceNumber||0) - parseInt(b.sourceNumber||0));
    default:
      return sorted;
  }
}
```

### 8.3 "Run Code" from Listing Card

Listing card-এ ছোট "▶ Run" button → `code-viewer.html?id=prog-001&autorun=true` — viewer page খুলবে এবং default test case দিয়ে auto run হবে।

### 8.4 Empty State Conditions

```javascript
if (filtered.length === 0) {
  // Case 1: No programs at all
  if (allPrograms.length === 0) {
    showEmptyState('no-content'); // "এখনো কোনো code add হয়নি"
  }
  // Case 2: Filter returned nothing
  else {
    showEmptyState('no-match'); // "এই filter-এ কোনো result নেই"
  }
}
```

---

## 9. Theme & Visual Design Guide

সব page তোমার existing theme follow করবে:

```css
:root {
  --primary-red: #CC0000;
  --dark-red: #8B0000;
  --light-red: #FF1744;
  --bg-dark: #000000;
  --bg-card: rgba(15, 15, 15, 0.95);
  --border-primary: rgba(139, 0, 0, 0.4);
  --text-primary: #FFFFFF;
  --text-dim: rgba(255, 255, 255, 0.65);

  /* Programming-specific */
  --python-blue: #3776AB;
  --python-yellow: #FFD43B;
  --js-yellow: #F7DF1E;
  --cpp-blue: #00599C;
  --easy-green: #00C875;
  --medium-yellow: #FFB800;
  --hard-red: #FF4444;
}
```

### Code Block Theme
- **Prism theme:** `prism-tomorrow` (dark, matches your site)
- Background: `#1a0505` (dark red tint instead of pure gray)
- Border: `1px solid rgba(204,0,0,0.3)`
- Border radius: `12px`
- Font: `'Fira Code', 'Cascadia Code', monospace`

---

## 10. Build Order (কী আগে করব)

```
PHASE A — Foundation
  [1] programs.json skeleton তৈরি (Content Code/programming/)
  [2] Content Storage/programming/ folder structure তৈরি

PHASE B — Listing Page
  [3] programming-listing.html — book-listing template থেকে copy করে adapt
  [4] Sidebar filters (category, language, difficulty)
  [5] Card render function + filterPrograms() logic
  [6] Empty state + loading state

PHASE C — Viewer Page
  [7] code-viewer.html layout (2-panel)
  [8] Prism.js integration (syntax highlighting)
  [9] Python runner (Pyodide) integration
  [10] JS runner (iframe sandbox)
  [11] Test case runner + pass/fail UI
  [12] Copy + Download buttons

PHASE D — Manager
  [13] programming-manager.html (Only-boss) — books-manager থেকে adapt
  [14] Add/Edit/Delete program logic
  [15] programs.json sync

PHASE E — Home Page Card
  [16] Add programming card to home page (index.html Projects section)
  [17] Stats pulled dynamically from programs.json

PHASE F — Mobile
  [18] Mobile version of listing (mobile/content-studio/programming/)
  [19] Mobile viewer (simplified, no code runner on very small screens)
```

---

## 11. Mobile Considerations

- Listing page: single column, filters collapse into bottom sheet drawer
- Viewer page: tabs instead of 2-panel (tab 1: Problem + Code, tab 2: Run Code)
- Code runner: Python/JS চলবে (same Pyodide/iframe) — C++/Java disabled on mobile (API too slow)
- Prism highlighting: same, fully works mobile
- Card: language badge top-left, difficulty top-right, compact layout

---

## 12. SEO & Meta

```html
<!-- listing page -->
<title>Programming Solutions & Code - Python, JavaScript, C++ | A3KM Studio</title>
<meta name="description" content="Programming solutions, DSA implementations, mini projects in Python, JavaScript, C++. Problem solving with LeetCode solutions." />
<meta name="keywords" content="Python programming, LeetCode solutions, data structures, algorithms, A3KM Studio" />

<!-- viewer page (dynamic) -->
<title>{program.title} - {language} Solution | A3KM Studio</title>
```

---

## 13. Quick Reference — Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Syntax highlighting | **Prism.js** | Lightweight (~10KB), offline works, beautiful themes |
| Python runner | **Pyodide** | Full Python in browser, offline after 1st load |
| JS runner | **iframe sandbox** | Most secure, no external dependency |
| C++/Java runner | **Judge0 API** (free tier) | Only option without backend |
| Data storage | **programs.json** | Same pattern as all other content on site |
| Listing template | **book-listing-new.html** | Already perfect 2-column sidebar template |
| Manager template | **books-manager-new.html** | Same admin pattern, reuse form/auth code |
| Code font | **Fira Code** (Google Fonts) | Beautiful ligatures, programming-standard |

---

## 14. Mobile Version — Full Plan

### 14.1 File Structure

```
A3KM Studio/mobile/
└── content-studio/
    └── programming/
        ├── programming-listing.html   ← Mobile listing (filter chips + card list)
        ├── programming-listing.js     ← Load JSON, filter, render logic
        └── code-viewer.html           ← Mobile viewer (tabbed, no 2-panel split)
```

Mobile redirect (desktop listing page top):
```javascript
(function() {
  function isMobile() {
    const ua = navigator.userAgent || '';
    return /android|iphone|ipad|ipod|iemobile|mobile/i.test(ua) ||
           (navigator.userAgentData && navigator.userAgentData.mobile);
  }
  if (isMobile()) {
    window.location.replace('../../mobile/content-studio/programming/programming-listing.html');
  }
})();
```

---

### 14.2 Mobile Theme & CSS

Mobile pages ব্যবহার করে এই shared system:

```html
<!-- Required in every mobile page head -->
<link rel="stylesheet" href="../../shared/mobile-common.css">
<link rel="stylesheet" href="../../shared/mobile-navbar.css">
<link rel="stylesheet" href="../shared-content-styles.css">
<script src="../../shared/page-loading.js"></script>
<link rel="manifest" href="../../manifest.json">
```

**CSS Variables (mobile-common.css থেকে inherit করবে):**
```css
:root {
  --primary-red: #CC0000;
  --dark-red: #8B0000;
  --accent-red: #FF0000;
  --light-red: #FF3333;
  --bg-black: #000000;
  --bg-dark: #0A0A0A;
  --bg-card: rgba(20, 20, 20, 0.95);
  --bg-card-hover: rgba(30, 30, 30, 0.98);
  --border-primary: rgba(204, 0, 0, 0.3);
  --border-strong: rgba(204, 0, 0, 0.6);
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-dim: rgba(255, 255, 255, 0.5);
}
```

**Page-level CSS (inline `<style>` block, arduino/matlab pattern অনুযায়ী):**
- `.category-hero` — same dark gradient with `rgba(0,0,0,0.95)` → `rgba(20,0,0,0.85)` → `rgba(0,0,0,0.95)`
- Engineering grid overlay: `repeating-linear-gradient(90deg, ..., rgba(204,0,0,0.03) ...)` 
- Hero icon: `color: #CC0000; filter: drop-shadow(0 4px 8px rgba(204,0,0,0.3))`
- Active filter chip: `background: rgba(204,0,0,0.25)` + `border-color: rgba(204,0,0,0.5)`
- `meta name="theme-color" content="#000000"` — bottom navbar color match

---

### 14.3 Navbar — Bottom Nav (mobile-navbar.html pattern)

Desktop-এ top navbar। Mobile-এ **bottom fixed navigation bar** (65px height, Facebook-style)।

```
┌─────────────────────────────────────────────┐
│                                             │
│            PAGE CONTENT                     │
│                                             │
└─────────────────────────────────────────────┘
┌──────┬──────┬──────┬──────┬──────┐   65px
│  🏠  │  📁  │ </> │  📚  │  👤  │  fixed
│ Home │Proj. │Code │Books │ Me   │  bottom
└──────┴──────┴──────┴──────┴──────┘
```

- Background: `rgba(10,10,10,0.98)` + `backdrop-filter: blur(20px)`
- Top border: `2px solid rgba(204,0,0,0.3)`
- Active item: `color: #CC0000` + top indicator dot
- Inactive item: `rgba(255,255,255,0.45)`
- Loading bar: `position: fixed; bottom: 65px;` (just above navbar)

---

### 14.4 Mobile Listing Page — Layout

```
┌─────────────────────────────────────────────┐
│  CONTENT HEADER (content-header class)      │
│  3px top white splash separator             │
│  Engineering grid overlay                   │
│  ─────────────────────────────────────────  │
│  </> PROGRAMMING                            │
│  Python Learning Journey                    │
│  [🗂 42 Solutions] [🐍 Python 28]          │
└─────────────────────────────────────────────┘
│                                             │
│  STATS BAR (3-col grid)                     │
│  ┌─────────┬─────────┬─────────┐           │
│  │ 🐍      │ ⚡      │ ⚙️      │           │
│  │ 28      │  8      │  6      │           │
│  │ Python  │  JS     │  C++    │           │
│  └─────────┴─────────┴─────────┘           │
│                                             │
│  FILTER CHIPS (horizontal scroll, snap)     │
│  [All 42] [Problem Solving 18] [DSA 10]     │
│  [Algorithms 6] [Projects 5] [Scripts 3]    │
│                                             │
│  ──── sub-filter row ────                   │
│  [🐍 Python] [⚡ JS] [⚙️ C++]              │
│  [● Easy] [●● Medium] [●●● Hard]           │
│                                             │
│  SEARCH BAR (toggle, slides in)             │
│  🔍 [Search by title, tag, #number...]      │
│                                             │
│  SORT BUTTON (top-right) [⇅ Sort]          │
│                                             │
│  ─────── CARD LIST ───────                  │
│  (vertical list, NOT grid — mobile UX)      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [🐍 Python]  [● Easy]   [LeetCode] │   │
│  │ ─────────────────────────────────── │   │
│  │ #1 · Two Sum                        │   │
│  │ Find indices of two numbers...      │   │
│  │                                     │   │
│  │ ╔═══════════════════════════════╗   │   │
│  │ ║ def twoSum(nums, target):    ║   │   │
│  │ ║     seen = {}                ║   │   │
│  │ ╚═══════════════════════════════╝   │   │
│  │                                     │   │
│  │ [HashMap] [Array]    O(n) | O(n)   │   │
│  │ ──────────────────────────────────  │   │
│  │        [▶ Run]   [👁 View]  [›]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Load More / Infinite scroll]              │
└─────────────────────────────────────────────┘
┌──────┬──────┬──────┬──────┬──────┐
│  🏠  │  📁  │ </> │  📚  │  👤  │  BOTTOM NAV
└──────┴──────┴──────┴──────┴──────┘
```

**Card padding:** `16px` — same as `shared-content-styles.css .container`  
**Card style:** `project-card` style (from projects.css) — `border-radius: 12px`, `border: 1px solid rgba(80,80,80,0.3)`, active scale `0.98`  
**Code snippet preview:** Prism.js dark theme, max 4 lines, `overflow: hidden; max-height: 80px` — truncated

---

### 14.5 Filter Chips — Mobile UX

Arduino/MATLAB exact pattern follow করবে:

```html
<!-- Horizontal scrollable chip row -->
<div class="filter-scroll scrollable" id="categoryFilterScroll">
  <div class="filter-chips" id="categoryChips">
    <button class="filter-chip active" data-filter="all" data-name="All Programs">
      <i class="fas fa-layer-group"></i>
      <span class="chip-text">All</span>
      <span class="chip-count" data-category="all">0</span>
    </button>
    <button class="filter-chip" data-filter="problem-solving" data-name="Problem Solving">
      <i class="fas fa-puzzle-piece"></i>
      <span class="chip-text">Problem Solving</span>
      <span class="chip-count" data-category="problem-solving">0</span>
    </button>
    <button class="filter-chip" data-filter="data-structures" data-name="Data Structures">
      <i class="fas fa-layer-group"></i>
      <span class="chip-text">Data Structures</span>
      <span class="chip-count" data-category="data-structures">0</span>
    </button>
    <!-- ... -->
  </div>
</div>

<!-- Second row: Language chips -->
<div class="filter-scroll" id="langFilterScroll">
  <div class="filter-chips">
    <button class="filter-chip active" data-lang="all"><span class="chip-text">All Lang</span></button>
    <button class="filter-chip" data-lang="python"><i class="fab fa-python"></i><span class="chip-text">Python</span></button>
    <button class="filter-chip" data-lang="javascript"><i class="fab fa-js-square"></i><span class="chip-text">JS</span></button>
    <button class="filter-chip" data-lang="cpp"><span class="chip-text">C++</span></button>
  </div>
</div>
```

**Chip active state:**
```css
.filter-chip.active {
  background: linear-gradient(135deg, rgba(204,0,0,0.25), rgba(0,0,0,0.7));
  border-color: rgba(204,0,0,0.5);
  color: #FFFFFF;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(204,0,0,0.15);
}
```

---

### 14.6 Mobile Viewer Page — Tabbed Layout

Desktop-এ 2-panel side by side। Mobile-এ **3 tabs** (single column):

```
┌─────────────────────────────────────────────┐
│  ← Back     #1 Two Sum     [🐍 ●Easy]       │
│  ─────────────────────────────────────────  │
│  [📋 Problem] [💻 Code] [▶ Run & Test]      │  ← Tab bar
├─────────────────────────────────────────────┤
│                                             │
│  TAB 1 — Problem                            │
│  ──────────────────                         │
│  LeetCode #1 · Arrays & Strings             │
│  ─────────────────────────────────────────  │
│  Given an array of integers nums and an    │
│  integer target, return indices...          │
│                                             │
│  💡 Approach:                               │
│  HashMap single pass — store complement     │
│                                             │
│  ⏱ Time: O(n)    💾 Space: O(n)           │
│  [HashMap] [Array] [Classic]                │
│                                             │
│  TAB 2 — Code                               │
│  ──────────────────                         │
│  [Copy 📋] [Download ⬇]                    │
│  ┌─────────────────────────────────────┐   │
│  │ 1  def twoSum(nums, target):        │   │
│  │ 2      seen = {}                    │   │
│  │ 3      for i, n in enumerate(nums): │   │
│  │ 4          comp = target - n        │   │
│  │ 5          if comp in seen:         │   │
│  │ 6              return [seen[comp],i]│   │
│  │ 7          seen[n] = i              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  TAB 3 — Run & Test                         │
│  ──────────────────                         │
│  Input:                                     │
│  ┌─────────────────────────────────────┐   │
│  │ [2,7,11,15]                         │   │
│  │ 9                                   │   │
│  └─────────────────────────────────────┘   │
│  [▶ Run Code]                              │
│                                             │
│  Output:                                    │
│  ┌─────────────────────────────────────┐   │
│  │ [0, 1]                  ✅          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Test Cases: [✓ Basic] [✓ Non-obvious]     │
│                                             │
└─────────────────────────────────────────────┘
┌──────┬──────┬──────┬──────┬──────┐
│  🏠  │  📁  │ </> │  📚  │  👤  │  BOTTOM NAV
└──────┴──────┴──────┴──────┴──────┘
```

**Tab switching:** CSS `display: none / block` swap — no JS framework needed  
**Active tab indicator:** `border-bottom: 2px solid #CC0000`

---

### 14.7 Code Runner — Mobile Decision

| Language | Mobile Support | Notes |
|---|---|---|
| **Python** | ✅ Full (Pyodide) | 8MB load — show "রানটাইম লোড হচ্ছে..." spinner |
| **JavaScript** | ✅ Full (iframe) | No extra load |
| **C++ / Java / C** | ⚠️ Judge0 API | Mobile network dependent — show notice |

**Pyodide mobile loading UX:**
```javascript
// Show loading state before Pyodide is ready
runBtn.disabled = true;
runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Python লোড হচ্ছে...';
await loadPythonRuntime();
runBtn.disabled = false;
runBtn.innerHTML = '<i class="fas fa-play"></i> Run Code';
```

---

### 14.8 Mobile-Specific CSS Extras (page-level `<style>`)

```css
/* Programming page hero accent */
.category-hero .hero-icon { color: #CC0000; }
.filter-chip i { color: #CC0000; }

/* Code preview card snippet */
.code-snippet-preview {
  background: #0d0000;
  border: 1px solid rgba(204,0,0,0.2);
  border-radius: 8px;
  padding: 10px 12px;
  margin: 10px 0;
  font-family: 'Courier New', 'Fira Code', monospace;
  font-size: 11px;
  line-height: 1.5;
  color: rgba(255,255,255,0.8);
  max-height: 72px;
  overflow: hidden;
  position: relative;
}
.code-snippet-preview::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 28px;
  background: linear-gradient(transparent, #0d0000);
}

/* Language badge — mobile */
.lang-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}
.lang-badge.python { background: #3776AB; color: #FFD43B; }
.lang-badge.javascript { background: #F7DF1E; color: #000; }
.lang-badge.cpp { background: #00599C; color: #fff; }

/* Difficulty badge */
.diff-badge.easy { color: #00C875; }
.diff-badge.medium { color: #FFB800; }
.diff-badge.hard { color: #FF4444; }

/* Tab bar */
.viewer-tabs {
  display: flex;
  border-bottom: 1px solid rgba(204,0,0,0.2);
  background: rgba(10,0,0,0.95);
  position: sticky;
  top: 0;
  z-index: 10;
}
.viewer-tab {
  flex: 1;
  padding: 12px 4px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  transition: all 0.25s;
}
.viewer-tab.active {
  color: #fff;
  border-bottom-color: #CC0000;
}

/* Content body padding (above bottom nav) */
body { padding-bottom: 65px; }
```

---

### 14.9 Mobile JS Pattern (`programming-listing.js`)

Arduino/MATLAB pattern exactly follow করবে:

```javascript
(function() {
  'use strict';

  let allPrograms = [];
  let currentCategory = 'all';
  let currentLang = 'all';
  let currentDiff = 'all';
  let searchQuery = '';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  async function init() {
    setupEventListeners();
    await loadPrograms();
    animateSections();
  }

  async function loadPrograms() {
    showLoadingState();
    try {
      const res = await fetch('../../../Content%20Code/programming/programs.json');
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      allPrograms = data.programs || [];
      hideLoadingState();
      filterAndRender();
      updateChipCounts();
    } catch(e) {
      showErrorState();
    }
  }

  function filterAndRender() {
    let f = allPrograms;
    if (currentCategory !== 'all') f = f.filter(p => p.category === currentCategory);
    if (currentLang !== 'all')     f = f.filter(p => p.language === currentLang);
    if (currentDiff !== 'all')     f = f.filter(p => p.difficulty.toLowerCase() === currentDiff);
    if (searchQuery)               f = f.filter(p =>
      (p.title + ' ' + (p.tags||[]).join(' ') + ' ' + (p.sourceNumber||'')).toLowerCase().includes(searchQuery)
    );
    renderCards(f);
  }

  function renderCards(programs) {
    const grid = document.getElementById('programsGrid');
    if (!programs.length) { showEmpty(); return; }
    grid.innerHTML = programs.map(p => `
      <a href="code-viewer.html?id=${p.id}" class="project-card">
        <div class="project-content">
          <div class="card-badges">
            <span class="lang-badge ${p.language}">${getLangLabel(p.language)}</span>
            <span class="diff-badge ${p.difficulty.toLowerCase()}">
              ${'●'.repeat(getDiffLevel(p.difficulty))} ${p.difficulty}
            </span>
            ${p.source ? `<span class="source-badge">${p.source}${p.sourceNumber ? ' #'+p.sourceNumber : ''}</span>` : ''}
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          ${p.codePreview ? `<div class="code-snippet-preview">${escapeHtml(p.codePreview)}</div>` : ''}
          <div class="card-meta">
            ${p.tags ? p.tags.slice(0,3).map(t => `<span class="tag">${t}</span>`).join('') : ''}
            <span class="complexity">⏱ ${p.timeComplexity||'—'}</span>
          </div>
        </div>
        <div class="project-arrow"><i class="fas fa-chevron-right"></i></div>
      </a>
    `).join('');
  }
})();
```

---

### 14.10 Build Order Update (Mobile Phase Added)

```
PHASE F — Mobile (after desktop complete)
  [18] mobile/content-studio/programming/ folder তৈরি
  [19] programming-listing.html — arduino-projects.html pattern
       ├── shared CSS links (mobile-common, mobile-navbar, shared-content-styles)
       ├── category-hero section
       ├── stats-grid (3 col: Python/JS/C++ counts)
       ├── filter chips row 1: category
       ├── filter chips row 2: language + difficulty
       ├── search toggle bar
       └── project-card list
  [20] programming-listing.js — filter + render logic
  [21] code-viewer.html — 3-tab layout (Problem / Code / Run)
       ├── Prism.js syntax highlight
       ├── Pyodide Python runner (same as desktop)
       ├── iframe JS runner
       └── test case pass/fail UI
  [22] Desktop listing page-এ mobile redirect snippet add
```

---

*This document covers full analysis — desktop + mobile. Build করার সময় এই plan follow kore section by section implement করা হবে।*
