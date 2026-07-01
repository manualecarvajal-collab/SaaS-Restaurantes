-- ============================================================
-- MIGRATION 002: Row-Level Security Policies
-- Multi-tenant isolation enforced at database level
-- ============================================================

-- Helper function to get the current user's restaurant_id
-- Returns NULL for superadmins (they see all)
CREATE OR REPLACE FUNCTION get_user_restaurant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT restaurant_id FROM profiles WHERE id = auth.uid()
$$;

-- Helper function to check if current user is superadmin
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

-- ============================================================
-- 1. RESTAURANTS
-- ============================================================
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY restaurants_admin_select ON restaurants
    FOR SELECT
    USING (
        id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY restaurants_admin_insert ON restaurants
    FOR INSERT
    WITH CHECK (is_superadmin());

CREATE POLICY restaurants_admin_update ON restaurants
    FOR UPDATE
    USING (
        id = get_user_restaurant_id()
        OR is_superadmin()
    )
    WITH CHECK (
        id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY restaurants_admin_delete ON restaurants
    FOR DELETE
    USING (is_superadmin());

-- ============================================================
-- 2. PROFILES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_self_select ON profiles
    FOR SELECT
    USING (
        id = auth.uid()
        OR is_superadmin()
    );

CREATE POLICY profiles_self_update ON profiles
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY profiles_admin_insert ON profiles
    FOR INSERT
    WITH CHECK (
        is_superadmin()
        OR auth.uid() = id  -- Allow user to create own profile on signup
    );

CREATE POLICY profiles_admin_delete ON profiles
    FOR DELETE
    USING (is_superadmin());

-- ============================================================
-- 3. TABLES
-- ============================================================
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Anon users can read tables (for QR lookup)
CREATE POLICY tables_anon_select ON tables
    FOR SELECT
    USING (is_active = true);

-- Admins see only their restaurant tables
CREATE POLICY tables_admin_select ON tables
    FOR SELECT
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY tables_admin_insert ON tables
    FOR INSERT
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY tables_admin_update ON tables
    FOR UPDATE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    )
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY tables_admin_delete ON tables
    FOR DELETE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

-- ============================================================
-- 4. MENU CATEGORIES
-- ============================================================
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

-- Anon users can read active categories
CREATE POLICY menu_categories_anon_select ON menu_categories
    FOR SELECT
    USING (is_active = true);

CREATE POLICY menu_categories_admin_select ON menu_categories
    FOR SELECT
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY menu_categories_admin_insert ON menu_categories
    FOR INSERT
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY menu_categories_admin_update ON menu_categories
    FOR UPDATE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    )
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY menu_categories_admin_delete ON menu_categories
    FOR DELETE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

-- ============================================================
-- 5. MENU ITEMS
-- ============================================================
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Anon users can read available items
CREATE POLICY menu_items_anon_select ON menu_items
    FOR SELECT
    USING (is_available = true);

CREATE POLICY menu_items_admin_select ON menu_items
    FOR SELECT
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY menu_items_admin_insert ON menu_items
    FOR INSERT
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY menu_items_admin_update ON menu_items
    FOR UPDATE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    )
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY menu_items_admin_delete ON menu_items
    FOR DELETE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

-- ============================================================
-- 6. ORDERS
-- ============================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anon users can create orders and read own order by session/table
-- For now, allow basic anon access to create and read orders
-- (The actual session-based restriction happens at app level)
CREATE POLICY orders_anon_insert ON orders
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY orders_anon_select ON orders
    FOR SELECT
    USING (true);

CREATE POLICY orders_admin_select ON orders
    FOR SELECT
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY orders_admin_update ON orders
    FOR UPDATE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    )
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

-- ============================================================
-- 7. ORDER ITEMS
-- ============================================================
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

-- ============================================================
-- 8. PAYMENTS
-- ============================================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Anon users can submit payment references
CREATE POLICY payments_anon_insert ON payments
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY payments_anon_select ON payments
    FOR SELECT
    USING (true);

CREATE POLICY payments_admin_select ON payments
    FOR SELECT
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY payments_admin_update ON payments
    FOR UPDATE
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    )
    WITH CHECK (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

-- ============================================================
-- 9. ORDER STATUS HISTORY
-- ============================================================
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

-- ============================================================
-- 10. COMMISSIONS
-- ============================================================
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY commissions_admin_select ON commissions
    FOR SELECT
    USING (
        restaurant_id = get_user_restaurant_id()
        OR is_superadmin()
    );

CREATE POLICY commissions_admin_insert ON commissions
    FOR INSERT
    WITH CHECK (is_superadmin());
