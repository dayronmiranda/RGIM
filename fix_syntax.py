import re

# Read the file
with open('assets/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix all syntax errors
# Fix function calls missing comma
content = re.sub(r"getOptimizedImagePath\(p\.image '", "getOptimizedImagePath(p.image, '", content)
content = re.sub(r"getOptimizedImagePath\(product\.image '", "getOptimizedImagePath(product.image, '", content)

# Fix function definition missing comma
content = re.sub(r"function getOptimizedImagePath\(originalPath size", 
                 "function getOptimizedImagePath(originalPath, size", content)

# Write the fixed content back
with open('assets/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed all syntax errors in app.js')