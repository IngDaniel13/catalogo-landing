// ===== ADMIN.JS =====
// Lógica del panel administrador: CRUD productos, categorías, Cloudinary upload

import { supabaseClient, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './supabase.js';
import { formatPrice } from './filters.js';

// ──────────────────────────────────────────
// AUTH GUARD — redirige si no está autenticado
// ──────────────────────────────────────────
export async function requireAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// ──────────────────────────────────────────
// STATS
// ──────────────────────────────────────────
export async function loadStats() {
  const [{ count: totalProducts }, { count: totalCats }] = await Promise.all([
    supabaseClient.from('products').select('*', { count: 'exact', head: true }),
    supabaseClient.from('categories').select('*', { count: 'exact', head: true }),
  ]);
  return { totalProducts: totalProducts || 0, totalCats: totalCats || 0 };
}

// ──────────────────────────────────────────
// PRODUCTS CRUD
// ──────────────────────────────────────────
export async function getProducts() {
  const { data, error } = await supabaseClient
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createProduct(payload) {
  const { data, error } = await supabaseClient
    .from('products')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, payload) {
  const { data, error } = await supabaseClient
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabaseClient
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ──────────────────────────────────────────
// CATEGORIES CRUD
// ──────────────────────────────────────────
export async function getCategories() {
  const { data, error } = await supabaseClient
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function createCategory(name) {
  const { data, error } = await supabaseClient
    .from('categories')
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabaseClient
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ──────────────────────────────────────────
export async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'catalogo');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);

        // Aplicar optimización en la URL (forma correcta)
        const optimizedURL = result.secure_url.replace(
          '/upload/',
          '/upload/f_auto,q_auto,w_800/'
        );

        resolve(optimizedURL);
      } else {
        reject(new Error(`Error Cloudinary: ${xhr.status} - ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Error de red al subir imagen'));
    xhr.send(formData);
  });
}

// ──────────────────────────────────────────
// PRODUCT FORM VALIDATION
// ──────────────────────────────────────────
export function validateProductForm(data) {
  const errors = [];
  if (!data.name?.trim()) errors.push('El nombre es obligatorio.');
  if (!data.price || isNaN(data.price) || data.price <= 0) errors.push('El precio debe ser mayor a 0.');
  if (!data.category?.trim()) errors.push('La categoría es obligatoria.');
  if (!data.image_url?.trim()) errors.push('Debes subir una imagen.');
  return errors;
}

// ──────────────────────────────────────────
// RENDER TABLE ROW
// ──────────────────────────────────────────
export function renderProductRow(product, onEdit, onDelete) {
  const tr = document.createElement('tr');
  tr.dataset.id = product.id;
  tr.innerHTML = `
    <td>
      <div class="flex items-center gap-2">
        <img class="table-product-img" src="${product.image_url}" alt="${escapeHtml(product.name)}"
          onerror="this.src='https://placehold.co/48x48/f0f0f0/999?text=?'" />
        <span class="table-product-name">${escapeHtml(product.name)}</span>
      </div>
    </td>
    <td>$${formatPrice(product.price)}</td>
    <td><span class="badge badge-blue">${escapeHtml(product.category)}</span></td>
    <td class="text-sm text-gray">${new Date(product.created_at).toLocaleDateString('es-CO')}</td>
    <td>
      <div class="action-btns">
        <button class="btn btn-outline" data-action="edit" style="padding:6px 12px;font-size:0.78rem">
          ✏️ Editar
        </button>
        <button class="btn btn-danger" data-action="delete" style="padding:6px 12px;font-size:0.78rem">
          🗑️ Eliminar
        </button>
      </div>
    </td>`;
  tr.querySelector('[data-action="edit"]').addEventListener('click', () => onEdit(product));
  tr.querySelector('[data-action="delete"]').addEventListener('click', () => onDelete(product));
  return tr;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
