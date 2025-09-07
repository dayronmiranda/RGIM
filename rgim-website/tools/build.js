#!/usr/bin/env node

/**
 * RGIM Website Build Script
 * Automates the build process for production deployment
 * Updated for new project structure
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get project root (parent directory of tools)
const projectRoot = path.dirname(__dirname);
const distDir = path.join(projectRoot, 'dist');

console.log('🚀 RGIM Website Build Process Starting...\n');
console.log(`📁 Project root: ${projectRoot}`);
console.log(`📁 Output directory: ${distDir}\n`);

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Created dist directory\n');
}

// Build steps
const buildSteps = [
  {
    name: 'Installing Dependencies',
    command: 'npm install',
    description: 'Installing required npm packages',
    cwd: projectRoot
  },
  {
    name: 'Building Tailwind CSS',
    command: 'npm run build-css-prod',
    description: 'Compiling and minifying Tailwind CSS',
    cwd: projectRoot
  },
  {
    name: 'Copying Public Files',
    command: 'node tools/copy-files.js',
    description: 'Copying public files to dist directory',
    cwd: projectRoot
  },
  {
    name: 'Optimizing Images',
    command: 'npm run optimize-images',
    description: 'Processing and optimizing product images',
    optional: true,
    cwd: projectRoot
  }
];

// Execute build steps
buildSteps.forEach((step, index) => {
  console.log(`📦 Step ${index + 1}: ${step.name}`);
  console.log(`   ${step.description}`);
  
  try {
    execSync(step.command, { 
      stdio: 'inherit',
      cwd: step.cwd || projectRoot
    });
    console.log(`✅ ${step.name} completed successfully\n`);
  } catch (error) {
    if (step.optional) {
      console.log(`⚠️  ${step.name} failed (optional step, continuing...)\n`);
    } else {
      console.error(`❌ ${step.name} failed:`, error.message);
      process.exit(1);
    }
  }
});

// Verify build output
console.log('🔍 Verifying build output...');

const requiredFiles = [
  'dist/index.html',
  'dist/src/assets/css/styles.css',
  'dist/src/data/store/products.json',
  'dist/src/data/store/categories.json',
  'dist/src/data/config/translations.json',
  'dist/src/data/config/config.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 Build completed successfully!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Upload dist/ folder contents to your web server');
  console.log('   2. Ensure .htaccess is properly configured');
  console.log('   3. Test the website functionality');
  console.log('   4. Monitor performance and cache statistics');
  
  console.log('\n🌐 Development Server:');
  console.log('   Run: npm run serve');
  console.log('   URL: http://localhost:8000');
  
} else {
  console.log('\n❌ Build failed - Some required files are missing');
  process.exit(1);
}

console.log('\n🚀 RGIM Website is ready for production deployment!');