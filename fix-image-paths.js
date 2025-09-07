const fs = require('fs');

// Read the app.js file
let content = fs.readFileSync('assets/app.js', 'utf8');

// First, fix the syntax errors (missing commas)
content = content.replace(/getOptimizedImagePath\(p\.image\s+'thumbnail'/g, "getOptimizedImagePath(p.image, 'thumbnail'");
content = content.replace(/getOptimizedImagePath\(product\.image\s+'thumbnail'/g, "getOptimizedImagePath(product.image, 'thumbnail'");
content = content.replace(/getOptimizedImagePath\(originalPath\s+size/g, "getOptimizedImagePath(originalPath, size");

// Now update the function to keep the original extension
const oldFunction = `  // Get optimized image path
  function getOptimizedImagePath(originalPath, size = 'thumbnail') {
    if (!originalPath) return null
    
    // Extract filename from original path
    const filename = originalPath.split('/').pop()
    const nameWithoutExt = filename.replace(/\\.[^/.]+$/, "")
    
    // Return optimized image path - try both naming conventions
    const optimizedPath1 = \`./assets/images/optimized/\${nameWithoutExt}-\${size}.jpg\`
    const optimizedPath2 = \`./assets/images/optimized/\${nameWithoutExt}_\${size}.jpg\`
    
    // For now, return the first format (with dash)
    // In production, you might want to check which file exists
    return optimizedPath1
  }`;

const newFunction = `  // Get optimized image path
  function getOptimizedImagePath(originalPath, size = 'thumbnail') {
    if (!originalPath) return null
    
    // Extract filename and extension from original path
    const filename = originalPath.split('/').pop()
    const ext = filename.match(/\.[^/.]+$/)[0] // Get the extension (e.g., .png)
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")
    
    // Return optimized image path keeping the original extension
    return \`./assets/images/optimized/\${nameWithoutExt}-\${size}\${ext}\`
  }`;

// Replace the function
content = content.replace(oldFunction, newFunction);

// If the function wasn't found with that exact format, try a more flexible approach
if (!content.includes('// Return optimized image path keeping the original extension')) {
  // Find and replace just the return statement
  content = content.replace(
    /return `\.\/assets\/images\/optimized\/\$\{nameWithoutExt\}-\$\{size\}\.jpg`/g,
    'return `./assets/images/optimized/${nameWithoutExt}-${size}${ext}`'
  );
  
  // Make sure we capture the extension
  content = content.replace(
    /const nameWithoutExt = filename\.replace\(\/\\\.\[\^\/\.\]\+\$\/, ""\)/g,
    `const ext = filename.match(/\\.[^/.]+$/)[0] // Get the extension (e.g., .png)
    const nameWithoutExt = filename.replace(/\\.[^/.]+$/, "")`
  );
}

// Write the fixed content back
fs.writeFileSync('assets/app.js', content);

console.log('✅ Fixed image paths to keep original extensions');
console.log('✅ Fixed syntax errors (missing commas)');