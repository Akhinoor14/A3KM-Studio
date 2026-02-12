---
title: "Projects Portfolio - Complete Collection"
date: 2026-02-12
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: projects-portfolio
tags: [projects, solidworks, arduino, matlab, electronics]
---

# Projects Portfolio - 66টা Projects

## Total Projects Breakdown

**মোট:** 66টা projects  
**Categories:** 4টা (SOLIDWORKS, Arduino, MATLAB, Electronics)

**Data Source:** `Projects Code/projects.json`

## 1. SOLIDWORKS Projects (35টা)

### Model Categories:

#### **Basic Models (Practice):**
- Model 01 থেকে Model 15
- Beginner-level designs
- Simple parts and assemblies
- Learning fundamentals

#### **Intermediate Models (Practice):**
- Complex assemblies
- Multi-part designs
- Engineering applications
- Advanced features

#### **Professional Models (Practice):**
- Industry-standard designs
- Advanced surfacing
- Complex mechanisms
- Photo-realistic renders

#### **Paid/Sold Models:**
- Commercial projects
- Client work
- Marketplace sales
- Custom orders

### Model Details:

**Each Project Contains:**
- 3D Model preview (Model Viewer embedded)
- `.SLDPRT` / `.SLDASM` file download
- `.STEP` / `.STL` export files
- Technical drawings (PDF)
- Render images (JPG/PNG)
- Project description
- Difficulty level
- Creation date

### File Structure:
```
Projects Storage/Solidwork Projects/
├── Basic (Practice) Models/
│   ├── Model 01/
│   ├── Model 02/
│   └── ...
├── Intermediate (Practice) Models/
├── Pro (Practice) Models/
└── Paid (Selled) Models/
```

### Viewer Features:
- **3D Interactive Preview** (Google Model Viewer)
- Rotate, zoom, pan with mouse/touch
- Auto-rotate option
- Fullscreen mode
- AR view (on supported devices)
- Download button for files

## 2. Arduino Projects (26টা)

### Project Structure:

প্রতিটা Arduino project এ আছে:

1. **Circuit Diagram** - Tinkercad screenshot
2. **Arduino Code** - `.ino` file with comments
3. **README.md** - Project description
4. **Code Explanation** - Bangla তে step-by-step
5. **Components List** - Required parts
6. **Tinkercad Link** - Simulation link

### Project Categories:

#### **LED Projects:**
- LED Pattern (01)
- LED Flowing Blinking (02)
- Breathing LED with PWM (03)
- RGB LED Control (05)
- Neopixel Strip (08)
- Neopixel Jewel (09)

#### **Sensor Projects:**
- Temperature Sensor TMP36 (11)
- PIR Motion Sensor (12)
- Ultrasonic Sensor (07)
- Photodiode Light Detection (10)
- LDR Light Measurement (20)

#### **Display Projects:**
- 16×2 LCD Display (15)
- 7-Segment Display Dice (16)
- Temperature Display with LCD (19)

#### **Control  Projects:**
- Servo Motor Control (06)
- Digital Potentiometer (22)
- Digital Voltmeter with ATtiny (23)

#### **Advanced Projects:**
- 4×4 Matrix Keypad (13)
- RGB Color Temperature (14)
- Piano with Piezo (18)
- Solar Tracker (17)
- Smart Parking (21)

### File Locations:
```
Projects Storage/Arduino UNO Projects with Tinkercad/
├── 01 LED Pattern/
│   ├── README.md
│   ├── Code Explaination (for beginner).md
│   └── led-pattern.ino
├── 02 LED Flowing Blinking/
├── 03 Breathing a LED/
└── ... (প্রতিটা project নিজস্ব folder এ)
```

### Code Explanation Format:

প্রতিটা project এর `Code Explaination (for beginner).md` file এ:

- **বাংলায় explanation** (beginners এর জন্য)
- Line-by-line code breakdown
- Variable explanations
- Function descriptions
- How it works conceptually
- Troubleshooting tips

**Example Structure:**
```markdown
# LED Pattern - Code Explanation

## pinMode() কী?
Arduino কে বলে দেয় pin টা input না output...

## digitalWrite() কী?
Pin এ HIGH (5V) বা LOW (0V) পাঠায়...
```

## 3. MATLAB Projects (1টা)

Currently শুধু 1টা MATLAB project আছে, but expandable.

**Project Type:**
- Energy systems simulation
- Renewable energy analysis
- Power systems modeling

