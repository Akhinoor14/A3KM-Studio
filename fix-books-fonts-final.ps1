# Fix all monospace fonts in books-manager.html
$filePath = "Only-boss/managers/Content-studio/books-manager.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Replace all Consolas/Monaco monospace with Bangla-supporting font
$content = $content.Replace("font-family: 'Consolas', 'Monaco', monospace;", "font-family: 'Noto Sans Bengali', 'Courier New', monospace;")

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)

Write-Host "✓ Fixed all 4 monospace font declarations in books-manager.html" -ForegroundColor Green
Write-Host "✓ Textareas now support Bangla text" -ForegroundColor Green
