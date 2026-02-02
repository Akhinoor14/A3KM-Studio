# Color Replacement Script for arduino-project-viewer.html
import re

# Read the file
file_path = r"Projects Code/Arduino/arduino-project-viewer.html"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Track replacements
replacements = {}

# 1. Replace rgba(204, 0, 0, → rgba(139, 0, 0, (with spaces)
count1 = len(re.findall(r'rgba\(204, 0, 0,', content))
content = re.sub(r'rgba\(204, 0, 0,', 'rgba(139, 0, 0,', content)
replacements['rgba(204, 0, 0,'] = count1

# 2. Replace rgba(204,0,0, → rgba(139,0,0, (no spaces)
count2 = len(re.findall(r'rgba\(204,0,0,', content))
content = re.sub(r'rgba\(204,0,0,', 'rgba(139,0,0,', content)
replacements['rgba(204,0,0,'] = count2

# 3. Replace #CC0000 → #8B0000 (case insensitive)
count3 = len(re.findall(r'#[Cc][Cc]0000', content))
content = re.sub(r'#[Cc][Cc]0000', '#8B0000', content)
replacements['#CC0000'] = count3

# 4. Replace #FF3333 → #C80000 (case insensitive)
count4 = len(re.findall(r'#[Ff][Ff]3333', content))
content = re.sub(r'#[Ff][Ff]3333', '#C80000', content)
replacements['#FF3333'] = count4

# 5. Replace #FF0000 → #C80000 (case insensitive)
count5 = len(re.findall(r'#[Ff][Ff]0000', content))
content = re.sub(r'#[Ff][Ff]0000', '#C80000', content)
replacements['#FF0000'] = count5

# Save the modified content
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Print summary
print("\n" + "="*50)
print("COLOR REPLACEMENT SUMMARY")
print("="*50)
total = 0
for pattern, count in sorted(replacements.items()):
    print(f"{pattern:<20} : {count:>3} replacements")
    total += count
print("="*50)
print(f"TOTAL: {total} replacements made")
print("="*50)
print("\n✓ File successfully updated!")
