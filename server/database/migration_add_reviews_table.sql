-- Migration: Add reviews table
USE wearship_db;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product_review (user_id, product_id)
);

-- Add indexes for better performance
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Insert some sample reviews
INSERT INTO reviews (user_id, product_id, rating, title, comment, is_verified_purchase, helpful_votes) VALUES
(22, 1, 5, 'Amazing Quality!', 'Absolutely love this t-shirt! The quality is amazing and the message is so meaningful. Perfect fit and comfortable to wear. Will definitely buy more from Wearship!', TRUE, 12),
(22, 2, 5, 'Great Design', 'Great quality material and the design is beautiful. The faith message is subtle yet powerful. Highly recommend!', TRUE, 8),
(22, 3, 4, 'Love the Message', 'Love the design and the message. The fabric is soft and comfortable. Only giving 4 stars because it runs slightly large, but still a great purchase.', TRUE, 5),
(22, 4, 5, 'Perfect Fit', 'This shirt fits perfectly and the material is so comfortable. The faith message is beautifully designed.', TRUE, 15),
(22, 5, 4, 'Good Quality', 'Good quality shirt with a meaningful message. Slightly expensive but worth it for the quality.', TRUE, 7),
(22, 6, 5, 'Excellent Product', 'This is exactly what I was looking for. The quality is outstanding and the message is powerful.', TRUE, 9);

-- Show the table structure
DESCRIBE reviews; 