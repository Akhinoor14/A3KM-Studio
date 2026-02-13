# Check Mobile CSS Loading Order in Only-boss Pages
Write-Host "==================================" -ForegroundColor Cyan
Write-Host " Mobile CSS Order Checker" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$filesWithIssues = @()
$filesCorrect = @()
$filesNoMobileCSS = @()

# Find all HTML files in Only-boss directory
$htmlFiles = Get-ChildItem -Path "Only-boss" -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file has mobile CSS links
    $hasMobileCSS = $content -match 'only-boss-global-mobile\.css'
    
    if (-not $hasMobileCSS) {
        $filesNoMobileCSS += $file.FullName.Replace((Get-Location).Path + "\", "")
        continue
    }
    
    # Find positions
    $stylTagPos = $content.IndexOf('<style>')
    $styleClosePos = $content.IndexOf('</style>')
    $mobileCSSPos = $content.IndexOf('only-boss-global-mobile.css')
    
    if ($stylTagPos -eq -1 -or $styleClosePos -eq -1) {
        # No inline styles, CSS order doesn't matter
        $filesCorrect += $file.FullName.Replace((Get-Location).Path + "\", "")
        continue
    }
    
    # Check if mobile CSS is BEFORE </style> tag (WRONG)
    if ($mobileCSSPos -gt $stylTagPos -and $mobileCSSPos -lt $styleClosePos) {
        $filesWithIssues += @{
            Path = $file.FullName.Replace((Get-Location).Path + "\", "")
            Issue = "Mobile CSS INSIDE <style> tag"
        }
    }
    # Check if mobile CSS is BEFORE <style> tag (WRONG)
    elseif ($mobileCSSPos -lt $stylTagPos) {
        $filesWithIssues += @{
            Path = $file.FullName.Replace((Get-Location).Path + "\", "")
            Issue = "Mobile CSS loaded BEFORE desktop styles"
        }
    }
    # Mobile CSS after </style> tag (CORRECT)
    else {
        $filesCorrect += $file.FullName.Replace((Get-Location).Path + "\", "")
    }
}

# Display Results
Write-Host "SUMMARY:" -ForegroundColor Yellow
Write-Host "--------" -ForegroundColor Yellow
Write-Host "Total HTML files: $($htmlFiles.Count)" -ForegroundColor White
Write-Host ""

if ($filesWithIssues.Count -gt 0) {
    Write-Host "❌ FILES WITH ISSUES ($($filesWithIssues.Count)):" -ForegroundColor Red
    Write-Host "----------------------------------" -ForegroundColor Red
    foreach ($item in $filesWithIssues) {
        Write-Host "  • $($item.Path)" -ForegroundColor Red
        Write-Host "    └─ $($item.Issue)" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($filesCorrect.Count -gt 0) {
    Write-Host "✅ FILES CORRECT ($($filesCorrect.Count)):" -ForegroundColor Green
    Write-Host "-------------------------" -ForegroundColor Green
    foreach ($path in $filesCorrect) {
        Write-Host "  • $path" -ForegroundColor Green
    }
    Write-Host ""
}

if ($filesNoMobileCSS.Count -gt 0) {
    Write-Host "ℹ️  FILES WITHOUT MOBILE CSS ($($filesNoMobileCSS.Count)):" -ForegroundColor Gray
    Write-Host "--------------------------------------" -ForegroundColor Gray
    foreach ($path in $filesNoMobileCSS) {
        Write-Host "  • $path" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
