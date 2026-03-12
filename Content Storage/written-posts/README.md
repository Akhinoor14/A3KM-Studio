# Written Posts Storage Structure

## Organization

Posts are now stored in a hierarchical structure organized by **Category Group** → **Category Slug**:

```
Content Storage/written-posts/
├── Engineering-Technology/
│   ├── renewable-energy-systems/
│   │   └── kuet-researchers-solar-energy-success.md
│   ├── arduino/
│   ├── programming/
│   └── ... (other engineering categories)
├── Tech & Innovation/
│   ├── ai/
│   ├── machine-learning/
│   └── ... (other tech categories)
├── General & Personal/
│   ├── personal/
│   ├── opinion/
│   └── ... (other personal categories)
└── News & Events/
    ├── news/
    ├── events/
    └── ... (other news categories)
```

## File Naming

- **Folder**: `{CategoryGroup}/{category-slug}/`
- **File**: `{slug}.md`
- **Full Path**: `Content Storage/written-posts/{CategoryGroup}/{category-slug}/{slug}.md`

## Example

```
Post Title: "কুয়েটের গবেষকদের আন্তর্জাতিক সাফল্য"
  ↓
Slug: "kuet-researchers-solar-energy-success"
Category: "Renewable Energy Systems"  →  Slug: "renewable-energy-systems"
Category Group: "Engineering-Technology"
  ↓
Path: Content Storage/written-posts/Engineering-Technology/renewable-energy-systems/kuet-researchers-solar-energy-success.md
```

## Category Group Mapping

| Category Keyword | Category Group |
|---|---|
| arduino, embedded, systems, robotics, electronics, solidworks, cad, programming, 3d, python, matlab, tutorial | Engineering-Technology |
| ai, machine, deep, nlp, startup, innovation, web | Tech & Innovation |
| personal, opinion, life, experience, reflection, general | General & Personal |
| news, event, achievement | News & Events |

## Auto-Generated Fields (Post Manager)

When creating a new post via the Post Manager, these fields are automatically generated:

- `slug`: Generated from title using slugify()
- `categorySlug`: Generated from category using slugify()
- `categoryGroup`: Determined from categoryGroup mapping
- `markdownFile`: `Content Storage/written-posts/{categoryGroup}/{categorySlug}/{slug}.md`
- `contentPath`: Same as markdownFile

## GitHub Sync

Posts are automatically synced to GitHub with:
- `posts.json` stored at: `Content Studio/written-posts/posts.json`
- Markdown files stored at: `Content Storage/written-posts/{structure}`
- Automatic folder creation via `.gitkeep` files

---

**Last Updated:** March 13, 2026  
**Version:** 2.0 - Organized Structure
