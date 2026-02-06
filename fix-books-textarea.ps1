# Fix textarea monospace fonts in books-manager.html
$filePath = "vscode-vfs://github/Akhinoor14/A3KM-Studio/Only-boss/managers/Content-studio/books-manager.html"
$content = Get-Content $filePath -Raw

# Replace monospace fonts with inherit
$content = $content -replace [regex]::Escape("font-family: 'Consolas', 'Monaco', monospace;"), "font-family: inherit;"

Set-Content $filePath $content -NoNewline

Write-Host "✓ Fixed textarea fonts in books-manager.html" -ForegroundColor Green
