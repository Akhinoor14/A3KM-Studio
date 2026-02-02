# Quick Color Replacement - Process all HTML files in specific directories

$targetPaths = @(
    "Content Studio",
    "Projects Code",
    "Only-boss/managers"
)

$fileCount = 0
$replacementCount = 0

foreach ($basePath in $targetPaths) {
    if (-not (Test-Path $basePath)) { continue }
    
    $files = Get-ChildItem -Path $basePath -Filter "*.html" -Recurse -ErrorAction SilentlyContinue
    
    foreach ($file in $files) {
        try {
            $content = [IO.File]::ReadAllText($file.FullName, [System.Text.UTF8Encoding]::new($false))
            $original = $content
            
            # Perform replacements
            $content = $content -replace 'rgba\(204, 0, 0,', 'rgba(139, 0, 0,'
            $content = $content -creplace 'rgba\(204,0,0,', 'rgba(139,0,0,'
            $content = $content -replace 'rgba\(153, 0, 0,', 'rgba(90, 0, 0,'
            $content = $content -creplace 'rgba\(153,0,0,', 'rgba(90,0,0,'
            
            $content = $content -ireplace '#CC0000', '#8B0000'
            $content = $content -ireplace '#cc0000', '#8b0000'
            $content = $content -ireplace '#990000', '#5a0000'
            $content = $content -ireplace '#FF3333', '#C80000'
            $content = $content -ireplace '#ff3333', '#c80000'
            
            # Special case for YouTube red (keep some #FF0000 for actual YouTube branding)
            # We'll be conservative and replace most #FF0000 with #C80000
            $content = $content -ireplace '#FF0000', '#C80000'
            $content = $content -ireplace '#ff0000', '#c80000'
            
            if ($content -ne $original) {
                [IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
                $fileCount++
                Write-Host "Fixed: $($file.FullName.Replace((Get-Location).Path + '\', ''))" -ForegroundColor Green
            }
        }
        catch {
            Write-Warning "Error: $($file.FullName) - $_"
        }
    }
}

Write-Host "`nProcessed $fileCount files" -ForegroundColor Yellow
