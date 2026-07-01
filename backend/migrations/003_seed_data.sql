-- ============================================================
-- SEED DATA: Restaurant + Menu + Orders (all states)
-- Run AFTER auth users are created
-- ============================================================

-- Restaurant: La Cocina de Don Manuel
INSERT INTO restaurants (id, name, slug, logo_url, is_active, commission_count)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'La Cocina de Don Manuel',
    'la-cocina-don-manuel',
    NULL,
    true,
    0
);

-- Profiles (auth users must be created first via Supabase Auth Admin API)
-- superadmin: superadmin@example.com
-- admin: admin@lacocina.com (restaurant_id = 11111111-...)

-- Tables
INSERT INTO tables (restaurant_id, table_number, qr_token) VALUES
    ('11111111-1111-1111-1111-111111111111', 1, 'A1B2C3'),
    ('11111111-1111-1111-1111-111111111111', 2, 'D4E5F6'),
    ('11111111-1111-1111-1111-111111111111', 3, 'G7H8I9'),
    ('11111111-1111-1111-1111-111111111111', 4, 'J0K1L2'),
    ('11111111-1111-1111-1111-111111111111', 5, 'M3N4O5');

-- Menu Categories
INSERT INTO menu_categories (restaurant_id, name, description, sort_order) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Entradas', 'Para compartir', 1),
    ('11111111-1111-1111-1111-111111111111', 'Platos Fuertes', 'Nuestra especialidad', 2),
    ('11111111-1111-1111-1111-111111111111', 'Bebidas', 'Refrescantes', 3),
    ('11111111-1111-1111-1111-111111111111', 'Postres', 'El mejor final', 4);

-- Menu Items
-- Entradas (category will be looked up)
DO $$
DECLARE
    cat_entradas UUID;
    cat_platos UUID;
    cat_bebidas UUID;
    cat_postres UUID;
BEGIN
    SELECT id INTO cat_entradas FROM menu_categories WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Entradas';
    SELECT id INTO cat_platos FROM menu_categories WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Platos Fuertes';
    SELECT id INTO cat_bebidas FROM menu_categories WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Bebidas';
    SELECT id INTO cat_postres FROM menu_categories WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Postres';

    -- Entradas
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, sort_order) VALUES
        ('11111111-1111-1111-1111-111111111111', cat_entradas, 'Ceviche Clásico', 'Pescado fresco marinado en limón, cebolla morada y cilantro', 9.99, 1),
        ('11111111-1111-1111-1111-111111111111', cat_entradas, 'Nachos con Queso', 'Totopos bañados en queso cheddar con jalapeños', 7.50, 2),
        ('11111111-1111-1111-1111-111111111111', cat_entradas, 'Alitas BBQ (6 pzs)', 'Alitas de pollo glaseadas con salsa BBQ ahumada', 11.99, 3);

    -- Platos Fuertes
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, sort_order) VALUES
        ('11111111-1111-1111-1111-111111111111', cat_platos, 'Lomo Saltado', 'Clásico peruano: lomo salteado con cebolla, tomate y papas fritas', 18.99, 1),
        ('11111111-1111-1111-1111-111111111111', cat_platos, 'Pollo a la Brasa 1/4', 'Pollo marinado y asado al carbón, acompañado de papas y ensalada', 14.50, 2),
        ('11111111-1111-1111-1111-111111111111', cat_platos, 'Parrillada para 2', 'Carne, pollo, chorizo, morcilla y papas', 32.00, 3),
        ('11111111-1111-1111-1111-111111111111', cat_platos, 'Filete de Pescado', 'Filete de corvina a la plancha con vegetales salteados', 16.99, 4),
        ('11111111-1111-1111-1111-111111111111', cat_platos, 'Lasagna Bolognesa', 'Capas de pasta con ragú de carne, bechamel y queso gratinado', 13.50, 5);

    -- Bebidas
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, sort_order) VALUES
        ('11111111-1111-1111-1111-111111111111', cat_bebidas, 'Coca-Cola 500ml', 'Refresco de cola', 2.50, 1),
        ('11111111-1111-1111-1111-111111111111', cat_bebidas, 'Agua Mineral', 'Agua con gas 500ml', 2.00, 2),
        ('11111111-1111-1111-1111-111111111111', cat_bebidas, 'Jugo Natural', 'Naranja, maracuyá o mango', 4.50, 3),
        ('11111111-1111-1111-1111-111111111111', cat_bebidas, 'Cerveza Artesanal', 'IPA artesanal 355ml', 5.50, 4);

    -- Postres
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, sort_order) VALUES
        ('11111111-1111-1111-1111-111111111111', cat_postres, 'Cheesecake de Maracuyá', 'Cheesecake cremoso con coulis de maracuyá', 6.99, 1),
        ('11111111-1111-1111-1111-111111111111', cat_postres, 'Tres Leches', 'Bizcocho bañado en tres leches con crema batida', 5.99, 2),
        ('11111111-1111-1111-1111-111111111111', cat_postres, 'Helado Artesanal (2 bolas)', 'Vainilla, chocolate o fresa', 4.50, 3);
