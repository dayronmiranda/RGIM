# RGIM Store - Tienda Online

Una tienda online moderna y responsiva para RGIM (USA & Panamá) especializada en compras internacionales y envíos a Latinoamérica.

## 🚀 Características Principales

### 🛒 Funcionalidades de Tienda
- **Catálogo de productos** con imágenes optimizadas
- **Búsqueda inteligente** con IA (Gemini)
- **Carrito de compras** persistente
- **Sistema de pedidos** por WhatsApp
- **Validación automática** de imágenes de productos
- **Diseño responsive** optimizado para móviles

### 📊 Analytics y Administración
- **Sistema de analytics** para visitantes
- **Dashboard administrativo** completo
- **Estadísticas de visitantes** por país y dispositivo
- **Gestión de pedidos** y exportación CSV
- **Panel de control** con métricas en tiempo real

### 🤖 Inteligencia Artificial
- **Búsqueda con Gemini AI** para resultados más precisos
- **Comprensión contextual** de consultas de usuarios
- **Sistema de fallback** cuando la IA no está disponible
- **Optimización automática** de resultados

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd StoreHybrid
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Key de Gemini AI (opcional, mejora la búsqueda)
GEMINI_API_KEY=tu_api_key_de_gemini_aqui

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

### 4. Obtener API Key de Gemini (Opcional pero recomendado)

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key al archivo `.env`
4. Reinicia el servidor

**Nota:** Si no configuras la API key, el sistema usará búsqueda tradicional como fallback.

### 5. Iniciar el servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### 6. Acceder a la aplicación
- **Tienda:** `http://localhost:3000`
- **Admin:** `http://localhost:3000/#/admin` (usuario: admin, contraseña: admin123)

## 📋 Configuración de Gemini AI

### ¿Por qué usar Gemini?
- **Búsqueda más inteligente:** Comprende el contexto y sinónimos
- **Resultados más relevantes:** Considera intención del usuario
- **Mejor experiencia:** Respuestas más precisas y útiles

### Cómo configurar:

1. **Crear cuenta en Google AI:**
   - Ve a https://makersuite.google.com/app/apikey
   - Inicia sesión con tu cuenta Google

2. **Generar API Key:**
   - Haz clic en "Create API Key"
   - Copia la key generada

3. **Configurar en el proyecto:**
   ```env
   GEMINI_API_KEY=AIzaSyD...tu_api_key_completa
   ```

4. **Verificar funcionamiento:**
   - El sistema detectará automáticamente si Gemini está disponible
   - Si hay problemas, usará búsqueda tradicional
   - Revisa la consola del navegador para logs de debug

### Configuración alternativa (sin .env):

Si no puedes usar variables de entorno, configura la API key directamente en el navegador:

#### Opción 1: Configuración manual
1. Abre la consola del navegador (F12 → Console)
2. Ejecuta este comando:
```javascript
window.GEMINI_API_KEY = 'tu_api_key_de_gemini_aqui';
```
3. La aplicación detectará automáticamente la API key y activará la búsqueda con IA.
4. **Nota:** Esta configuración es temporal y se perderá al recargar la página.

#### Opción 2: Script de configuración rápida
1. Copia y pega el contenido del archivo `setup-gemini.js` en la consola
2. El script te guiará paso a paso para configurar la API key
3. Incluye verificación automática y mensajes de ayuda

## 📊 Sistema de Analytics

### ¿Qué datos se recopilan?
- **Visitas por página** y tiempo de navegación
- **Información geográfica** (país, ciudad)
- **Dispositivos utilizados** (mobile, desktop, tablet)
- **Navegadores y sistemas operativos**
- **Comportamiento de usuarios**

### Privacidad y cumplimiento:
- ✅ **Anonimizado:** No se recopilan datos personales
- ✅ **Local storage:** Datos se almacenan localmente
- ✅ **Configurable:** Se puede desactivar fácilmente
- ✅ **Transparente:** El usuario sabe qué datos se recopilan

### Ver estadísticas:
1. Accede al panel de administración
2. Las estadísticas aparecen automáticamente en el dashboard
3. Incluye métricas de visitantes, países y dispositivos

## 🎨 Características de UI/UX

### Diseño Responsive
- **Mobile-first approach** con optimizaciones específicas
- **iPhone 11-16 support** con safe areas y mejoras visuales
- **Layout adaptativo** que funciona en todos los dispositivos

### Experiencia de Usuario
- **Navegación intuitiva** sin menús complejos en mobile
- **Carrito inmersivo** que ocupa toda la pantalla
- **Búsqueda inteligente** con resultados contextuales
- **Feedback visual** en todas las interacciones

## 📁 Estructura del Proyecto

```
StoreHybrid/
├── assets/
│   ├── images/
│   │   └── products/          # Imágenes de productos
│   └── styles/
│       ├── mobile-improvements.css  # Optimizaciones mobile
│       └── style.css               # Estilos principales
├── config/
│   └── app.js                      # Configuración general
├── pages/
│   ├── home.js                     # Página principal
│   ├── store.js                    # Página de tienda
│   ├── admin.js                    # Panel de administración
│   └── ...
├── utils/
│   ├── analytics.js                # Sistema de analytics
│   ├── aiSearch.js                 # Búsqueda con IA
│   ├── cart.js                     # Gestión del carrito
│   ├── imageValidator.js           # Validación de imágenes
│   ├── lazyload.js                 # Carga diferida
│   └── products.js                 # Renderizado de productos
├── index.html                      # HTML principal
├── index.js                        # JavaScript principal
├── server.js                       # Servidor backend
└── package.json                    # Dependencias
```

## 🔧 Tecnologías Utilizadas

- **Frontend:** Vanilla JavaScript, Tailwind CSS
- **Backend:** Node.js con Express
- **IA:** Google Gemini AI (opcional)
- **Analytics:** Sistema personalizado
- **Storage:** LocalStorage + JSON files
- **Responsive:** Mobile-first design

## 🚀 Despliegue

### Variables de entorno para producción:
```env
NODE_ENV=production
GEMINI_API_KEY=tu_api_key_produccion
PORT=3000
```

### Comandos de despliegue:
```bash
# Build para producción
npm run build

# Iniciar en modo producción
npm start
```

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email:** info@rgimusa.com
- **WhatsApp:** +1 305 846 2224
- **Ubicación:** Miami, FL & Ciudad de Panamá

## 📝 Notas de Desarrollo

### Sistema de Analytics:
- Los datos se almacenan localmente en el navegador
- No requiere backend adicional
- Se puede exportar e importar fácilmente
- Configurable para diferentes niveles de detalle

### Búsqueda con IA:
- Funciona sin API key (fallback automático)
- Mejora significativamente la experiencia de búsqueda
- Context-aware y entiende sinónimos
- Fácil de integrar con otros proveedores de IA

### Optimizaciones Mobile:
- Safe areas para iPhone con notch
- Prevención de zoom automático
- Touch targets optimizados
- Performance mejorada en dispositivos móviles

---

**RGIM Store** - Conectando mercados globales con Latinoamérica 🇺🇸🇵🇦