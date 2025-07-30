-- Migration: Add duplicate images to products for thumbnail testing
-- This adds additional images to existing products to test thumbnail functionality

USE wearship_db;

-- Add additional images to product 1 (Faith Over Fear Tee)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary, created_at) VALUES
(1, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Faith Over Fear Tee - Front View', 1, 1, NOW()),
(1, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Faith Over Fear Tee - Back View', 2, 0, NOW()),
(1, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Faith Over Fear Tee - Side View', 3, 0, NOW()),
(1, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Faith Over Fear Tee - Detail View', 4, 0, NOW());

-- Add additional images to product 2 (Worship Warrior Tee)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary, created_at) VALUES
(2, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Worship Warrior Tee - Front View', 1, 1, NOW()),
(2, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Worship Warrior Tee - Back View', 2, 0, NOW()),
(2, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Worship Warrior Tee - Side View', 3, 0, NOW());

-- Add additional images to product 3 (His Grace Tee)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary, created_at) VALUES
(3, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'His Grace Tee - Front View', 1, 1, NOW()),
(3, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'His Grace Tee - Back View', 2, 0, NOW()),
(3, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'His Grace Tee - Detail View', 3, 0, NOW());

-- Add additional images to product 4 (Blessed & Grateful Tee)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary, created_at) VALUES
(4, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Blessed & Grateful Tee - Front View', 1, 1, NOW()),
(4, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Blessed & Grateful Tee - Back View', 2, 0, NOW()),
(4, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Blessed & Grateful Tee - Side View', 3, 0, NOW()),
(4, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Blessed & Grateful Tee - Detail View', 4, 0, NOW());

-- Add additional images to product 5 (Chosen & Beloved Tee)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary, created_at) VALUES
(5, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Chosen & Beloved Tee - Front View', 1, 1, NOW()),
(5, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Chosen & Beloved Tee - Back View', 2, 0, NOW()),
(5, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Chosen & Beloved Tee - Detail View', 3, 0, NOW());

-- Add additional images to product 6 (Jesus is King Hoodie)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary, created_at) VALUES
(6, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Jesus is King Hoodie - Front View', 1, 1, NOW()),
(6, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Jesus is King Hoodie - Back View', 2, 0, NOW()),
(6, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Jesus is King Hoodie - Side View', 3, 0, NOW()),
(6, 'https://images.pexels.com/photos/8532635/pexels-photo-8532635.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop', 'Jesus is King Hoodie - Detail View', 4, 0, NOW());

-- Update thumbnails column for all products
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

-- Show the updated product images count
SELECT 
  p.id,
  p.name,
  COUNT(pi.id) as total_images,
  SUM(CASE WHEN pi.is_primary = 1 THEN 1 ELSE 0 END) as primary_images,
  SUM(CASE WHEN pi.is_primary = 0 THEN 1 ELSE 0 END) as thumbnail_images
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.name
ORDER BY p.id; 