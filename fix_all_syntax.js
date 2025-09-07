const fs = require('fs');

// Read the file
let content = fs.readFileSync('assets/app.js', 'utf8');

// Fix ALL syntax errors - missing commas in function calls
// Using a regex to match all occurrences
content = content.replace(/getOptimizedImagePath\(([^,)]+)\s+'([^']+)'\)/g, 
                         'getOptimizedImagePath($1, \'$2\')');

// Also fix the function definition if needed
content = content.replace(/function getOptimizedImagePath\(originalPath\s+size = 'thumbnail'\)/g,
                         'function getOptimizedImagePath(originalPath, size = \'thumbnail\')');

// Write the fixed content back
fs.writeFileSync('assets/app.js', content);

console.log('Fixed all syntax errors in app.js');