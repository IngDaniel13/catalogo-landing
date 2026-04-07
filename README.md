# SHOPDE — Catálogo Digital con WhatsApp

Plataforma de ventas digital **100% gratuita**, optimizada para Facebook Ads y pedidos por WhatsApp.

---

## Estructura del Proyecto

```
/
├─ index.html          → Catálogo principal
├─ producto.html       → Vista individual del producto 
├─ login.html          → Login administrador
├─ admin.html          → Panel administrador (protegido)
├─ css/
│  └─ styles.css       → Estilos completos (mobile-first)
├─ js/
│  ├─ supabase.js      → CONFIGURACIÓN 
│  ├─ products.js      → Carga y render de productos
│  ├─ admin.js         → CRUD admin + Cloudinary upload
│  ├─ filters.js       → Filtros, búsqueda, utilidades
│  └─ whatsapp.js      → Generación de mensajes WhatsApp
└─ supabase_setup.sql  → Script SQL para crear tablas y RLS
```

---

## Herramientas y tecnologías usadas para el proyecto

El proyecto fue desarrollado con:
· HTML, CSS y JavaScript puro 
· Supabase 
· Cloudinary 
· Vercel/Netlify

## Descripción

Landing page o página web sencilla para mostrar un catalogo digital de productos, con diseño simple y responsive para facilitar su vista en cualquier tipo de dispositivos 

## Demo de la pagina

https://shopde-catalogo.netlify.app/

- Para ver la imagen manten  (ctrl+click)
![alt text](image-1.png)

# USO

El usuario puede navegar entre categorias y buscar algun producto de su interes, una vez se decida por un producto, presiona el boton verde con la descripcion pedir y eso lo redirigirá al chat de whatsapp del vendedor con una descripcion del producto y que sirve para que el vendedor sepa especificamente cual es el producto de interes. Cuenta con apartado para buscar productos especificos, filtrar por categoria y por precio.

En la parte superior derecha tiene un boton (admin) que despliega una ventana para ingresar al panel administrativo que permitira editar los productos que se muestran en la pagina, este panel usa autenticación de credenciales mediante el mismo supabase

- ![alt text](image.png)
