import json
import re

# Read the solidworks-data.json file
with open('Projects Code/solidworks/solidworks-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update each project
for project in data['projects']:
    # Get the old category value
    old_category = project.get('category', 'parts')
    
    # Set new structure
    project['category'] = 'basic-models'  # All current projects are basic
    project['type'] = old_category  # Move old category to type field

# Write back to file with proper formatting
with open('Projects Code/solidworks/solidworks-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"✅ Updated {len(data['projects'])} SOLIDWORKS projects")
print(f"   - All set to category: 'basic-models'")
print(f"   - Type field added from old category values")
