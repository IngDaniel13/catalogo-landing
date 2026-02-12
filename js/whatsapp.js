// ===== WHATSAPP.JS =====
// Construcción dinámica de mensajes y URLs de WhatsApp

import { WHATSAPP_NUMBER, SITE_CONFIG } from './supabase.js';

/**
 * Construye el mensaje precargado de WhatsApp para un producto
 * @param {Object} product - Objeto del producto desde Supabase
 * @returns {string} URL completa de WhatsApp con mensaje URL-encoded
 */
export function buildWhatsAppURL(product) {
  const productURL = `${window.location.origin}/producto.html?id=${product.id}`;
  const message = buildMessage(product, productURL);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Construye el texto del mensaje
 */
export function buildMessage(product, productURL) {
  return `Hola, estoy interesado en este producto:

🛍️ Producto: ${product.name}
💰 Precio: ${SITE_CONFIG.currency}${formatPrice(product.price)}
📦 Categoría: ${product.category}
🔗 Link del producto:
${productURL}

¿Me brindas más información?`;
}

/**
 * Formatear precio (copia local para evitar dependencia circular)
 */
function formatPrice(price) {
  return Number(price).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * Abrir WhatsApp directamente (para el botón flotante en producto.html)
 */
export function openWhatsApp(product) {
  const url = buildWhatsAppURL(product);
  window.open(url, '_blank', 'noopener,noreferrer');
}
