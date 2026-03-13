param(
    [string]$PostsJsonPath = "d:\Skill\Website\A3KM Studio\Content Studio\written-posts\posts.json"
)

$ErrorActionPreference = "Stop"

function Get-Slug([string]$Text) {
    if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
    $slug = $Text.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
    $slug = $slug.Trim('-')
    if ($slug.Length -gt 50) { $slug = $slug.Substring(0, 50).Trim('-') }
    return $slug
}

function Get-PlainText([string]$Text) {
    if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
    $plain = $Text -replace "<[^>]+>", " "
    $plain = $plain -replace "\s+", " "
    return $plain.Trim()
}

function Get-StringArray($Value) {
    if ($null -eq $Value) { return @() }
    if ($Value -is [System.Array]) {
        return @($Value | ForEach-Object { "$_" } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    }
    $single = "${Value}".Trim()
    if ([string]::IsNullOrWhiteSpace($single)) { return @() }
    return @($single)
}

if (-not (Test-Path -LiteralPath $PostsJsonPath)) {
    throw "posts.json not found: $PostsJsonPath"
}

$jsonRaw = Get-Content -LiteralPath $PostsJsonPath -Raw -Encoding UTF8
$data = $jsonRaw | ConvertFrom-Json

if ($null -eq $data.posts) {
    Write-Host "No posts array found. Nothing to migrate."
    exit 0
}

$changed = 0
$index = 0

foreach ($post in $data.posts) {
    $index++

    if (-not $post.id) {
        $post | Add-Member -NotePropertyName id -NotePropertyValue ("post-" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() + "-" + $index)
        $changed++
    }

    $slug = if ($post.slug) { "$($post.slug)" } else { Get-Slug "$($post.title)" }
    if ([string]::IsNullOrWhiteSpace($slug)) {
        $slug = "post-$index"
    }
    if (-not $post.slug -or $post.slug -ne $slug) {
        if ($post.PSObject.Properties.Name -contains "slug") { $post.slug = $slug } else { $post | Add-Member -NotePropertyName slug -NotePropertyValue $slug }
        $changed++
    }

    $category = if ($post.category) { "$($post.category)" } else { "General" }
    $categorySlug = if ($post.categorySlug) { "$($post.categorySlug)" } else { Get-Slug $category }
    if ([string]::IsNullOrWhiteSpace($categorySlug)) { $categorySlug = "general" }
    if (-not $post.categorySlug -or $post.categorySlug -ne $categorySlug) {
        if ($post.PSObject.Properties.Name -contains "categorySlug") { $post.categorySlug = $categorySlug } else { $post | Add-Member -NotePropertyName categorySlug -NotePropertyValue $categorySlug }
        $changed++
    }

    if (-not $post.categoryGroup) {
        $group = "General & Personal"
        if ($category -match "engineering|arduino|robotics|embedded|python|matlab|systems|cad|solar|energy") {
            $group = "Engineering-Technology"
        } elseif ($category -match "ai|machine|deep|web|innovation|startup") {
            $group = "Tech & Innovation"
        } elseif ($category -match "news|event|achievement") {
            $group = "News & Events"
        }
        $post | Add-Member -NotePropertyName categoryGroup -NotePropertyValue $group
        $changed++
    }

    $summary = "$($post.summary)"
    if ([string]::IsNullOrWhiteSpace($summary)) {
        $summary = "$($post.description)"
    }
    if ([string]::IsNullOrWhiteSpace($summary)) {
        $summary = "$($post.contentPreview)"
    }
    if ([string]::IsNullOrWhiteSpace($summary)) {
        $summary = Get-PlainText "$($post.excerpt)"
    }
    if ([string]::IsNullOrWhiteSpace($summary)) {
        $summary = Get-PlainText "$($post.content)"
    }
    if ($summary.Length -gt 200) { $summary = $summary.Substring(0, 200).Trim() + "..." }

    if (-not $post.summary -or $post.summary -ne $summary) {
        if ($post.PSObject.Properties.Name -contains "summary") { $post.summary = $summary } else { $post | Add-Member -NotePropertyName summary -NotePropertyValue $summary }
        $changed++
    }

    $dateValue = "$($post.date)"
    if ([string]::IsNullOrWhiteSpace($dateValue)) { $dateValue = "$($post.publishDate)" }
    if ([string]::IsNullOrWhiteSpace($dateValue)) { $dateValue = "$($post.lastModified)" }
    if ([string]::IsNullOrWhiteSpace($dateValue)) { $dateValue = (Get-Date).ToString("yyyy-MM-dd") }

    if (-not $post.date -or $post.date -ne $dateValue) {
        if ($post.PSObject.Properties.Name -contains "date") { $post.date = $dateValue } else { $post | Add-Member -NotePropertyName date -NotePropertyValue $dateValue }
        $changed++
    }

    $readTime = 0
    if ($post.readTime) { $readTime = [int]$post.readTime }
    elseif ($post.readingTime) {
        $raw = "$($post.readingTime)"
        if ($raw -match "(\d+)") { $readTime = [int]$Matches[1] }
    } elseif ($post.wordCount) {
        $readTime = [Math]::Max(1, [Math]::Ceiling(([int]$post.wordCount) / 200.0))
    }
    if ($readTime -le 0) { $readTime = 1 }

    if (-not $post.readTime -or [int]$post.readTime -ne $readTime) {
        if ($post.PSObject.Properties.Name -contains "readTime") { $post.readTime = $readTime } else { $post | Add-Member -NotePropertyName readTime -NotePropertyValue $readTime }
        $changed++
    }

    $contentPath = "$($post.contentPath)"
    if ([string]::IsNullOrWhiteSpace($contentPath)) { $contentPath = "$($post.markdownFile)" }
    if ([string]::IsNullOrWhiteSpace($contentPath)) {
        $content = "$($post.content)"
        if ($content -match "\.md$") { $contentPath = $content }
    }

    if (-not [string]::IsNullOrWhiteSpace($contentPath)) {
        if (-not $post.contentPath -or $post.contentPath -ne $contentPath) {
            if ($post.PSObject.Properties.Name -contains "contentPath") { $post.contentPath = $contentPath } else { $post | Add-Member -NotePropertyName contentPath -NotePropertyValue $contentPath }
            $changed++
        }
        if (-not $post.markdownFile -or $post.markdownFile -ne $contentPath) {
            if ($post.PSObject.Properties.Name -contains "markdownFile") { $post.markdownFile = $contentPath } else { $post | Add-Member -NotePropertyName markdownFile -NotePropertyValue $contentPath }
            $changed++
        }
    }

    $cover = "$($post.coverImage)"
    if ([string]::IsNullOrWhiteSpace($cover)) { $cover = "$($post.thumbnail)" }
    if ([string]::IsNullOrWhiteSpace($cover)) { $cover = "$($post.thumbnailUrl)" }

    if (-not [string]::IsNullOrWhiteSpace($cover)) {
        if (-not $post.coverImage -or $post.coverImage -ne $cover) {
            if ($post.PSObject.Properties.Name -contains "coverImage") { $post.coverImage = $cover } else { $post | Add-Member -NotePropertyName coverImage -NotePropertyValue $cover }
            $changed++
        }
        if (-not $post.thumbnail -or $post.thumbnail -ne $cover) {
            if ($post.PSObject.Properties.Name -contains "thumbnail") { $post.thumbnail = $cover } else { $post | Add-Member -NotePropertyName thumbnail -NotePropertyValue $cover }
            $changed++
        }
    }

    $tags = Get-StringArray $post.tags
    if ($tags.Count -eq 0) { $tags = @('general') }
    if (($post.PSObject.Properties.Name -contains 'tags') -and ($post.tags -join '|') -ne ($tags -join '|')) {
        $post.tags = $tags
        $changed++
    } elseif (-not ($post.PSObject.Properties.Name -contains 'tags')) {
        $post | Add-Member -NotePropertyName tags -NotePropertyValue $tags
        $changed++
    }
}

if ($changed -eq 0) {
    Write-Host "No migration changes needed."
    exit 0
}

if ($data.PSObject.Properties.Name -contains 'lastMigration') {
    $data.lastMigration = [PSCustomObject]@{
        date = (Get-Date).ToString('o')
        tool = 'scripts/migrate-written-posts.ps1'
        changes = $changed
    }
} else {
    $data | Add-Member -NotePropertyName lastMigration -NotePropertyValue ([PSCustomObject]@{
        date = (Get-Date).ToString('o')
        tool = 'scripts/migrate-written-posts.ps1'
        changes = $changed
    })
}

$jsonOut = $data | ConvertTo-Json -Depth 100
Set-Content -LiteralPath $PostsJsonPath -Value $jsonOut -Encoding UTF8

Write-Host "Migration complete. Updated fields: $changed"
