-- Wearship Database Setup Script
-- Run this file to create the complete database with schema and mock data

-- Source the schema file
SOURCE schema.sql;

-- Source the mock data file
SOURCE mock_data.sql;

-- Show summary of what was created
SELECT 'Database setup complete!' as status;

SELECT 
    'Tables created successfully' as message,
    COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'wearship_db';

SELECT 'Sample data summary:' as summary;
SELECT 'Products' as table_name, COUNT(*) as record_count FROM products
UNION ALL
SELECT 'Product Variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT 'Ministries', COUNT(*) FROM ministries
UNION ALL
SELECT 'Custom Designs', COUNT(*) FROM custom_designs; 