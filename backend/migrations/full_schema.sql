-- ============================================================
-- FULL SCHEMA: Tables + RLS Policies
-- QR Ordering SaaS - Multi-tenant
-- ============================================================

-- 0. ENUMS
CREATE TYPE order_status AS ENUM (
    'PENDING',
    'PAYMENT_SENT',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'DELIVERED',
    'CANCELLED'
);

-- 1. RESTAURANTS
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    commission_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin')),
    restaurant_id UUID REFERENCES restaurants(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_restaurant ON profiles(restaurant_id);

-- 3. TABLES
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number INTEGER NOT NULL,
    qr_token TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(restaurant_id, table_number)
);

CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);

-- 4. MENU CATEGORIES
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_menu_categories_restaurant ON menu_categories(restaurant_id);

-- 5. MENU ITEMS
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);

-- 6. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES tables(id),
    status order_status DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    diner_name TEXT,
    notes TEXT,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_restaurant_created ON orders(restaurant_id, created_at DESC);

-- 7. ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    menu_item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 8. PAYMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    bank_reference TEXT NOT NULL,
    payer_phone TEXT,
    payer_name TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(restaurant_id, bank_reference)
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_restaurant ON payments(restaurant_id);
CREATE INDEX idx_payments_restaurant_status ON payments(restaurant_id, status);

-- 9. ORDER STATUS HISTORY
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status order_status,
    to_status order_status NOT NULL,
    changed_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_history_order ON order_status_history(order_id);

-- 10. COMMISSIONS
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    order_id UUID NOT NULL REFERENCES orders(id) UNIQUE,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.10,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_commissions_restaurant ON commissions(restaurant_id);
CREATE INDEX idx_commissions_created ON commissions(created_at DESC);

-- ============================================================
-- RLS POLICIES
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_restaurant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT restaurant_id FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    )
$$;

-- RESTAURANTS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY restaurants_admin_select ON restaurants
    FOR SELECT
    USING (id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY restaurants_admin_insert ON restaurants
    FOR INSERT
    WITH CHECK (is_superadmin());

CREATE POLICY restaurants_admin_update ON restaurants
    FOR UPDATE
    USING (id = get_user_restaurant_id() OR is_superadmin())
    WITH CHECK (id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY restaurants_admin_delete ON restaurants
    FOR DELETE
    USING (is_superadmin());

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_self_select ON profiles
    FOR SELECT
    USING (id = auth.uid() OR is_superadmin());

CREATE POLICY profiles_self_update ON profiles
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY profiles_admin_insert ON profiles
    FOR INSERT
    WITH CHECK (is_superadmin() OR auth.uid() = id);

CREATE POLICY profiles_admin_delete ON profiles
    FOR DELETE
    USING (is_superadmin());

-- TABLES
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY tables_anon_select ON tables
    FOR SELECT
    USING (is_active = true);

CREATE POLICY tables_admin_select ON tables
    FOR SELECT
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY tables_admin_insert ON tables
    FOR INSERT
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY tables_admin_update ON tables
    FOR UPDATE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin())
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY tables_admin_delete ON tables
    FOR DELETE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

-- MENU CATEGORIES
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY menu_categories_anon_select ON menu_categories
    FOR SELECT
    USING (is_active = true);

CREATE POLICY menu_categories_admin_select ON menu_categories
    FOR SELECT
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY menu_categories_admin_insert ON menu_categories
    FOR INSERT
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY menu_categories_admin_update ON menu_categories
    FOR UPDATE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin())
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY menu_categories_admin_delete ON menu_categories
    FOR DELETE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

-- MENU ITEMS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY menu_items_anon_select ON menu_items
    FOR SELECT
    USING (is_available = true);

CREATE POLICY menu_items_admin_select ON menu_items
    FOR SELECT
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY menu_items_admin_insert ON menu_items
    FOR INSERT
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY menu_items_admin_update ON menu_items
    FOR UPDATE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin())
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY menu_items_admin_delete ON menu_items
    FOR DELETE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

-- ORDERS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_anon_insert ON orders
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY orders_anon_select ON orders
    FOR SELECT
    USING (true);

CREATE POLICY orders_admin_select ON orders
    FOR SELECT
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY orders_admin_update ON orders
    FOR UPDATE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin())
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

-- ORDER ITEMS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_items_anon_insert ON order_items
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY order_items_anon_select ON order_items
    FOR SELECT
    USING (true);

CREATE POLICY order_items_admin_select ON order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = order_items.order_id
            AND (o.restaurant_id = get_user_restaurant_id() OR is_superadmin())
        )
    );

-- PAYMENTS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_anon_insert ON payments
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY payments_anon_select ON payments
    FOR SELECT
    USING (true);

CREATE POLICY payments_admin_select ON payments
    FOR SELECT
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY payments_admin_update ON payments
    FOR UPDATE
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin())
    WITH CHECK (restaurant_id = get_user_restaurant_id() OR is_superadmin());

-- ORDER STATUS HISTORY
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_history_anon_insert ON order_status_history
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY order_history_anon_select ON order_status_history
    FOR SELECT
    USING (true);

CREATE POLICY order_history_admin_select ON order_status_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = order_id
            AND (o.restaurant_id = get_user_restaurant_id() OR is_superadmin())
        )
    );

-- COMMISSIONS
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY commissions_admin_select ON commissions
    FOR SELECT
    USING (restaurant_id = get_user_restaurant_id() OR is_superadmin());

CREATE POLICY commissions_admin_insert ON commissions
    FOR INSERT
    WITH CHECK (is_superadmin());