END $$;

-- ============================================================
-- TEST ORDERS (all states)
-- ============================================================

-- Helper function to get menu item IDs by name
DO $$
DECLARE
    mesa3 UUID;
    mesa2 UUID;
    mesa5 UUID;
    mesa1 UUID;
    mesa4 UUID;
    item_ceviche UUID;
    item_lomo UUID;
    item_coca UUID;
    item_parrillada UUID;
    item_cerveza UUID;
    item_pollo UUID;
    item_jugo UUID;
    item_tres_leches UUID;
    item_lasagna UUID;
    item_nachos UUID;
    item_agua UUID;
    item_filete UUID;
    item_cheesecake UUID;
    item_alitas UUID;
    admin_id UUID;
    order1 UUID;
    order2 UUID;
    order3 UUID;
    order4 UUID;
    order5 UUID;
    order6 UUID;
    order7 UUID;
BEGIN
    mesa1 := (SELECT id FROM tables WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND table_number = 1);
    mesa2 := (SELECT id FROM tables WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND table_number = 2);
    mesa3 := (SELECT id FROM tables WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND table_number = 3);
    mesa4 := (SELECT id FROM tables WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND table_number = 4);
    mesa5 := (SELECT id FROM tables WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND table_number = 5);

    item_ceviche := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Ceviche Clásico');
    item_lomo := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Lomo Saltado');
    item_coca := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Coca-Cola 500ml');
    item_parrillada := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Parrillada para 2');
    item_cerveza := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Cerveza Artesanal');
    item_pollo := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Pollo a la Brasa 1/4');
    item_jugo := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Jugo Natural');
    item_tres_leches := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Tres Leches');
    item_lasagna := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Lasagna Bolognesa');
    item_nachos := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Nachos con Queso');
    item_agua := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Agua Mineral');
    item_filete := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Filete de Pescado');
    item_cheesecake := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Cheesecake de Maracuyá');
    item_alitas := (SELECT id FROM menu_items WHERE restaurant_id = '11111111-1111-1111-1111-111111111111' AND name = 'Alitas BBQ (6 pzs)');

    admin_id := (SELECT id FROM profiles WHERE email = 'admin@lacocina.com');

    -- Order 1: PENDING (Mesa 3) - no payment yet
    INSERT INTO orders (id, restaurant_id, table_id, status, total_amount, diner_name, notes)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', mesa3, 'PENDING', 31.48, 'Carlos', 'Sin cebolla por favor')
    RETURNING id INTO order1;

    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
        (order1, item_ceviche, 'Ceviche Clásico', 1, 9.99, 9.99),
        (order1, item_lomo, 'Lomo Saltado', 1, 18.99, 18.99),
        (order1, item_coca, 'Coca-Cola 500ml', 1, 2.50, 2.50);

    INSERT INTO order_status_history (order_id, from_status, to_status) VALUES
        (order1, NULL, 'PENDING');

    -- Order 2: PAYMENT_SENT (Mesa 2) - payment sent, awaiting HITL
    INSERT INTO orders (id, restaurant_id, table_id, status, total_amount, diner_name)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', mesa2, 'PAYMENT_SENT', 43.00, 'María')
    RETURNING id INTO order2;

    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
        (order2, item_parrillada, 'Parrillada para 2', 1, 32.00, 32.00),
        (order2, item_cerveza, 'Cerveza Artesanal', 2, 5.50, 11.00);

    INSERT INTO payments (order_id, restaurant_id, amount, bank_reference, payer_name, status) VALUES
        (order2, '11111111-1111-1111-1111-111111111111', 43.00, 'BANK-001', 'María G.', 'PENDING');

    INSERT INTO order_status_history (order_id, from_status, to_status) VALUES
        (order2, NULL, 'PENDING'),
        (order2, 'PENDING', 'PAYMENT_SENT');

    -- Order 3: CONFIRMED (Mesa 5) - payment verified by admin
    INSERT INTO orders (id, restaurant_id, table_id, status, total_amount, diner_name, confirmed_at)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', mesa5, 'CONFIRMED', 24.99, 'Pedro', now() - interval '30 minutes')
    RETURNING id INTO order3;

    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
        (order3, item_pollo, 'Pollo a la Brasa 1/4', 1, 14.50, 14.50),
        (order3, item_jugo, 'Jugo Natural', 1, 4.50, 4.50),
        (order3, item_tres_leches, 'Tres Leches', 1, 5.99, 5.99);

    INSERT INTO payments (order_id, restaurant_id, amount, bank_reference, payer_name, status, verified_by, verified_at) VALUES
        (order3, '11111111-1111-1111-1111-111111111111', 24.99, 'BANK-002', 'Pedro R.', 'VERIFIED', admin_id, now() - interval '25 minutes');

    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by) VALUES
        (order3, NULL, 'PENDING', NULL),
        (order3, 'PENDING', 'PAYMENT_SENT', NULL),
        (order3, 'PAYMENT_SENT', 'CONFIRMED', admin_id);

    -- Order 4: PREPARING (Mesa 1) - in the kitchen
    INSERT INTO orders (id, restaurant_id, table_id, status, total_amount, diner_name, confirmed_at)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '11111111-1111-1111-1111-111111111111', mesa1, 'PREPARING', 23.00, 'Ana', now() - interval '45 minutes')
    RETURNING id INTO order4;

    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
        (order4, item_lasagna, 'Lasagna Bolognesa', 1, 13.50, 13.50),
        (order4, item_nachos, 'Nachos con Queso', 1, 7.50, 7.50),
        (order4, item_agua, 'Agua Mineral', 1, 2.00, 2.00);

    INSERT INTO payments (order_id, restaurant_id, amount, bank_reference, payer_name, status, verified_by, verified_at) VALUES
        (order4, '11111111-1111-1111-1111-111111111111', 23.00, 'BANK-003', 'Ana L.', 'VERIFIED', admin_id, now() - interval '40 minutes');

    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by) VALUES
        (order4, NULL, 'PENDING', NULL),
        (order4, 'PENDING', 'PAYMENT_SENT', NULL),
        (order4, 'PAYMENT_SENT', 'CONFIRMED', admin_id),
        (order4, 'CONFIRMED', 'PREPARING', admin_id);

    -- Order 5: READY (Mesa 4) - ready to serve
    INSERT INTO orders (id, restaurant_id, table_id, status, total_amount, diner_name, confirmed_at)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '11111111-1111-1111-1111-111111111111', mesa4, 'READY', 23.98, 'Luis', now() - interval '1 hour')
    RETURNING id INTO order5;

    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
        (order5, item_filete, 'Filete de Pescado', 1, 16.99, 16.99),
        (order5, item_cheesecake, 'Cheesecake de Maracuyá', 1, 6.99, 6.99);

    INSERT INTO payments (order_id, restaurant_id, amount, bank_reference, payer_name, status, verified_by, verified_at) VALUES
        (order5, '11111111-1111-1111-1111-111111111111', 23.98, 'BANK-004', 'Luis M.', 'VERIFIED', admin_id, now() - interval '55 minutes');

    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by) VALUES
        (order5, NULL, 'PENDING', NULL),
        (order5, 'PENDING', 'PAYMENT_SENT', NULL),
        (order5, 'PAYMENT_SENT', 'CONFIRMED', admin_id),
        (order5, 'CONFIRMED', 'PREPARING', admin_id),
        (order5, 'PREPARING', 'READY', admin_id);

    -- Order 6: DELIVERED (Mesa 1) - completed with commission
    INSERT INTO orders (id, restaurant_id, table_id, status, total_amount, diner_name, confirmed_at)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', '11111111-1111-1111-1111-111111111111', mesa1, 'DELIVERED', 16.99, 'José', now() - interval '2 hours')
    RETURNING id INTO order6;

    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
        (order6, item_alitas, 'Alitas BBQ (6 pzs)', 1, 11.99, 11.99),
        (order6, item_coca, 'Coca-Cola 500ml', 2, 2.50, 5.00);

    INSERT INTO payments (order_id, restaurant_id, amount, bank_reference, payer_name, status, verified_by, verified_at) VALUES
        (order6, '11111111-1111-1111-1111-111111111111', 16.99, 'BANK-005', 'José H.', 'VERIFIED', admin_id, now() - interval '1 hour 55 minutes');

    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by) VALUES
        (order6, NULL, 'PENDING', NULL),
        (order6, 'PENDING', 'PAYMENT_SENT', NULL),
        (order6, 'PAYMENT_SENT', 'CONFIRMED', admin_id),
        (order6, 'CONFIRMED', 'PREPARING', admin_id),
        (order6, 'PREPARING', 'READY', admin_id),
        (order6, 'READY', 'DELIVERED', admin_id);

    -- Commission for order 6
    INSERT INTO commissions (restaurant_id, order_id, amount) VALUES
        ('11111111-1111-1111-1111-111111111111', order6, 0.10);

    -- Update restaurant commission count
    UPDATE restaurants SET commission_count = 1 WHERE id = '11111111-1111-1111-1111-111111111111';

    -- Order 7: CANCELLED (Mesa 2) - cancelled before payment
    INSERT INTO orders (id, restaurant_id, table_id, status, total_amount, diner_name)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', '11111111-1111-1111-1111-111111111111', mesa2, 'CANCELLED', 4.50, 'Laura')
    RETURNING id INTO order7;

    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal) VALUES
        (order7, item_jugo, 'Jugo Natural', 1, 4.50, 4.50);

    INSERT INTO order_status_history (order_id, from_status, to_status) VALUES
        (order7, NULL, 'PENDING'),
        (order7, 'PENDING', 'CANCELLED');
END $$;
