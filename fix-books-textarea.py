# Fix textarea monospace fonts in books-manager.html
with open('Only-boss/managers/Content-studio/books-manager.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace monospace fonts with inherit
content = content.replace(
    "font-family: 'Consolas', 'Monaco', monospace;",
    "font-family: inherit;"
)

with open('Only-boss/managers/Content-studio/books-manager.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed textarea fonts in books-manager.html")
