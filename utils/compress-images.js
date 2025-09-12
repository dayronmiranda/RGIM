#!/usr/bin/env node

/**
 * Script para comprimir y redimensionar imágenes a 500x500
 * Uso: node compress-images.js
 * 
 * Este script procesará todas las imágenes en la carpeta assets/images/products
 * y las redimensionará a 500x500 píxeles, sobrescribiendo los archivos originales.
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuración
const CONFIG = {
  imageDir: path.join(__dirname, '..', 'assets', 'images', 'products'),
  targetSize: 500,
  quality: 85, // Calidad de compresión (1-100)
  formats: ['.jpg', '.jpeg', '.png', '.webp'],
  backupDir: path.join(__dirname, '..', 'assets', 'images', 'products-backup')
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Verifica si un archivo es una imagen basándose en su extensión
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return CONFIG.formats.includes(ext);
}

/**
 * Obtiene el tamaño de un archivo en KB
 */
async function getFileSizeKB(filePath) {
  const stats = await fs.stat(filePath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Crea un backup de las imágenes originales
 */
async function createBackup() {
  try {
    // Crear directorio de backup si no existe
    await fs.mkdir(CONFIG.backupDir, { recursive: true });
    
    console.log(`${colors.cyan}📁 Creando backup de imágenes originales...${colors.reset}`);
    
    const files = await fs.readdir(CONFIG.imageDir);
    let backupCount = 0;
    
    for (const file of files) {
      if (isImageFile(file)) {
        const sourcePath = path.join(CONFIG.imageDir, file);
        const backupPath = path.join(CONFIG.backupDir, file);
        
        // Solo hacer backup si no existe ya
        try {
          await fs.access(backupPath);
          console.log(`${colors.yellow}⚠️  Backup ya existe: ${file}${colors.reset}`);
        } catch {
          await fs.copyFile(sourcePath, backupPath);
          backupCount++;
          console.log(`${colors.green}✓ Backup creado: ${file}${colors.reset}`);
        }
      }
    }
    
    console.log(`${colors.bright}${colors.green}✅ Backup completado: ${backupCount} archivos${colors.reset}\n`);
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Error creando backup: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Procesa una imagen individual
 */
async function processImage(filePath, filename) {
  try {
    const startSize = await getFileSizeKB(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // Obtener metadata de la imagen
    const metadata = await sharp(filePath).metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    
    console.log(`${colors.blue}🖼️  Procesando: ${filename}${colors.reset}`);
    console.log(`   Dimensiones originales: ${originalWidth}x${originalHeight}`);
    console.log(`   Tamaño original: ${startSize} KB`);
    console.log(`   Formato: ${ext.substring(1).toUpperCase()}`);
    
    // Configurar sharp según el formato original
    let sharpInstance = sharp(filePath)
      .resize(CONFIG.targetSize, CONFIG.targetSize, {
        fit: 'cover', // 'cover' mantiene el aspect ratio y recorta si es necesario
        position: 'center' // Centra la imagen al recortar
      });
    
    // Aplicar compresión según el formato original
    let processedBuffer;
    
    switch(ext) {
      case '.png':
        processedBuffer = await sharpInstance
          .png({ 
            quality: CONFIG.quality,
            compressionLevel: 9, // Máxima compresión para PNG
            adaptiveFiltering: true,
            palette: true // Usar paleta cuando sea posible para reducir tamaño
          })
          .toBuffer();
        break;
        
      case '.webp':
        processedBuffer = await sharpInstance
          .webp({ 
            quality: CONFIG.quality,
            lossless: false,
            nearLossless: false,
            smartSubsample: true,
            effort: 6 // Mayor esfuerzo = mejor compresión
          })
          .toBuffer();
        break;
        
      case '.jpg':
      case '.jpeg':
        processedBuffer = await sharpInstance
          .jpeg({ 
            quality: CONFIG.quality,
            progressive: true, // JPEG progresivo para mejor carga web
            mozjpeg: true // Usar mozjpeg para mejor compresión
          })
          .toBuffer();
        break;
        
      default:
        // Para otros formatos, convertir a JPEG
        processedBuffer = await sharpInstance
          .jpeg({ 
            quality: CONFIG.quality,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();
        console.log(`   ${colors.yellow}Formato no soportado, convirtiendo a JPEG${colors.reset}`);
    }
    
    // Sobrescribir el archivo original manteniendo la extensión
    await fs.writeFile(filePath, processedBuffer);
    
    const endSize = await getFileSizeKB(filePath);
    const reduction = ((1 - endSize/startSize) * 100).toFixed(1);
    
    console.log(`   Nuevas dimensiones: ${CONFIG.targetSize}x${CONFIG.targetSize}`);
    console.log(`   Nuevo tamaño: ${endSize} KB`);
    
    if (parseFloat(reduction) > 0) {
      console.log(`   ${colors.green}✓ Reducción: ${reduction}%${colors.reset}\n`);
    } else {
      console.log(`   ${colors.yellow}⚠ Sin reducción (imagen ya optimizada)${colors.reset}\n`);
    }
    
    return {
      success: true,
      filename,
      originalSize: parseFloat(startSize),
      newSize: parseFloat(endSize),
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`${colors.red}❌ Error procesando ${filename}: ${error.message}${colors.reset}\n`);
    return {
      success: false,
      filename,
      error: error.message
    };
  }
}

/**
 * Función principal
 */
async function main() {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════╗
║     COMPRESOR DE IMÁGENES - RGIM STORE    ║
╚═══════════════════════════════════════════���╝${colors.reset}\n`);
  
  console.log(`${colors.yellow}Configuración:${colors.reset}`);
  console.log(`• Directorio: ${CONFIG.imageDir}`);
  console.log(`• Tamaño objetivo: ${CONFIG.targetSize}x${CONFIG.targetSize} píxeles`);
  console.log(`• Calidad JPEG: ${CONFIG.quality}%`);
  console.log(`• Formatos soportados: ${CONFIG.formats.join(', ')}\n`);
  
  try {
    // Verificar que el directorio existe
    await fs.access(CONFIG.imageDir);
    
    // Crear backup
    console.log(`${colors.bright}${colors.yellow}⚠️  IMPORTANTE: Se creará un backup de las imágenes originales${colors.reset}`);
    console.log(`${colors.yellow}El backup se guardará en: ${CONFIG.backupDir}${colors.reset}\n`);
    
    const backupCreated = await createBackup();
    if (!backupCreated) {
      console.log(`${colors.red}❌ No se pudo crear el backup. Abortando operación.${colors.reset}`);
      process.exit(1);
    }
    
    // Leer todos los archivos del directorio
    const files = await fs.readdir(CONFIG.imageDir);
    const imageFiles = files.filter(isImageFile);
    
    if (imageFiles.length === 0) {
      console.log(`${colors.yellow}No se encontraron imágenes para procesar.${colors.reset}`);
      return;
    }
    
    console.log(`${colors.bright}${colors.blue}📷 Encontradas ${imageFiles.length} imágenes para procesar${colors.reset}\n`);
    
    // Procesar cada imagen
    const results = [];
    for (const file of imageFiles) {
      const filePath = path.join(CONFIG.imageDir, file);
      const result = await processImage(filePath, file);
      results.push(result);
    }
    
    // Mostrar resumen
    console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════╗
║              RESUMEN DE PROCESO            ║
╚════════════════════════════════════════════╝${colors.reset}\n`);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
      const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
      const totalNew = successful.reduce((sum, r) => sum + r.newSize, 0);
      const avgReduction = successful.reduce((sum, r) => sum + r.reduction, 0) / successful.length;
      
      console.log(`${colors.green}✅ Procesadas exitosamente: ${successful.length} imágenes${colors.reset}`);
      console.log(`📊 Tamaño total original: ${(totalOriginal/1024).toFixed(2)} MB`);
      console.log(`📊 Tamaño total nuevo: ${(totalNew/1024).toFixed(2)} MB`);
      console.log(`📊 Reducción promedio: ${avgReduction.toFixed(1)}%`);
      console.log(`💾 Espacio ahorrado: ${((totalOriginal-totalNew)/1024).toFixed(2)} MB\n`);
    }
    
    if (failed.length > 0) {
      console.log(`${colors.red}❌ Fallaron: ${failed.length} imágenes${colors.reset}`);
      failed.forEach(f => {
        console.log(`   • ${f.filename}: ${f.error}`);
      });
    }
    
    console.log(`${colors.bright}${colors.green}✨ ¡Proceso completado!${colors.reset}`);
    console.log(`${colors.cyan}Las imágenes originales están respaldadas en:${colors.reset}`);
    console.log(`${CONFIG.backupDir}\n`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Error fatal: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Verificar si sharp está instalado
try {
  require.resolve('sharp');
  // Ejecutar el script
  main().catch(console.error);
} catch (e) {
  console.log(`${colors.red}��� La librería 'sharp' no está instalada.${colors.reset}\n`);
  console.log(`${colors.yellow}Para instalarla, ejecuta:${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}npm install sharp${colors.reset}\n`);
  console.log(`${colors.yellow}O si prefieres instalación global:${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}npm install -g sharp${colors.reset}\n`);
  process.exit(1);
}