const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
  const inputDir = path.join(__dirname, '..', 'assets', 'images', 'products');
  const outputDir = path.join(__dirname, '..', 'assets', 'images', 'optimized');

  // Create output directory if it doesn't exist
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (err) {
    console.error('Error creating output directory:', err);
  }

  try {
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} images to optimize`);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const ext = path.extname(file); // Keep original extension
      const nameWithoutExt = path.basename(file, ext);
      
      // Create thumbnail version (keeping original extension)
      const thumbnailPath = path.join(outputDir, `${nameWithoutExt}-thumbnail${ext}`);
      
      // Create medium version (keeping original extension)
      const mediumPath = path.join(outputDir, `${nameWithoutExt}-medium${ext}`);

      try {
        // Thumbnail: 300x300, optimized but keeping format
        await sharp(inputPath)
          .resize(300, 300, {
            fit: 'cover',
            position: 'center'
          })
          .png({ quality: 85, compressionLevel: 9 }) // For PNG files
          .jpeg({ quality: 85 }) // For JPEG files (sharp will use the right one)
          .toFile(thumbnailPath);

        // Medium: 800x600, optimized but keeping format
        await sharp(inputPath)
          .resize(800, 600, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .png({ quality: 90, compressionLevel: 8 })
          .jpeg({ quality: 90 })
          .toFile(mediumPath);

        console.log(`✓ Optimized: ${file}`);
      } catch (err) {
        console.error(`✗ Error optimizing ${file}:`, err.message);
      }
    }

    // Get directory sizes
    const getDirectorySize = async (dir) => {
      const files = await fs.readdir(dir);
      let totalSize = 0;
      
      for (const file of files) {
        const stats = await fs.stat(path.join(dir, file));
        totalSize += stats.size;
      }
      
      return totalSize;
    };

    const originalSize = await getDirectorySize(inputDir);
    const optimizedSize = await getDirectorySize(outputDir);
    
    console.log('\n📊 Optimization Results:');
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Size reduction: ${((1 - optimizedSize/originalSize) * 100).toFixed(1)}%`);
    
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

// Run the optimization
optimizeImages().then(() => {
  console.log('\n✅ Image optimization complete!');
}).catch(err => {
  console.error('Fatal error:', err);
});