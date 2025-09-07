# 🖼️ Compresor de Imágenes para RGIM Store

Este script automatiza la compresión y redimensionamiento de todas las imágenes de productos a un tamaño uniforme de 500x500 píxeles.

## 📋 Características

- ✅ Redimensiona todas las imágenes a 500x500 píxeles
- ✅ Comprime las imágenes manteniendo buena calidad (85%)
- ✅ Crea backup automático de las imágenes originales
- ✅ Convierte todos los formatos a JPG optimizado
- ✅ Muestra estadísticas de compresión y ahorro de espacio
- ✅ Procesamiento en lote de múltiples imágenes

## 🚀 Instalación

### Paso 1: Instalar Node.js
Si no tienes Node.js instalado, descárgalo desde [nodejs.org](https://nodejs.org/)

### Paso 2: Instalar dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install sharp
```

## 💻 Uso

### Opción 1: Ejecutar directamente
```bash
node compress-images.js
```

### Opción 2: Usar npm script
```bash
npm run compress-images
```

## 📁 Estructura de Archivos

```
StoreHybrid/
├── assets/
│   └── images/
│       ├── products/           # Imágenes originales
│       └── products-backup/    # Backup automático
└── compress-images.js          # Script de compresión
```

## ⚙️ Configuración

Puedes modificar estos parámetros en el archivo `compress-images.js`:

```javascript
const CONFIG = {
  targetSize: 500,    // Tamaño en píxeles (500x500)
  quality: 85,        // Calidad JPEG (1-100)
  formats: ['.jpg', '.jpeg', '.png', '.webp']  // Formatos soportados
};
```

## 🔄 Proceso

1. **Backup**: El script crea automáticamente una copia de seguridad de todas las imágenes originales en `assets/images/products-backup/`

2. **Redimensionamiento**: Cada imagen se redimensiona a 500x500 píxeles manteniendo el mejor encuadre posible

3. **Compresión**: Las imágenes se comprimen con calidad 85% (buen balance entre calidad y tamaño)

4. **Conversión**: Todos los formatos se convierten a JPG progresivo para mejor rendimiento web

5. **Sobrescritura**: Las imágenes procesadas reemplazan a las originales

## 📊 Ejemplo de Salida

```
╔════════════════════════════════════════��═══╗
║     COMPRESOR DE IMÁGENES - RGIM STORE    ║
╚════════════════════════════════════════════╝

📁 Creando backup de imágenes originales...
✓ Backup creado: product1.png
✓ Backup creado: product2.jpg

🖼️  Procesando: product1.png
   Dimensiones originales: 1200x1200
   Tamaño original: 450.23 KB
   Nuevas dimensiones: 500x500
   Nuevo tamaño: 45.67 KB
   ✓ Reducción: 89.9%

╔════════════════════════════════════════════╗
║              RESUMEN DE PROCESO            ║
╚════════════════════════════════════════════╝

✅ Procesadas exitosamente: 25 imágenes
📊 Tamaño total original: 12.45 MB
📊 Tamaño total nuevo: 2.34 MB
📊 Reducción promedio: 81.2%
💾 Espacio ahorrado: 10.11 MB
```

## ⚠️ Advertencias

- **IMPORTANTE**: Este script sobrescribe las imágenes originales. Siempre se crea un backup automático, pero verifica que el backup se haya creado correctamente antes de continuar.

- Las imágenes en `products-backup/` NO se procesan, solo las de `products/`

- Si ejecutas el script múltiples veces, no sobrescribirá los backups existentes

## 🔧 Solución de Problemas

### Error: "La librería 'sharp' no está instalada"
```bash
npm install sharp
```

### Error: "No se encontraron imágenes para procesar"
Verifica que las imágenes estén en: `assets/images/products/`

### Error en Windows con sharp
Si tienes problemas en Windows, intenta:
```bash
npm install sharp --platform=win32
```

## 🎯 Beneficios

- **Rendimiento Web**: Imágenes más pequeñas = carga más rápida
- **Uniformidad**: Todas las imágenes con el mismo tamaño
- **SEO**: Mejor puntuación en Core Web Vitals
- **Ahorro de Ancho de Banda**: Menor consumo de datos para usuarios móviles
- **Experiencia de Usuario**: Carga más fluida de la tienda

## 📝 Notas

- El tamaño de 500x500 es ideal para e-commerce
- La calidad 85% es imperceptible visualmente pero reduce significativamente el tamaño
- El formato JPG progresivo mejora la percepción de velocidad de carga
- El script mantiene la mejor parte de la imagen al recortar (centro)

## 🤝 Soporte

Si encuentras algún problema o necesitas ayuda, revisa:
1. Que Node.js esté instalado correctamente
2. Que la librería sharp esté instalada
3. Que las rutas de las carpetas sean correctas
4. Los permisos de escritura en las carpetas