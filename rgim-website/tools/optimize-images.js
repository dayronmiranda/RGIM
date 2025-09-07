#!/usr/bin/env node

/**
 * RGIM Image Optimization Script
 * Processes and optimizes product images using Sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🖼️  RGIM Image Optimization Starting...\n');

// Configuration
const config = {
  inputDir: path.join(__dirname, '..', 'src', 'assets', 'images', 'products'),
  outputDir: path.join(__dirname, '..', 'src', 'assets', 'images', 'optimized'),
  sizes: {
    thumbnail: { width: 300, height: 300, quality: 80 },
    medium: { width: 800, height: 600, quality: 85 }
  },
  formats: ['jpg'], // Only JPG as specified
  skipExisting: true
};

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Get all image files
function getImageFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Input directory not found: ${dir}`);
    console.log('   Creating sample structure...');
    ensureDirectoryExists(dir);
    return [];
  }

  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
}

// Optimize single image
async function optimizeImage(inputPath, outputPath, size, quality) {
  try {
    await sharp(inputPath)
      .resize(size.width, size.height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: quality,
        progressive: true,
        mozjpeg: true 
      })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const reduction = Math.round((1 - outputStats.size / inputStats.size) * 100);
    
    return {
      success: true,
      originalSize: inputStats.size,
      optimizedSize: outputStats.size,
      reduction: reduction
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Main optimization process
async function optimizeImages() {
  // Ensure output directory exists
  ensureDirectoryExists(config.outputDir);
  
  // Get input images
  const imageFiles = getImageFiles(config.inputDir);
  
  if (imageFiles.length === 0) {
    console.log('📝 No images found to optimize.');
    console.log('   Place your product images in: assets/images/products/');
    console.log('   Supported formats: JPG, PNG, WebP');
    return;
  }

  console.log(`📸 Found ${imageFiles.length} images to process\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let processedCount = 0;
  let skippedCount = 0;

  // Process each image
  for (const filename of imageFiles) {
    const inputPath = path.join(config.inputDir, filename);
    const baseName = path.parse(filename).name;
    
    console.log(`🔄 Processing: ${filename}`);

    // Generate different sizes
    for (const [sizeName, sizeConfig] of Object.entries(config.sizes)) {
      const outputFilename = `${baseName}-${sizeName}.jpg`;
      const outputPath = path.join(config.outputDir, outputFilename);

      // Skip if file exists and skipExisting is true
      if (config.skipExisting && fs.existsSync(outputPath)) {
        console.log(`   ⏭️  Skipping ${sizeName} (already exists)`);
        skippedCount++;
        continue;
      }

      // Optimize image
      const result = await optimizeImage(
        inputPath, 
        outputPath, 
        sizeConfig, 
        sizeConfig.quality
      );

      if (result.success) {
        totalOriginalSize += result.originalSize;
        totalOptimizedSize += result.optimizedSize;
        processedCount++;
        
        console.log(`   ✅ ${sizeName}: ${Math.round(result.originalSize/1024)}KB → ${Math.round(result.optimizedSize/1024)}KB (${result.reduction}% reduction)`);
      } else {
        console.log(`   ❌ ${sizeName}: Failed - ${result.error}`);
      }
    }
    
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('📊 Optimization Summary:');
  console.log(`   Images processed: ${Math.floor(processedCount/2)} (${processedCount} variants)`);
  console.log(`   Images skipped: ${skippedCount}`);
  
  if (totalOriginalSize > 0) {
    const totalReduction = Math.round((1 - totalOptimizedSize / totalOriginalSize) * 100);
    console.log(`   Total size reduction: ${Math.round(totalOriginalSize/1024)}KB → ${Math.round(totalOptimizedSize/1024)}KB (${totalReduction}%)`);
  }
  
  console.log('\n✨ Image optimization completed!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Update your HTML/CSS to use optimized images');
  console.log('   2. Implement lazy loading for better performance');
  console.log('   3. Consider using WebP format for modern browsers');
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run optimization
optimizeImages().catch(error => {
  console.error('❌ Image optimization failed:', error);
  process.exit(1);
});