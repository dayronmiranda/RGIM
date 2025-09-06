# Imágenes locales de productos

Coloca aquí las imágenes de los productos que quieras servir localmente.

- Rutas válidas: JPG, PNG, WEBP, SVG
- Usa SIEMPRE barras normales `/` (no backslashes `\`) en las rutas
- Referencia estas imágenes desde `products.json` con una ruta relativa como `./assets/images/products/archivo.png`

## Ejemplo de entrada en `products.json`

```json
{
  "id": "p100",
  "name": "Bebida de ejemplo local",
  "short": "Descripción corta",
  "description": "Descripción larga del producto",
  "price": 1.99,
  "categoryId": "beverages",
  "image": "./assets/images/products/ejemplo-bebida.png"
}
```

Coloca el archivo de imagen en este directorio con el nombre `ejemplo-bebida.png` y el sistema lo cargará correctamente.

## Notas
- La app usa rutas relativas desde `index.html`, por lo que `./assets/images/products/archivo.ext` funcionará tanto en desarrollo como en producción si se mantiene la misma estructura de carpetas.
- Si ya tienes productos existentes, puedes cambiar el campo `image` de ese producto para apuntar a una imagen local, por ejemplo:

```json
"image": "./assets/images/products/p1.png"
```

- Recomendado optimizar imágenes (peso y dimensiones) para mejorar rendimiento. Para productos, una resolución entre 600–1000 px del lado mayor suele ser suficiente.
