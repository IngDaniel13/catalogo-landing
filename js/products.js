// ===== PRODUCTS.JS =====
// Carga y renderiza productos desde Supabase en el catálogo

import { supabaseClient, SITE_CONFIG } from './supabase.js';
import { formatPrice } from './filters.js';
import { buildWhatsAppURL } from './whatsapp.js';

// ── Render skeleton de carga
export function renderSkeletons(container, count = 8) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-line w-80"></div>
          <div class="skeleton skeleton-line w-50"></div>
          <div class="skeleton skeleton-line w-30"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
            <div class="skeleton skeleton-btn"></div>
            <div class="skeleton skeleton-btn"></div>
          </div>
        </div>
      </div>`;
  }
}

// ── Construir tarjeta de producto
export function buildProductCard(product) {
  const whatsappURL = buildWhatsAppURL(product);
  return `
    <article class="product-card" data-id="${product.id}">
      <a href="producto.html?id=${product.id}" class="card-image-wrap">
        <img
          src="${product.image_url}"
          alt="${escapeHtml(product.name)}"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x300/f0f0f0/999?text=Sin+imagen'"
        />
        <span class="card-category-badge">${escapeHtml(product.category)}</span>
      </a>
      <div class="card-body">
        <h3 class="card-name">${escapeHtml(product.name)}</h3>
        <div class="card-price">
          <span>${SITE_CONFIG.currency}</span>${formatPrice(product.price)}
        </div>
        <div class="card-actions">
          <a href="producto.html?id=${product.id}" class="btn btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver producto
          </a>
          <a href="${whatsappURL}" target="_blank" rel="noopener" class="btn btn-whatsapp">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Pedir
          </a>
        </div>
      </div>
    </article>`;
}

// ── Cargar todos los productos
export async function loadProducts({ category = null, search = null, minPrice = null, maxPrice = null } = {}) {
  let query = supabaseClient
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') query = query.eq('category', category);
  if (search) query = query.ilike('name', `%${search}%`);
  if (minPrice !== null) query = query.gte('price', minPrice);
  if (maxPrice !== null) query = query.lte('price', maxPrice);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ── Cargar producto individual por ID
export async function loadProduct(id) {
  const { data, error } = await supabaseClient
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// ── Mostrar estado vacío
export function renderEmpty(container, message = 'No se encontraron productos') {
  container.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon">📦</span>
      <h3>${message}</h3>
      <p class="text-gray">Intenta ajustando los filtros de búsqueda.</p>
    </div>`;
}

// ── Escape de HTML para prevenir XSS
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
