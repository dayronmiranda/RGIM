const fs = require('fs');

// Read the file
let content = fs.readFileSync('assets/app.js', 'utf8');

// Fix ALL syntax errors with a more aggressive approach
// Replace any occurrence of "image 'thumbnail'" with "image, 'thumbnail'"
content = content.replace(/getOptimizedImagePath\(([^)]+)\s+'thumbnail'\)/g, 
                         "getOptimizedImagePath($1, 'thumbnail')");

// Fix function definition
content = content.replace(/function getOptimizedImagePath\(originalPath\s+size/g,
                         "function getOptimizedImagePath(originalPath, size");

// Update the function to use original extension
// Find the function and replace it
const functionStart = content.indexOf('function getOptimizedImagePath');
if (functionStart !== -1) {
  const functionEnd = content.indexOf('}', functionStart) + 1;
  const oldFunction = content.substring(functionStart, functionEnd);
  
  const newFunction = `function getOptimizedImagePath(originalPath, size = 'thumbnail') {
    if (!originalPath) return null
    
    // Extract filename and extension from original path
    const filename = originalPath.split('/').pop()
    const ext = filename.match(/\.[^/.]+$/)[0] // Get the extension (e.g., .png)
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")
    
    // Return optimized image path keeping the original extension
    return \`./assets/images/optimized/\${nameWithoutExt}-\${size}\${ext}\`
  }`;
  
  content = content.substring(0, functionStart) + newFunction + content.substring(functionEnd);
}

// Write back
fs.writeFileSync('assets/app.js', content);

console.log('✅ All fixes applied successfully!');