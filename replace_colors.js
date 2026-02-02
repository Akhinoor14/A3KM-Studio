const fs = require('fs');
const path = require('path');

// File path
const filePath = path.join('Projects Code', 'Arduino', 'arduino-project-viewer.html');

// Read file
let content = fs.readFileSync(filePath, 'utf8');

// Track replacement counts
const replacements = {
    'rgba(204, 0, 0,': 0,
    'rgba(204,0,0,': 0,
    '#CC0000': 0,
    '#FF3333': 0,
    '#FF0000': 0
};

// 1. Replace rgba(204, 0, 0, → rgba(139, 0, 0, (with spaces)
replacements['rgba(204, 0, 0,'] = (content.match(/rgba\(204, 0, 0,/g) || []).length;
content = content.replace(/rgba\(204, 0, 0,/g, 'rgba(139, 0, 0,');

// 2. Replace rgba(204,0,0, → rgba(139,0,0, (no spaces)
replacements['rgba(204,0,0,'] = (content.match(/rgba\(204,0,0,/g) || []).length;
content = content.replace(/rgba\(204,0,0,/g, 'rgba(139,0,0,');

// 3. Replace #CC0000 → #8B0000 (case insensitive)
replacements['#CC0000'] = (content.match(/#[Cc][Cc]0000/g) || []).length;
content = content.replace(/#[Cc][Cc]0000/g, '#8B0000');

// 4. Replace #FF3333 → #C80000 (case insensitive)
replacements['#FF3333'] = (content.match(/#[Ff][Ff]3333/g) || []).length;
content = content.replace(/#[Ff][Ff]3333/g, '#C80000');

// 5. Replace #FF0000 → #C80000 (case insensitive)
replacements['#FF0000'] = (content.match(/#[Ff][Ff]0000/g) || []).length;
content = content.replace(/#[Ff][Ff]0000/g, '#C80000');

// Save modified content
fs.writeFileSync(filePath, content, 'utf8');

// Print summary
console.log('\n' + '='.repeat(50));
console.log('COLOR REPLACEMENT SUMMARY');
console.log('='.repeat(50));

let total = 0;
for (const [pattern, count] of Object.entries(replacements)) {
    console.log(`${pattern.padEnd(20)} : ${String(count).padStart(3)} replacements`);
    total += count;
}

console.log('='.repeat(50));
console.log(`TOTAL: ${total} replacements made`);
console.log('='.repeat(50));
console.log('\n✓ File successfully updated!');
