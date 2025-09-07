const fs = require('fs');

// Read the file
let content = fs.readFileSync('assets/app.js', 'utf8');

// Fix the syntax error - missing comma
content = content.replace(
  "getOptimizedImagePath(p.image 'thumbnail')",
  "getOptimizedImagePath(p.image, 'thumbnail')"
);

// Also fix it in the mobile version if it exists
content = content.replace(
  "getOptimizedImagePath(p.image 'thumbnail')",
  "getOptimizedImagePath(p.image, 'thumbnail')"
);

// Write the fixed content back
fs.writeFileSync('assets/app.js', content);

console.log('Fixed syntax error in app.js');