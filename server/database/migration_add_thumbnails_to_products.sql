-- Migration: Populate thumbnails column in products table
-- This populates the existing thumbnails column with thumbnail URLs

USE wearship_db;

-- Update existing products with thumbnail data from product_images
-- Using GROUP_CONCAT for MariaDB compatibility
UPDATE products p 
SET thumbnails = (
  SELECT CONCAT('[', GROUP_CONCAT(CONCAT('"', pi.url, '"') ORDER BY pi.position ASC), ']')
  FROM product_images pi 
  WHERE pi.product_id = p.id 
  AND pi.is_primary = FALSE
)
WHERE EXISTS (
  SELECT 1 FROM product_images pi2 
  WHERE pi2.product_id = p.id 
  AND pi2.is_primary = FALSE
);

-- Show the updated table structure
DESCRIBE products; 