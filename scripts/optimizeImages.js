#!/usr/bin/env node

const ImageOptimizer = require('../utils/imageOptimizer');
const path = require('path');
const fs = require('fs').promises;

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  const optimizer = new ImageOptimizer();
  const productsDir = path.join(__dirname, '../assets/images/products');
  
  try {
    // Check if products directory exists
    await fs.access(productsDir);
    
    console.log(`📁 Processing images in: ${productsDir}`);
    console.log('⏳ This may take a few minutes...\n');
    
    const results = await optimizer.optimizeDirectory(productsDir);
    
    console.log('\n✅ Optimization complete!');
    console.log(`📊 Processed ${results.length} images`);
    
    // Generate a summary report
    const report = {
      timestamp: new Date().toISOString(),
      totalImages: results.length,
      optimizedSizes: Object.keys(optimizer.config.sizes),
      formats: Object.keys(optimizer.config.formats),
      results: results
    };
    
    const reportPath = path.join(__dirname, '../optimization-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 Report saved to: ${reportPath}`);
    
    // Display some statistics
    console.log('\n📈 Summary:');
    console.log(`   • Sizes generated: ${Object.keys(optimizer.config.sizes).join(', ')}`);
    console.log(`   • Formats: ${Object.keys(optimizer.config.formats).join(', ')}`);
    console.log(`   • Total files created: ${results.length * Object.keys(optimizer.config.sizes).length * Object.keys(optimizer.config.formats).length}`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Products directory not found:', productsDir);
      console.log('💡 Make sure you have images in the assets/images/products directory');
    } else {
      console.error('❌ Error during optimization:', error.message);
    }
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Image Optimization Script

Usage: node scripts/optimizeImages.js [options]

Options:
  --help, -h    Show this help message

This script will:
1. Process all images in assets/images/products/
2. Generate optimized versions in multiple sizes and formats
3. Create a detailed report of the optimization process

Supported formats: JPEG, WebP, AVIF
Generated sizes: thumbnail (300x300), medium (600x600), large (1200x1200)
`);
  process.exit(0);
}

main().catch(console.error);