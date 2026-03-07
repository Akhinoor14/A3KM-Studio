Set-Location "d:\A3KM-Studio"

Write-Output "=== AUTH AUDIT (all HTML except Only-boss, Documentation) ==="
$allHtml = Get-ChildItem -Recurse -Include "*.html" | Where-Object { $_.FullName -notmatch "Only-boss|Documentation|audit" }
$missingAuth = @()
foreach ($f in $allHtml) {
    $c = Get-Content $f.FullName -Raw
    $hasFC = $c -match 'firebase-config\.js'
    $hasAM = $c -match 'auth-module\.js'
    if (-not $hasFC -or -not $hasAM) {
        $missingAuth += $f.FullName.Replace("D:\A3KM-Studio\", "")
    }
}
Write-Output "Missing auth total: $($missingAuth.Count)"
$missingAuth | ForEach-Object { Write-Output "  AUTH-MISSING: $_" }

Write-Output ""
Write-Output "=== MOBILE NAVBAR AUDIT ==="
$mobileHtml = Get-ChildItem -Path "mobile" -Recurse -Include "*.html"
$missingNav = @()
foreach ($f in $mobileHtml) {
    $c = Get-Content $f.FullName -Raw
    if (-not ($c -match 'mobile-navbar\.js')) {
        $missingNav += $f.FullName.Replace("D:\A3KM-Studio\", "")
    }
}
Write-Output "Mobile pages missing navbar total: $($missingNav.Count)"
$missingNav | ForEach-Object { Write-Output "  NAV-MISSING: $_" }
