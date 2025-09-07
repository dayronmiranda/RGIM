
TODO
```
rgim-website/
├── public/
│   ├── index.html
│   ├── robots.txt
│   ├── sitemap.xml
│   └── .htaccess
├── src/
│   ├── data/
│   │   ├── config/
│   │   │   └── translations.json
│   │   └── store/
│   │       ├── products.json
│   │       ├── categories.json
│   │       └── destacados.json
│   ├── assets/
│   │   ├── css/
│   │   │   └── input.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   └── modules/
│   │   │       ├── aiSearch.js
│   │   │       ├── cacheManager.js
│   │   │       ├── imageUtils.js
│   │   │       └── lazyLoader.js
│   │   └── images/
│   │       └── products/
├── tools/
│   ├── build.js
│   ├── server.js
│   └── optimize-images.js
├── config/
│   └── config.json
├── dist/ (auto-generated)
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Checklist Final

### Reestructuración
- [x] Crear carpetas: `src/`, `public/`, `tools/`, `config/`
- [x] Crear subcarpetas: `src/data/config/`, `src/data/store/`, `src/assets/images/products/`
- [x] Mover `index.html`, `robots.txt`, `sitemap.xml`, `.htaccess` a `public/`
- [x] Mover `build.js`, `server.js`, `scripts/optimize-images.js` a `tools/`
- [x] Mover `translations.json` a `src/data/config/`
- [x] Mover `products.json`, `categories.json`, `destacados.json` a `src/data/store/`
- [x] Mover `assets/` completo a `src/assets/`

### Configuración
- [ ] Crear `.env` y `.env.example`
- [ ] Mover API key de `config.json` a `.env`
- [ ] Actualizar `config.json` sin secrets y mover a `config/`
- [ ] Actualizar `.gitignore` para incluir `.env`

### CSS
- [ ] Integrar contenido de `mobile.css` en `input.css`
- [ ] Eliminar `mobile.css`
- [ ] Eliminar `styles.css` (auto-generado)
- [ ] Actualizar paths en `tailwind.config.js`

### JavaScript
- [ ] Actualizar rutas en `app.js`:
  - `./src/data/store/products.json`
  - `./src/data/store/categories.json`
  - `./src/data/store/destacados.json`
  - `./src/data/config/translations.json`
  - `./src/assets/images/products/`
- [ ] Actualizar `getImagePath()` función
- [ ] Actualizar imports de módulos JS

### Build System
- [ ] Actualizar `tools/build.js` para nueva estructura
- [ ] Modificar scripts en `package.json`
- [ ] Configurar output a `dist/`
- [ ] Actualizar referencias en `postcss.config.js`

### Assets
- [x] Crear carpeta `src/assets/images/products/`
- [ ] Mover imágenes de productos existentes
- [ ] Actualizar referencias de imágenes en HTML/JS

### Testing
- [ ] Verificar carga de datos JSON
- [ ] Probar funcionamiento de imágenes
- [ ] Validar SPA routing
- [ ] Comprobar responsive design
- [ ] Probar build de producción

### Limpieza
- [ ] Eliminar archivos obsoletos de ubicaciones originales
- [ ] Verificar que no queden referencias rotas
- [ ] Actualizar README con nueva estructura
