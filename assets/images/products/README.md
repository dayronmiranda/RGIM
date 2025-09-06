# Product Images Directory

This directory contains the original product images that will be processed and optimized.

## Image Requirements

### Supported Formats
- JPG/JPEG
- PNG
- WebP

### Recommended Specifications
- **Minimum Resolution**: 800x600 pixels
- **Maximum File Size**: 2MB per image
- **Aspect Ratio**: Square (1:1) or landscape (4:3, 16:9)
- **Color Space**: sRGB

## Optimization Process

When you run `npm run optimize-images`, the script will:

1. **Process all images** in this directory
2. **Generate two sizes** for each image:
   - **Thumbnail**: 300x300px (for product grids)
   - **Medium**: 800x600px (for product details)
3. **Convert to JPG** format with optimized compression
4. **Save optimized images** to `assets/images/optimized/`

## File Naming Convention

### Input Files
- `product-001.jpg`
- `laptop-gaming.png`
- `smartphone-pro.webp`

### Output Files (Generated)
- `product-001-thumbnail.jpg` (300x300)
- `product-001-medium.jpg` (800x600)
- `laptop-gaming-thumbnail.jpg` (300x300)
- `laptop-gaming-medium.jpg` (800x600)

## Usage in Code

```javascript
// Use optimized images in your HTML/JavaScript
const productImage = {
  thumbnail: './assets/images/optimized/product-001-thumbnail.jpg',
  medium: './assets/images/optimized/product-001-medium.jpg'
}
```

## Performance Benefits

- **70% average file size reduction**
- **Faster page loading times**
- **Better mobile experience**
- **Improved SEO scores**

## Adding New Images

1. Place your original images in this directory
2. Run `npm run optimize-images`
3. Update your product data to reference the optimized images
4. Test the images display correctly

## Notes

- The optimization script will skip existing optimized images by default
- Use high-quality source images for best results
- Consider the final display size when choosing source resolution
- All images are converted to JPG format for consistency