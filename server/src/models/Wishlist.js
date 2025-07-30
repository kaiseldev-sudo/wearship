const { query } = require('../config/database');

class Wishlist {
  // Get user's wishlist with product details
  static async getUserWishlist(userId) {
    const sql = `
      SELECT 
        w.id,
        w.user_id,
        w.product_id,
        w.created_at,
        p.name as product_name,
        p.slug as product_slug,
        p.base_price,
        p.is_pre_order,
        p.inventory_quantity,
        pi.url as primary_image_url
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE w.user_id = ? AND p.deleted_at IS NULL
      ORDER BY w.created_at DESC
    `;
    
    return await query(sql, [userId]);
  }

  // Add item to wishlist
  static async addToWishlist(userId, productId) {
    // Check if item already exists in wishlist
    const [existing] = await query(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing) {
      throw new Error('Item already exists in wishlist');
    }

    // Check if product exists and is active
    const [product] = await query(
      'SELECT id FROM products WHERE id = ? AND is_active = TRUE AND deleted_at IS NULL',
      [productId]
    );

    if (!product) {
      throw new Error('Product not found or not available');
    }

    const result = await query(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );

    return {
      id: result.insertId,
      user_id: userId,
      product_id: productId,
      created_at: new Date()
    };
  }

  // Remove item from wishlist
  static async removeFromWishlist(userId, productId) {
    const result = await query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    return result.affectedRows > 0;
  }

  // Check if item is in wishlist
  static async isInWishlist(userId, productId) {
    const [item] = await query(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    return !!item;
  }

  // Clear entire wishlist
  static async clearWishlist(userId) {
    const result = await query(
      'DELETE FROM wishlist WHERE user_id = ?',
      [userId]
    );

    return result.affectedRows;
  }

  // Get wishlist count for user
  static async getWishlistCount(userId) {
    const [result] = await query(
      'SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?',
      [userId]
    );

    return result.count;
  }
}

module.exports = Wishlist; 