# 🛍️ MiCatálogo — Catálogo Digital con WhatsApp

Plataforma de ventas digital **100% gratuita**, sin backend propio, optimizada para Facebook Ads y pedidos por WhatsApp.

---

## 🗂️ Estructura del Proyecto

```
/
├─ index.html          → Catálogo principal (público)
├─ producto.html       → Vista individual del producto (público)
├─ login.html          → Login administrador
├─ admin.html          → Panel administrador (protegido)
├─ css/
│  └─ styles.css       → Estilos completos (mobile-first)
├─ js/
│  ├─ supabase.js      → ⚙️ CONFIGURACIÓN (editar aquí)
│  ├─ products.js      → Carga y render de productos
│  ├─ admin.js         → CRUD admin + Cloudinary upload
│  ├─ filters.js       → Filtros, búsqueda, utilidades
│  └─ whatsapp.js      → Generación de mensajes WhatsApp
└─ supabase_setup.sql  → Script SQL para crear tablas y RLS
```

---

## 🚀 GUÍA DE DESPLIEGUE PASO A PASO

### PASO 1 — Crear cuenta en Supabase (gratis)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto (guarda la contraseña del proyecto)
3. Espera a que el proyecto se inicialice (~2 minutos)

### PASO 2 — Configurar la base de datos

1. En el dashboard de Supabase, ve a **SQL Editor → New query**
2. Copia y pega todo el contenido del archivo `supabase_setup.sql`
3. Haz clic en **Run** (▶️)
4. Deberías ver confirmación verde. Verifica en **Table Editor** que existan las tablas `products` y `categories`

### PASO 3 — Crear el usuario administrador

1. En Supabase, ve a **Authentication → Users → Invite user**
2. Ingresa el correo que usarás como admin
3. Recibirás un email para confirmar y establecer contraseña
4. También puedes crear usuario desde: **Authentication → Users → Add user**

### PASO 4 — Obtener credenciales de Supabase

1. Ve a **Settings → API**
2. Copia:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public key** → clave larga que empieza con `eyJ...`

### PASO 5 — Crear cuenta en Cloudinary (gratis)

1. Ve a [cloudinary.com](https://cloudinary.com) y crea una cuenta gratuita
2. En el Dashboard, copia tu **Cloud Name**
3. Ve a **Settings → Upload → Upload presets**
4. Haz clic en **Add upload preset**
   - Signing Mode: **Unsigned**
   - Folder: `catalogo` (opcional)
   - Guarda y copia el nombre del preset

### PASO 6 — Configurar el proyecto

Abre el archivo `js/supabase.js` y reemplaza los valores:

```javascript
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';  // ← Tu URL de Supabase
const SUPABASE_ANON_KEY = 'eyJ...TU_ANON_KEY';           // ← Tu clave anon

const CLOUDINARY_CLOUD_NAME = 'mi-cloud';                 // ← Tu cloud name
const CLOUDINARY_UPLOAD_PRESET = 'catalogo_preset';       // ← Tu upload preset

const WHATSAPP_NUMBER = '573001234567';                   // ← Tu número (sin + ni espacios)
                                                          //   Colombia: 57 + 10 dígitos
```

### PASO 7 — Personalizar el catálogo

En `js/supabase.js`, personaliza:

```javascript
const SITE_CONFIG = {
  name: 'MiCatálogo',        // ← Nombre de tu tienda
  tagline: 'Los mejores...',  // ← Slogan
  currency: '$',              // ← Símbolo de moneda
  currencyCode: 'COP',        // ← Código de moneda (para Facebook Pixel)
};
```

También actualiza en `index.html` y `producto.html`:
- `<title>` de las páginas
- Textos del hero
- `TU_PIXEL_ID` con tu ID de Facebook Pixel (si tienes)

### PASO 8 — Subir a Vercel o Netlify (gratis)

#### Opción A: Netlify (más fácil)
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. En el dashboard, arrastra la carpeta del proyecto al área de drop
3. ¡Listo! Te dará una URL pública en segundos
4. Puedes conectar un dominio personalizado gratis desde Settings → Domain management

#### Opción B: Vercel
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Instala la CLI: `npm i -g vercel`
3. Dentro de la carpeta del proyecto: `vercel`
4. Sigue los pasos del asistente

#### Opción C: GitHub Pages
1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings → Pages → Branch: main / (root)
3. En minutos tendrás URL pública

---

## 📲 USAR EL PANEL ADMINISTRADOR

1. Ve a `tu-dominio.com/login.html`
2. Ingresa con el email y contraseña del admin que creaste en Supabase
3. Desde el panel puedes:
   - ➕ Crear, ✏️ editar, 🗑️ eliminar productos
   - Subir imágenes (se guardan en Cloudinary automáticamente)
   - Gestionar categorías
   - Ver estadísticas

---

## 💰 COSTOS (TODO GRATIS)

| Servicio | Plan gratuito |
|----------|---------------|
| Supabase | 500 MB DB, 1 GB Storage, 50K usuarios auth |
| Cloudinary | 25 GB storage, 25 GB bandwidth/mes |
| Vercel | Hosting ilimitado, SSL gratis |
| Netlify | 100 GB bandwidth/mes, SSL gratis |

---

## 🔒 SEGURIDAD

- Login protegido con Supabase Auth (JWT)
- Panel admin no indexado por buscadores (`noindex`)
- Row Level Security activo: solo usuarios autenticados pueden modificar datos
- Lectura pública solo para productos y categorías

---

## 📈 FACEBOOK ADS

El proyecto incluye el código base del Facebook Pixel. Para activarlo:

1. Ve a [Meta Business Suite](https://business.facebook.com) → Events Manager → Create Pixel
2. Copia tu Pixel ID (número de 15-16 dígitos)
3. Reemplaza `TU_PIXEL_ID` en `index.html` y `producto.html`
4. En `producto.html` ya está configurado el evento `ViewContent` automático
5. Para rastrear conversiones (pedidos WhatsApp), agrega en `whatsapp.js`:
   ```javascript
   fbq('track', 'Contact', { content_name: product.name, value: product.price, currency: 'COP' });
   ```

---

## 🛠️ PERSONALIZACIÓN AVANZADA

### Agregar múltiples imágenes por producto
En la tabla `products`, agrega una columna `images text[]` (array de URLs) y actualiza `producto.html` para mostrar múltiples thumbs.

### Soporte de variantes (tallas, colores)
Crea una tabla `variants` con `product_id`, `name`, `value` y muéstralas como selects en `producto.html`.

### Integrar carrito antes de WhatsApp
Guarda los productos en `localStorage` y genera un mensaje con múltiples productos al contactar por WhatsApp.

---

## ❓ SOLUCIÓN DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| Página en blanco | Abre la consola del navegador (F12) y revisa errores |
| No cargan productos | Verifica las credenciales de Supabase en `js/supabase.js` |
| Error al subir imagen | Verifica el upload preset de Cloudinary (debe ser **unsigned**) |
| No puedo hacer login | Verifica que el usuario esté confirmado en Supabase Auth |
| CORS error | Verifica que la URL de tu proyecto esté correcta (con `https://`) |

---

Desarrollado con HTML, CSS y JavaScript puro · Supabase · Cloudinary · Vercel/Netlify
