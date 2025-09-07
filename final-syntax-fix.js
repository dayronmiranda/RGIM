const fs = require('fs');

// Read the file
let content = fs.readFileSync('assets/app.js', 'utf8');

// Fix ALL occurrences of missing commas in getOptimizedImagePath calls
// This regex will match any pattern like: getOptimizedImagePath(something 'thumbnail')
// and replace it with: getOptimizedImagePath(something, 'thumbnail')

// Fix function calls
content = content.replace(/getOptimizedImagePath\(([^,)]+)\s+'([^']+)'\)/g, 
                         'getOptimizedImagePath($1, \'$2\')');

// Fix function definition
content = content.replace(/function getOptimizedImagePath\(([^,)]+)\s+size/g,
                         'function getOptimizedImagePath($1, size');

// Write back
fs.writeFileSync('assets/app.js', content);

console.log('✅ Fixed all syntax errors (missing commas)');