# Color Replacement Script for HTML Files
# This script replaces bright red colors with darker themed colors

$directories = @(
    "Content Studio",
    "Projects Code",
    "Only-boss/managers",
    "About me"
)

$replacements = @{
    '#CC0000' = '#8B0000'
    '#cc0000' = '#8b0000'
    '#FF0000' = '#C80000'
    '#ff0000' = '#c80000'
    '#990000' = '#5a0000'
    '#FF3333' = '#C80000'
    '#ff3333' = '#c80000'
    'rgba(204, 0, 0,' = 'rgba(139, 0, 0,'
    'rgba(204,0,0,' = 'rgba(139,0,0,'
    'rgba(153, 0, 0,' = 'rgba(90, 0, 0,'
    'rgba(153,0,0,' = 'rgba(90,0,0,'
}

$stats = @{}
$filesModified = @()

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        $htmlFiles = Get-ChildItem -Path $dir -Filter "*.html" -Recurse -ErrorAction SilentlyContinue
        
        foreach ($file in $htmlFiles) {
            try {
                $content = [IO.File]::ReadAllText($file.FullName)
                $originalContent = $content
                $fileStats = @{}
                
                foreach ($pattern in $replacements.Keys) {
                    # Count matches (case-sensitive for lowercase variants)
                    if ($pattern -cmatch '[a-z]') {
                        $matches = ([regex]::Matches($content, [regex]::Escape($pattern))).Count
                    } else {
                        $matches = ([regex]::Matches($content, [regex]::Escape($pattern), [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
                    }
                    
                    if ($matches -gt 0) {
                        $fileStats[$pattern] = $matches
                        if ($pattern -cmatch '[a-z]') {
                            $content = $content -creplace [regex]::Escape($pattern), $replacements[$pattern]
                        } else {
                            $content = $content -replace [regex]::Escape($pattern), $replacements[$pattern]
                        }
                    }
                }
                
                # Only write if content changed
                if ($content -ne $originalContent) {
                    [IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
                    
                    $totalReplacements = ($fileStats.Values | Measure-Object -Sum).Sum
                    $filesModified += [PSCustomObject]@{
                        File = $file.FullName.Replace((Get-Location).Path + "\", "")
                        Replacements = $totalReplacements
                        Details = $fileStats
                    }
                    
                    # Accumulate global stats
                    foreach ($pattern in $fileStats.Keys) {
                        if (-not $stats.ContainsKey($pattern)) {
                            $stats[$pattern] = 0
                        }
                        $stats[$pattern] += $fileStats[$pattern]
                    }
                }
            }
            catch {
                Write-Warning "Error processing $($file.FullName): $_"
            }
        }
    }
}

# Display results
Write-Host "`n=== COLOR REPLACEMENT COMPLETE ===" -ForegroundColor Green
Write-Host "Total files modified: $($filesModified.Count)`n" -ForegroundColor Yellow

foreach ($fileInfo in $filesModified | Sort-Object File) {
    Write-Host "$($fileInfo.File)" -ForegroundColor Cyan
    Write-Host "  Total replacements: $($fileInfo.Replacements)" -ForegroundColor White
    foreach ($pattern in $fileInfo.Details.Keys | Sort-Object) {
        Write-Host "    $pattern → $($replacements[$pattern]): $($fileInfo.Details[$pattern])" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "`n=== GLOBAL STATISTICS ===" -ForegroundColor Green
foreach ($pattern in $stats.Keys | Sort-Object) {
    Write-Host "$pattern → $($replacements[$pattern]): $($stats[$pattern]) total replacements" -ForegroundColor White
}
Write-Host "`nGrand Total: $(($stats.Values | Measure-Object -Sum).Sum) replacements across $($filesModified.Count) files`n" -ForegroundColor Yellow
