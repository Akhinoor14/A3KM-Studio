import re

# File path
file_path = "Projects Code/Arduino/arduino-project-viewer.html"

# Read file
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Count before
count_before = content.count("rgba(204, 0, 0,")
print(f"Before: {count_before} instances of rgba(204, 0, 0,")

# Replace all bright red to dark red
content = content.replace("rgba(204, 0, 0,", "rgba(139, 0, 0,")
content = content.replace("rgba(153, 0, 0,", "rgba(90, 0, 0,")
content = content.replace("#CC0000", "#8B0000")
content = content.replace("#FF3333", "#C80000")

# Count after
count_after = content.count("rgba(204, 0, 0,")
print(f"After: {count_after} instances of rgba(204, 0, 0,")
print(f"Replaced: {count_before - count_after} instances")

# Write back
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ arduino-project-viewer.html fixed!")
