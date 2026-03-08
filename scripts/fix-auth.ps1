Set-Location "d:\A3KM-Studio"

function Add-FirebaseAuth {
    param([string]$FilePath, [string]$Prefix)
    $full = Join-Path "d:\A3KM-Studio" $FilePath
    if (-not (Test-Path $full)) { Write-Output "NOT FOUND: $FilePath"; return }
    $content = [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)
    if ($content -match 'firebase-config\.js') { Write-Output "SKIP: $FilePath"; return }
    $authBlock = @"

    <!-- Firebase Auth System -->
    <script src="${Prefix}firebase-app-compat.js" crossorigin="anonymous"></script>
    <script src="${Prefix}firebase-auth-compat.js" crossorigin="anonymous"></script>
    <script src="${Prefix}firebase-firestore-compat.js" crossorigin="anonymous"></script>
    <script src="${Prefix}Optimization/firebase-config.js"></script>
    <script src="${Prefix}Optimization/auth-module.js"></script>
"@
    $newContent = $content -replace '</body>', "$authBlock`n</body>"
    [System.IO.File]::WriteAllText($full, $newContent, [System.Text.Encoding]::UTF8)
    Write-Output "FIXED: $FilePath"
}

# NOTE: firebase CDN scripts already added in previous pass to 37 pages.
# For new pages, use full CDN URLs
function Add-FirebaseAuthFull {
    param([string]$FilePath, [string]$Prefix)
    $full = Join-Path "d:\A3KM-Studio" $FilePath
    if (-not (Test-Path $full)) { Write-Output "NOT FOUND: $FilePath"; return }
    $content = [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)
    if ($content -match 'firebase-config\.js') { Write-Output "SKIP: $FilePath"; return }
    $authBlock = @"

    <!-- Firebase Auth System -->
    <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"></script>
    <script src="${Prefix}firebase-config.js"></script>
    <script src="${Prefix}auth-module.js"></script>
"@
    $newContent = $content -replace '</body>', "$authBlock`n</body>"
    [System.IO.File]::WriteAllText($full, $newContent, [System.Text.Encoding]::UTF8)
    Write-Output "FIXED: $FilePath"
}

# Pages to fix with their Optimization/ prefix
Add-FirebaseAuthFull "About me\certificates-viewer.html"          "../Optimization/"
Add-FirebaseAuthFull "Content Studio\books-pdfs\book-3d.html"     "../../Optimization/"
Add-FirebaseAuthFull "Content Studio\video-content\video-viewer.html"      "../../Optimization/"
Add-FirebaseAuthFull "Content Studio\written-posts\post-reader.html"       "../../Optimization/"
Add-FirebaseAuthFull "images\logos\all-logos.html"                "../../Optimization/"
Add-FirebaseAuthFull "images\logos\preview.html"                  "../../Optimization/"
Add-FirebaseAuthFull "images\logos\preview-v2.html"               "../../Optimization/"
Add-FirebaseAuthFull "images\logos\preview-v3.html"               "../../Optimization/"
Add-FirebaseAuthFull "images\logos\premium\preview.html"          "../../../Optimization/"
Add-FirebaseAuthFull "Projects Code\Arduino\arduino-doc-reader.html"       "../../Optimization/"
Add-FirebaseAuthFull "Projects Code\programming\code-viewer.html"          "../../Optimization/"
Add-FirebaseAuthFull "Projects Code\programming\programming-listing.html"  "../../Optimization/"
Add-FirebaseAuthFull "Projects Code\websites\websites-listing.html"        "../../Optimization/"
Add-FirebaseAuthFull "index.html"                                 "Optimization/"

Write-Output ""
Write-Output "=== Done. Running final verification ==="
$allHtml = Get-ChildItem -Recurse -Include "*.html" | Where-Object { $_.FullName -notmatch "Only-boss|Documentation|mobile.shared.mobile-navbar|images.logos|audit" }
$missing = @()
foreach ($f in $allHtml) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    if (-not ($c -match 'firebase-config\.js')) {
        $missing += $f.FullName.Replace("D:\A3KM-Studio\", "")
    }
}
if ($missing.Count -eq 0) {
    Write-Output "ALL CONTENT PAGES HAVE AUTH SCRIPTS"
} else {
    Write-Output "Still missing ($($missing.Count)):"
    $missing | ForEach-Object { Write-Output "  $_" }
}
