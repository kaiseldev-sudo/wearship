-- Test products with different inventory levels for testing stock availability
-- These are non-pre-order products with various inventory quantities

INSERT INTO products (name, slug, description, short_description, sku, base_price, compare_at_price, cost_price, weight, category_id, brand, tags, is_active, is_featured, is_pre_order, pre_order_message, estimated_shipping_date, inventory_tracking, inventory_quantity, low_stock_threshold) VALUES

-- In Stock (high inventory)
('Test In Stock Tee', 'test-in-stock-tee', 'Test product with high inventory for testing stock display.', 'Test product with high inventory.', 'TEST-IN-001', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["test", "in-stock"]', TRUE, FALSE, FALSE, NULL, NULL, TRUE, 50, 5),

-- Low Stock (limited inventory)
('Test Low Stock Tee', 'test-low-stock-tee', 'Test product with low inventory for testing stock display.', 'Test product with low inventory.', 'TEST-LOW-002', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["test", "low-stock"]', TRUE, FALSE, FALSE, NULL, NULL, TRUE, 3, 5),

-- Out of Stock (zero inventory)
('Test Out of Stock Tee', 'test-out-of-stock-tee', 'Test product with no inventory for testing stock display.', 'Test product with no inventory.', 'TEST-OUT-003', 24.99, 34.99, 12.50, 0.25, 1, 'Wearship', '["test", "out-of-stock"]', TRUE, FALSE, FALSE, NULL, NULL, TRUE, 0, 5);

-- Create variants for these test products
INSERT INTO product_variants (product_id, sku, title, price, inventory_quantity, position)
SELECT 
    p.id,
    CONCAT(LEFT(p.sku, 12), '-M-BLK'),
    'M / Black',
    p.base_price,
    p.inventory_quantity,
    1
FROM products p
WHERE p.sku LIKE 'TEST-%';

-- Add images for test products
INSERT INTO product_images (product_id, url, alt_text, position, is_primary) VALUES
((SELECT id FROM products WHERE sku = 'TEST-IN-001'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop', 'Test In Stock Tee - Main Image', 1, TRUE),
((SELECT id FROM products WHERE sku = 'TEST-LOW-002'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop', 'Test Low Stock Tee - Main Image', 1, TRUE),
((SELECT id FROM products WHERE sku = 'TEST-OUT-003'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop', 'Test Out of Stock Tee - Main Image', 1, TRUE); 