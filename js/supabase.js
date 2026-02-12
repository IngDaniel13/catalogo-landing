// ===== SUPABASE CONFIGURATION =====
// ⚠️ REEMPLAZA con tus credenciales reales de Supabase
// Las consigues en: https://supabase.com > tu proyecto > Settings > API

const SUPABASE_URL = 'https://zsvlqhnrxwfdmakpnjwh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdmxxaG5yeHdmZG1ha3BuandoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTc3NTUsImV4cCI6MjA4NjQ3Mzc1NX0.1rx-KXFbi-BCDPt1XkhyQT5TFQQKLmhaoVW_KIU9kFg';

// Inicialización del cliente Supabase (cargado como CDN en los HTML)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== CLOUDINARY CONFIGURATION =====
// ⚠️ REEMPLAZA con tus datos reales de Cloudinary
// Los consigues en: https://cloudinary.com > Dashboard

const CLOUDINARY_CLOUD_NAME = 'duuletuej';
const CLOUDINARY_UPLOAD_PRESET = 'catalogo_unsigned'; // unsigned preset

// ===== WHATSAPP CONFIGURATION =====
// ⚠️ REEMPLAZA con tu número de WhatsApp (sin +, sin espacios)
// Ejemplo: '573001234567' para Colombia

const WHATSAPP_NUMBER = '573117874532';

// ===== SITE CONFIG =====
const SITE_CONFIG = {
  name: 'SHOPDE ',
  tagline: 'Los mejores productos, directo a tu WhatsApp',
  currency: '$',
  currencyCode: 'COP',
};

export { supabaseClient, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, WHATSAPP_NUMBER, SITE_CONFIG };
