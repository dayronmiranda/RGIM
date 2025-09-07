#!/usr/bin/env node

/**
 * Copy Files Script
 * Copies all necessary files from the new structure to dist directory
 */

const fs = require('fs');
const path = require('path');

// Get project root (parent directory of tools)
const projectRoot = path.dirname(__dirname);
const distDir = path.join(projectRoot, 'dist');

console.log('📁 Copying files to dist directory...\n');

// Utility function to copy files recursively
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Copy all files in directory
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    // Copy file
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied: ${path.relative(projectRoot, src)} → ${path.relative(projectRoot, dest)}`);
  }
}

// Files and directories to copy
const copyTasks = [
  // Public files (HTML, robots.txt, etc.)
  {
    src: path.join(projectRoot, 'public'),
    dest: distDir,
    description: 'Public files (HTML, robots.txt, sitemap.xml, .htaccess)'
  },
  // Source files
  {
    src: path.join(projectRoot, 'src'),
    dest: path.join(distDir, 'src'),
    description: 'Source files (assets, data)'
  },
  // Config files
  {
    src: path.join(projectRoot, 'config'),
    dest: path.join(distDir, 'config'),
    description: 'Configuration files'
  },
  // Environment example file
  {
    src: path.join(projectRoot, '.env.example'),
    dest: path.join(distDir, '.env.example'),
    description: 'Environment example file'
  }
];

// Execute copy tasks
copyTasks.forEach((task, index) => {
  console.log(`📦 Task ${index + 1}: ${task.description}`);
  
  try {
    if (fs.existsSync(task.src)) {
      copyRecursive(task.src, task.dest);
      console.log(`✅ ${task.description} copied successfully\n`);
    } else {
      console.log(`⚠️  Source not found: ${task.src}\n`);
    }
  } catch (error) {
    console.error(`❌ Failed to copy ${task.description}:`, error.message);
    process.exit(1);
  }
});

console.log('🎉 All files copied successfully to dist directory!');