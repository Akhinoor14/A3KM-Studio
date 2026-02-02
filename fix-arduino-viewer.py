#!/usr/bin/env python3
import re

file_path = "Projects Code/Arduino/arduino-project-viewer.html"

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Count before
count_before = content.count('rgba(204, 0, 0,') + content.count('rgba(204,0,0,')
print(f"Found {count_before} instances to replace")

# Replace all bright red colors with dark red
replacements = [
    (r'rgba\(204,\s*0,\s*0,', 'rgba(139, 0, 0,'),
    (r'rgba\(153,\s*0,\s*0,', 'rgba(90, 0, 0,'),
    (r'#CC0000', '#8B0000'),
    (r'#cc0000', '#8B0000'),
    (r'#FF3333', '#C80000'),
    (r'#ff3333', '#C80000'),
]

count_total = 0
for pattern, replacement in replacements:
    count = len(re.findall(pattern, content))
    content = re.sub(pattern, replacement, content)
    if count > 0:
        print(f"Replaced {count} instances of {pattern}")
        count_total += count

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nTotal replacements: {count_total}")
print("✅ File updated successfully!")
