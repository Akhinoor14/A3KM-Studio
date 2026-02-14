# PowerShell script to update SOLIDWORKS categories
$jsonPath = "Projects Code/solidworks/solidworks-data.json"

# Read JSON
$data = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Update each project
foreach ($project in $data.projects) {
    $oldCategory = $project.category
    
    # Add new fields
    $project | Add-Member -NotePropertyName "type" -NotePropertyValue $oldCategory -Force
    $project.category = "basic-models"
}

# Write back to file
$data | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8

Write-Host "✅ Updated $($data.projects.Count) SOLIDWORKS projects" -ForegroundColor Green
Write-Host "   - All set to category: 'basic-models'" -ForegroundColor Cyan
Write-Host "   - Type field added from old category values" -ForegroundColor Cyan
