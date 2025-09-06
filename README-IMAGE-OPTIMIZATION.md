# Image Optimization System for RGIM Website

This document explains the image compression and lazy loading system implemented for the RGIM website.

## Features

- **Automatic Image Compression**: Reduces file size without significant quality loss
- **Multiple Format Support**: Generates WebP, AVIF, and JPEG versions
- **Responsive Images**: Creates multiple sizes (thumbnail, medium, large)
- **Lazy Loading**: Images load only when they enter the viewport
- **Progressive Enhancement**: Fallbacks for older browsers
- **Configuration-Based**: Easy to adjust settings via config.json

## Installation

1. Install the required dependencies:
```bash
npm install
```

This will install:
- `sharp`: High-performance image processing
- `multer`: File upload handling (for future use)

## Configuration

The system is configured via `config.json`:

```json
{
  "images": {
    "compression": {
      "quality": 85,
      "progressive": true,
      "mozjpeg": true
    },
    "sizes": {
      "thumbnail": { "width": 300, "height": 300, "fit": "cover" },
      "medium": { "width": 600, "height": 600, "fit": "cover" },
      "large": { "width": 1200, "height": 1200, "fit": "inside" }
    },
    "formats": {
      "webp": { "quality": 80, "effort": 4 },
      "avif": { "quality": 75, "effort": 4 },
      "jpeg": { "quality": 85, "progressive": true, "mozjpeg": true }
    },
    "lazyLoading": {
      "enabled": true,
      "rootMargin": "50px",
      "threshold": 0.1
    }
  }
}
```

### Configuration Options

- **compression.quality**: JPEG quality (0-100)
- **sizes**: Different image dimensions to generate
- **formats**: Output formats with specific settings
- **lazyLoading.rootMargin**: How early to start loading images
- **lazyLoading.threshold**: Intersection threshold for loading

## Usage

### 1. Optimize Existing Images

To optimize all images in the `assets/images/products/` directory:

```bash
npm run optimize-images
```

This will:
- Process all PNG, JPG, JPEG, and WebP files
- Generate optimized versions in multiple sizes and formats
- Save them to `assets/images/optimized/`
- Create a detailed report

### 2. Using Optimized Images in HTML

#### Method 1: Using ImageUtils (Recommended)

```javascript
// Create a responsive product image
const imageHtml = window.imageUtils.createProductImage('product_001', {
  name: 'Product Name',
  price: '99.99'
});

// Insert into DOM
document.getElementById('product-container').innerHTML = imageHtml;
```

#### Method 2: Manual HTML

```html
<picture class="lazy-image image-container aspect-square">
  <source data-srcset="/assets/images/optimized/product_001_large.avif" type="image/avif" media="(min-width: 768px)">
  <source data-srcset="/assets/images/optimized/product_001_medium.avif" type="image/avif">
  <source data-srcset="/assets/images/optimized/product_001_large.webp" type="image/webp" media="(min-width: 768px)">
  <source data-srcset="/assets/images/optimized/product_001_medium.webp" type="image/webp">
  <img 
    src="data:image/svg+xml,..." 
    data-src="/assets/images/optimized/product_001_medium.jpeg"
    alt="Product Name"
    class="lazy-img"
    loading="lazy">
</picture>
```

### 3. Lazy Loading

The lazy loading system automatically initializes when the page loads. Images with the following classes/attributes are automatically handled:

- `.lazy-image` class
- `img[data-src]` attribute

#### Manual Control

```javascript
// Load specific images immediately
window.lazyLoader.loadImageNow('.priority-image');

// Add new images to observation
window.lazyLoader.observe(document.querySelector('.new-image'));
```

## File Structure

```
RGIM.com/
├── config.json                    # Image optimization configuration
├── utils/
│   └── imageOptimizer.js          # Server-side image processing
├── scripts/
│   └── optimizeImages.js          # CLI optimization script
├── assets/
│   ├── css/
│   │   └── lazyLoading.css        # Lazy loading styles
│   ├── js/
│   │   ├── imageUtils.js          # Client-side image utilities
│   │   └── lazyLoader.js          # Lazy loading implementation
│   └── images/
│       ├── products/              # Original images
│       └── optimized/             # Generated optimized images
└── optimization-report.json       # Generated after optimization
```

## Generated Files

For each original image, the system generates:

- **3 sizes**: thumbnail (300x300), medium (600x600), large (1200x1200)
- **3 formats**: AVIF, WebP, JPEG
- **Total**: 9 files per original image

Example for `product_001.png`:
```
assets/images/optimized/
├── product_001_thumbnail.avif
├── product_001_thumbnail.webp
├── product_001_thumbnail.jpeg
├── product_001_medium.avif
├── product_001_medium.webp
├── product_001_medium.jpeg
├── product_001_large.avif
├── product_001_large.webp
└── product_001_large.jpeg
```

## Performance Benefits

- **File Size Reduction**: 60-80% smaller files with AVIF/WebP
- **Faster Loading**: Lazy loading reduces initial page load
- **Better UX**: Progressive loading with placeholders
- **SEO Friendly**: Proper alt tags and structured markup
- **Mobile Optimized**: Responsive images for different screen sizes

## Browser Support

- **Modern Browsers**: Full AVIF/WebP support with lazy loading
- **Older Browsers**: Automatic fallback to JPEG with polyfills
- **No JavaScript**: Images still load (without lazy loading)

## Troubleshooting

### Images Not Loading
1. Check that optimized images exist in `assets/images/optimized/`
2. Verify file paths in HTML match generated files
3. Ensure lazy loading scripts are loaded

### Poor Performance
1. Reduce image quality in config.json
2. Adjust lazy loading threshold
3. Preload critical images

### Build Errors
1. Ensure Sharp is properly installed: `npm install sharp`
2. Check Node.js version (requires 14+)
3. Verify image file permissions

## Commands Reference

```bash
# Optimize all images
npm run optimize-images

# Get help
npm run optimize-images:help

# Start development server
npm run dev

# Start production server
npm start
```

## Future Enhancements

- Automatic optimization on image upload
- CDN integration
- Advanced caching strategies
- Image format detection and serving
- Batch processing improvements

For questions or issues, refer to the main project documentation or contact the development team.