**Data:** `Projects Code/MATLAB/matlab-data.json`

### File Structure:
```
Projects Storage/MATLAB Projects/
├── README.md
└── energy-systems/
    ├── simulation.m
    ├── data.xlsx
    └── results/
```

## 4. Electronics Calculators (4টা)

Professional-grade tools আমি নিজে বানিয়েছি:

### Available Calculators:

#### **1. Resistor Color Code Calculator**
- Input: Color bands
- Output: Resistance value, tolerance
- IEC standard colors
- 4-band and 5-band support

#### **2. LED Resistor Calculator**
- Input: Supply voltage, LED voltage, current
- Output: Required resistor value
- Power dissipation calculation
- Safety margin included

#### **3. Ohm's Law Calculator**
- Calculate V, I, R, P
- Any 2 values → find others
- Unit conversions
- Formulas displayed

#### **4. Capacitor Code Decoder**
- Input: Capacitor code
- Output: Capacitance value
- Voltage rating decode
- Tolerance calculation

**Technology:** Pure JavaScript (no frameworks)  
**Location:** `Projects Code/Electronics/`  
**Free to use:** Open-source tools

## Project Viewer Pages

### Main Projects Page:

**Desktop:** `Projects Code/projects.html`  
**Mobile:** `mobile/projects/`

**Features:**
- Category filter (ALL / SOLIDWORKS / Arduino / MATLAB / Electronics)
- Search by name/tags
- Grid layout with cards
- Thumbnail previews
- Click to open project details

### Project Detail Modal:

Opens when project card clicked:

**Contains:**
- Project title & description
- Category badge
- Difficulty level
- Tags (color-coded)
- 3D preview / Circuit image
- Download buttons
- External links (Tinkercad, etc)
- Related projects section

## Project Data Structure

**JSON Format:** `Projects Code/projects.json`

```json
{
  "id": "solidworks-model-01",
  "title": "Model 01 - Basic Part",
  "category": "solidworks",
  "subcategory": "Basic Models",
  "difficulty": "Beginner",
  "description": "...",
  "thumbnail": "path/to/image.jpg",
  "modelFile": "path/to/model.glb",
  "downloadFiles": ["file1.zip", "file2.pdf"],
  "tags": ["CAD", "3D", "Practice"],
  "date": "2024-01-15"
}
```

## Adding New Projects

### Through Only Boss Dashboard:

1. Login → Dashboard → Project Manager
2. Click "Add New Project"
3. Select category (SOLIDWORKS/Arduino/MATLAB/Electronics)
4. Fill form:
   - Title, description
   - Upload files (model/code/images)
   - Select difficulty
   - Add tags
5. Preview → Publish
6. Auto-sync to GitHub
7. Appears immediately on website

## Project Statistics

**Current Numbers (2026-02-12):**
- SOLIDWORKS: 35 models
- Arduino: 26 projects
- MATLAB: 1 project
- Electronics: 4 calculators
- **Total:** 66 projects

**Growth Plan:**
- Target: 100 projects by end of 2026
- Weekly: 1-2 new Arduino projects
- Monthly: 2-3 SOLIDWORKS models
- MATLAB: Expand to 10 simulations

## Search & Filter Features

### Search Works On:
- Project title
- Description text
- Tags
- Category names
- File names

### Filter Options:
- By category (dropdown)
- By difficulty (slider)
- By date (newest/oldest)
- By tags (multi-select)

### Sort Options:
- Newest first (default)
- Oldest first
- A-Z alphabetical
- Z-A reverse
- Most downloads

## External Integration

### Tinkercad:
- Each Arduino project has Tinkercad simulation link
- Embedded iframe preview
- "Open in Tinkercad" button
- Shareable public links

### GitHub:
- Project source code GitHub এ hosted
- Public repository: `Akhinoor14/A3KM-Studio`
- Folder: `Projects Storage/`
- MIT License (open-source)

## Mobile Project Viewer

**Mobile-Optimized Features:**
- Single-column card grid
- Larger thumbnails
- Touch-friendly buttons
- Swipe to next/previous project
- Mobile share button
- Download to device option

**Mobile Performance:**
- Lazy load project images
- Load 10 projects at a time
- Infinite scroll for more
- Cached for offline viewing

---

**শেষ Update:** 2026-02-12  
**Most Popular:** Arduino projects সবচেয়ে বেশি viewed হয়
