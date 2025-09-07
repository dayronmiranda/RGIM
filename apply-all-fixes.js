const fs = require('fs');

// Read the file
let content = fs.readFileSync('assets/app.js', 'utf8');

// 1. First add the getOptimizedImagePath function after line 96 (after fmtCurrency function)
const functionToAdd = `
  // Get optimized image path keeping original extension
  function getOptimizedImagePath(originalPath, size = 'thumbnail') {
    if (!originalPath) return null
    
    // Extract filename and extension from original path
    const filename = originalPath.split('/').pop()
    const lastDotIndex = filename.lastIndexOf('.')
    const ext = filename.substring(lastDotIndex) // Get extension like .png
    const nameWithoutExt = filename.substring(0, lastDotIndex)
    
    // Return optimized image path keeping the original extension
    return \`./assets/images/optimized/\${nameWithoutExt}-\${size}\${ext}\`
  }
`;

// Find where to insert the function (after fmtCurrency)
const fmtCurrencyEnd = content.indexOf('function fmtCurrency');
const nextFunctionStart = content.indexOf('\n\n', fmtCurrencyEnd);
if (nextFunctionStart !== -1 && !content.includes('getOptimizedImagePath')) {
  content = content.substring(0, nextFunctionStart) + functionToAdd + content.substring(nextFunctionStart);
}

// 2. Update renderProducts function to use optimized images
content = content.replace(
  /function renderProducts\(\)\{([\s\S]*?)list\.forEach\(p => \{([\s\S]*?)card\.innerHTML = `([\s\S]*?)<img src="\$\{p\.image\}"/g,
  function(match, before, middle, html) {
    return `function renderProducts(){${before}list.forEach(p => {${middle}// Get optimized image path
      const optimizedImage = getOptimizedImagePath(p.image, 'thumbnail')
      
      card.innerHTML = \`${html}<img src="\${optimizedImage || p.image}"`;
  }
);

// 3. Update renderCartSidebar to use optimized images
content = content.replace(
  /renderCartSidebar\(\)\{([\s\S]*?)row\.innerHTML = `([\s\S]*?)<img src="\$\{p\.image\}"/g,
  function(match, before, html) {
    return `renderCartSidebar(){${before}// Get optimized image for cart sidebar
      const optimizedImage = getOptimizedImagePath(p.image, 'thumbnail')
      
      row.innerHTML = \`${html}<img src="\${optimizedImage || p.image}"`;
  }
);

// 4. Update renderFilteredProducts for search results
content = content.replace(
  /function renderFilteredProducts\(products\) \{([\s\S]*?)products\.forEach\(p => \{([\s\S]*?)card\.innerHTML = `([\s\S]*?)<img src="\$\{p\.image\}"/g,
  function(match, before, middle, html) {
    return `function renderFilteredProducts(products) {${before}products.forEach(p => {${middle}// Get optimized image
      const optimizedImage = getOptimizedImagePath(p.image, 'thumbnail')
      
      card.innerHTML = \`${html}<img src="\${optimizedImage || p.image}"`;
  }
);

// Write the fixed content back
fs.writeFileSync('assets/app.js', content);

console.log('✅ Successfully applied all fixes:');
console.log('  - Added getOptimizedImagePath function');
console.log('  - Updated renderProducts to use optimized images');
console.log('  - Updated renderCartSidebar to use optimized images');
console.log('  - Updated renderFilteredProducts to use optimized images');
console.log('  - Keeping original .png extensions');