-- ============================================================
-- SETUP COMPLETO DE SUPABASE — MiCatálogo
-- Ejecuta este SQL en: Supabase > SQL Editor > New Query
-- ============================================================

-- ── 1. TABLA: categories
CREATE TABLE IF NOT EXISTS categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  created_at timestamp DEFAULT now()
);

-- ── 2. TABLA: products
CREATE TABLE IF NOT EXISTS products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  price       numeric NOT NULL CHECK (price >= 0),
  category    text NOT NULL,
  image_url   text NOT NULL,
  created_at  timestamp DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activar RLS en ambas tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;

-- ── POLÍTICAS: categories
-- Lectura pública (cualquiera puede ver categorías)
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden escribir
CREATE POLICY "Auth users manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── POLÍTICAS: products
-- Lectura pública (el catálogo es visible para todos)
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden crear/editar/eliminar
CREATE POLICY "Auth users manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- DATOS DE EJEMPLO (opcional — borra si no los necesitas)
-- ============================================================

-- Categorías de ejemplo
INSERT INTO categories (name) VALUES
  ('Ropa'),
  ('Electrónicos'),
  ('Hogar'),
  ('Accesorios')
ON CONFLICT (name) DO NOTHING;

-- Productos de ejemplo
INSERT INTO products (name, description, price, category, image_url) VALUES
  (
    'Camiseta Premium Negra',
    'Camiseta de algodón 100%, corte moderno, disponible en varias tallas.',
    49000,
    'Ropa',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop'
  ),
  (
    'Audífonos Bluetooth Pro',
    'Audífonos inalámbricos con cancelación de ruido activa, batería de 30 horas.',
    189000,
    'Electrónicos',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop'
  ),
  (
    'Planta Decorativa Interior',
    'Planta artificial de alta calidad, perfecta para sala o habitación.',
    75000,
    'Hogar',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop'
  ),
  (
    'Reloj Minimalista Blanco',
    'Reloj de pared diseño nórdico, silencioso, diámetro 30 cm.',
    95000,
    'Hogar',
    'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&auto=format&fit=crop'
  ),
  (
    'Mochila Urbana Gris',
    'Mochila resistente al agua, compartimento para laptop de 15", 20 litros.',
    135000,
    'Accesorios',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop'
  ),
  (
    'Gafas de Sol Retro',
    'Gafas estilo vintage con protección UV400, montura de acetato.',
    65000,
    'Accesorios',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop'
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- Ejecuta estas queries para confirmar que todo está bien:
-- SELECT * FROM categories;
-- SELECT * FROM products;
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('products','categories');
