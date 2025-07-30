-- Migration: Add different image URLs for better thumbnail testing
-- This updates some product images with different URLs to make thumbnails visually distinct

USE wearship_db;

-- Update product 1 with different image URLs
UPDATE product_images 
SET url = 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
WHERE product_id = 1 AND position = 1 AND is_primary = 1;

UPDATE product_images 
SET url = 'https://images.pexels.com/photos/8532636/pexels-photo-8532636.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
WHERE product_id = 1 AND position = 2 AND is_primary = 0;

UPDATE product_images 
SET url = 'https://images.pexels.com/photos/8532637/pexels-photo-8532637.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
WHERE product_id = 1 AND position = 3 AND is_primary = 0;

UPDATE product_images 
SET url = 'https://images.pexels.com/photos/8532638/pexels-photo-8532638.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
WHERE product_id = 1 AND position = 4 AND is_primary = 0;

-- Update product 2 with different image URLs
UPDATE product_images 
SET url = 'https://images.pexels.com/photos/8532639/pexels-photo-8532639.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
WHERE product_id = 2 AND position = 1 AND is_primary = 1;

UPDATE product_images 
SET url = 'https://images.pexels.com/photos/8532640/pexels-photo-8532640.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
WHERE product_id = 2 AND position = 2 AND is_primary = 0;

UPDATE product_images 
SET url = 'https://images.pexels.com/photos/8532641/pexels-photo-8532641.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop'
WHERE product_id = 2 AND position = 3 AND is_primary = 0;

-- Update thumbnails column for updated products
UPDATE products p 
SET thumbnails = (
  SELECT CONCAT('[', GROUP_CONCAT(CONCAT('"', pi.url, '"') ORDER BY pi.position ASC), ']')
  FROM product_images pi 
  WHERE pi.product_id = p.id 
  AND pi.is_primary = FALSE
)
WHERE p.id IN (1, 2);

-- Show the updated product images
SELECT 
  p.id,
  p.name,
  pi.position,
  pi.is_primary,
  LEFT(pi.url, 80) as image_url
FROM products p
JOIN product_images pi ON p.id = pi.product_id
WHERE p.id IN (1, 2)
ORDER BY p.id, pi.position; 