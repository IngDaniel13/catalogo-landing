// ===== FILTERS.JS =====
// Lógica de filtros, búsqueda y formateo de precios

import { supabaseClient, SITE_CONFIG } from './supabase.js';

// ── Cargar categorías desde Supabase
export async function loadCategories() {
  const { data, error } = await supabaseClient
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

// ── Renderizar chips de categorías
export function renderCategoryChips(container, categories, activeCategory, onSelect) {
  const all = `<button class="filter-chip ${!activeCategory || activeCategory === 'all' ? 'active' : ''}" data-cat="all">
    Todos
  </button>`;
  const chips = categories.map(cat => `
    <button class="filter-chip ${activeCategory === cat.name ? 'active' : ''}" data-cat="${cat.name}">
      ${cat.name}
    </button>`).join('');
  container.innerHTML = all + chips;
  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      onSelect(chip.dataset.cat);
    });
  });
}

// ── Formatear precio con separadores de miles
export function formatPrice(price) {
  if (price == null) return '0';
  return Number(price).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ── Debounce para el buscador
export function debounce(fn, ms = 350) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// ── Leer parámetro de URL
export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ── Actualizar URL sin recargar
export function updateURL(params) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, val]) => {
    if (val && val !== 'all' && val !== '') {
      url.searchParams.set(key, val);
    } else {
      url.searchParams.delete(key);
    }
  });
  history.replaceState({}, '', url);
}

// ── Parsear precio de input
export function parsePrice(val) {
  const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? null : n;
}
