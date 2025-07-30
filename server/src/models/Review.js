const { query } = require('../config/database');

class Review {
  static async create(reviewData) {
    const { user_id, product_id, rating, title, comment } = reviewData;
    
    const sql = `
      INSERT INTO reviews (user_id, product_id, rating, title, comment, is_verified_purchase)
      VALUES (?, ?, ?, ?, ?, TRUE)
    `;
    
    try {
      const result = await query(sql, [user_id, product_id, rating, title, comment]);
      return { id: result.insertId, ...reviewData };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('You have already reviewed this product');
      }
      throw error;
    }
  }

  static async getByProductId(productId, limit = 10, offset = 0) {
    const sql = `
      SELECT 
        r.id,
        r.rating,
        r.title,
        r.comment,
        r.is_verified_purchase,
        r.helpful_votes,
        r.created_at,
        u.first_name,
        u.last_name,
        u.email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    return await query(sql, [productId, limit, offset]);
  }

  static async getProductStats(productId) {
    const sql = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
      WHERE product_id = ?
    `;
    
    const result = await query(sql, [productId]);
    return result[0];
  }

  static async getUserReview(userId, productId) {
    const sql = `
      SELECT * FROM reviews
      WHERE user_id = ? AND product_id = ?
    `;
    
    const result = await query(sql, [userId, productId]);
    return result[0] || null;
  }

  static async update(reviewId, reviewData) {
    const { rating, title, comment } = reviewData;
    
    const sql = `
      UPDATE reviews
      SET rating = ?, title = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await query(sql, [rating, title, comment, reviewId]);
    return { id: reviewId, ...reviewData };
  }

  static async delete(reviewId) {
    const sql = 'DELETE FROM reviews WHERE id = ?';
    await query(sql, [reviewId]);
  }

  static async markHelpful(reviewId) {
    const sql = `
      UPDATE reviews
      SET helpful_votes = helpful_votes + 1
      WHERE id = ?
    `;
    
    await query(sql, [reviewId]);
  }
}

module.exports = Review; 