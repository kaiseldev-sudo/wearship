const { query, transaction } = require('../config/database');
const Product = require('./Product');

class Cart {
  // Get or create cart for user/session
  static async getOrCreateCart(userId = null, sessionId = null) {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required');
    }
    
    let cart;
    
    if (userId) {
      // Try to find existing cart for user
      const [existingCart] = await query(
        'SELECT * FROM carts WHERE user_id = ? AND expires_at > NOW()',
        [userId]
      );
      cart = existingCart;
    } else if (sessionId) {
      // Try to find existing cart for session
      const [existingCart] = await query(
        'SELECT * FROM carts WHERE session_id = ? AND expires_at > NOW()',
        [sessionId]
      );
      cart = existingCart;
    }
    
    // Create new cart if none exists
    if (!cart) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now
      
      const result = await query(
        'INSERT INTO carts (user_id, session_id, expires_at) VALUES (?, ?, ?)',
        [userId, sessionId, expiresAt]
      );
      
      cart = {
        id: result.insertId,
        user_id: userId,
        session_id: sessionId,
        currency: 'USD',
        expires_at: expiresAt,
        created_at: new Date(),
        updated_at: new Date()
      };
    }
    
    return cart;
  }
  
  // Get cart with items
  static async getCartWithItems(cartId) {
    const [cart] = await query('SELECT * FROM carts WHERE id = ?', [cartId]);
    if (!cart) return null;
    
    // Get cart items with product details
    const items = await query(`
      SELECT 
        ci.*,
        p.name as product_name,
        p.slug as product_slug,
        p.is_pre_order,
        p.pre_order_message,
        p.estimated_shipping_date,
        pv.title as variant_title,
        pv.sku as variant_sku,
        pv.inventory_quantity,
        pv.allow_backorders,
        pi.url as product_image,
        cd.name as custom_design_name,
        cd.preview_image_url as custom_design_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      LEFT JOIN custom_designs cd ON ci.custom_design_id = cd.id
      WHERE ci.cart_id = ?
      ORDER BY ci.created_at ASC
    `, [cartId]);
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      ...cart,
      items,
      subtotal: subtotal.toFixed(2),
      item_count: itemCount
    };
  }
  
  // Add item to cart
  static async addItem(cartId, itemData) {
    const {
      product_id,
      variant_id = null,
      custom_design_id = null,
      quantity = 1
    } = itemData;
    
    // Validate product exists
    const product = await Product.findById(product_id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Determine price
    let unit_price = product.base_price;
    
    if (variant_id) {
      const [variant] = await query(
        'SELECT price FROM product_variants WHERE id = ? AND product_id = ? AND is_active = TRUE',
        [variant_id, product_id]
      );
      
      if (!variant) {
        throw new Error('Product variant not found');
      }
      
      unit_price = variant.price || product.base_price;
      
      // Check inventory if needed
      const inventoryCheck = await Product.checkInventory(variant_id, quantity);
      if (!inventoryCheck.available) {
        throw new Error(`Insufficient inventory: ${inventoryCheck.reason}`);
      }
    }
    
    if (custom_design_id) {
      const [customDesign] = await query(
        'SELECT price FROM custom_designs WHERE id = ?',
        [custom_design_id]
      );
      
      if (!customDesign) {
        throw new Error('Custom design not found');
      }
      
      unit_price = customDesign.price;
    }
    
    const total_price = (parseFloat(unit_price) * quantity).toFixed(2);
    
    // Check if item already exists in cart
    let whereClause = 'cart_id = ? AND product_id = ?';
    let whereParams = [cartId, product_id];
    
    if (variant_id) {
      whereClause += ' AND variant_id = ?';
      whereParams.push(variant_id);
    } else {
      whereClause += ' AND variant_id IS NULL';
    }
    
    if (custom_design_id) {
      whereClause += ' AND custom_design_id = ?';
      whereParams.push(custom_design_id);
    } else {
      whereClause += ' AND custom_design_id IS NULL';
    }
    
    const [existingItem] = await query(
      `SELECT * FROM cart_items WHERE ${whereClause}`,
      whereParams
    );
    
    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      const newTotalPrice = (parseFloat(unit_price) * newQuantity).toFixed(2);
      
      await query(
        'UPDATE cart_items SET quantity = ?, total_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, newTotalPrice, existingItem.id]
      );
      
      return { ...existingItem, quantity: newQuantity, total_price: newTotalPrice };
    } else {
      // Add new item
      const result = await query(
        `INSERT INTO cart_items (
          cart_id, product_id, variant_id, custom_design_id, 
          quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cartId, product_id, variant_id, custom_design_id, quantity, unit_price, total_price]
      );
      
      return {
        id: result.insertId,
        cart_id: cartId,
        product_id,
        variant_id,
        custom_design_id,
        quantity,
        unit_price,
        total_price
      };
    }
  }
  
  // Update cart item quantity
  static async updateItemQuantity(cartId, itemId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(cartId, itemId);
    }
    
    // Get current item details
    const [item] = await query(
      'SELECT * FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );
    
    if (!item) {
      throw new Error('Cart item not found');
    }
    
    // Check inventory if variant exists
    if (item.variant_id) {
      const inventoryCheck = await Product.checkInventory(item.variant_id, quantity);
      if (!inventoryCheck.available) {
        throw new Error(`Insufficient inventory: ${inventoryCheck.reason}`);
      }
    }
    
    const total_price = (parseFloat(item.unit_price) * quantity).toFixed(2);
    
    const result = await query(
      'UPDATE cart_items SET quantity = ?, total_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND cart_id = ?',
      [quantity, total_price, itemId, cartId]
    );
    
    return result.affectedRows > 0;
  }
  
  // Remove item from cart
  static async removeItem(cartId, itemId) {
    const result = await query(
      'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );
    
    return result.affectedRows > 0;
  }
  
  // Clear entire cart
  static async clearCart(cartId) {
    const result = await query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    return result.affectedRows;
  }
  
  // Get cart totals
  static async getCartTotals(cartId) {
    const [totals] = await query(`
      SELECT 
        COUNT(*) as item_count,
        SUM(quantity) as total_quantity,
        SUM(total_price) as subtotal
      FROM cart_items 
      WHERE cart_id = ?
    `, [cartId]);
    
    const subtotal = parseFloat(totals.subtotal || 0);
    const taxRate = 0.0825; // 8.25% - should come from settings
    const tax = subtotal * taxRate;
    const shippingThreshold = 75.00; // Free shipping over $75
    const standardShipping = 5.99;
    const shipping = subtotal >= shippingThreshold ? 0 : standardShipping;
    const total = subtotal + tax + shipping;
    
    return {
      item_count: totals.item_count || 0,
      total_quantity: totals.total_quantity || 0,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      free_shipping_eligible: subtotal >= shippingThreshold,
      free_shipping_remaining: subtotal < shippingThreshold ? (shippingThreshold - subtotal).toFixed(2) : 0
    };
  }
  
  // Transfer guest cart to user account
  static async transferGuestCartToUser(sessionId, userId) {
    // Find guest cart
    const [guestCart] = await query(
      'SELECT * FROM carts WHERE session_id = ? AND user_id IS NULL',
      [sessionId]
    );
    
    if (!guestCart) return false;
    
    // Check if user already has a cart
    const [userCart] = await query(
      'SELECT * FROM carts WHERE user_id = ? AND expires_at > NOW()',
      [userId]
    );
    
    if (userCart) {
      // Merge guest cart items into user cart
      const guestItems = await query(
        'SELECT * FROM cart_items WHERE cart_id = ?',
        [guestCart.id]
      );
      
      for (const item of guestItems) {
        try {
          await this.addItem(userCart.id, {
            product_id: item.product_id,
            variant_id: item.variant_id,
            custom_design_id: item.custom_design_id,
            quantity: item.quantity
          });
        } catch (error) {
          console.error('Error merging cart item:', error);
          // Continue with other items even if one fails
        }
      }
      
      // Delete guest cart
      await query('DELETE FROM cart_items WHERE cart_id = ?', [guestCart.id]);
      await query('DELETE FROM carts WHERE id = ?', [guestCart.id]);
      
      return userCart.id;
    } else {
      // Transfer guest cart to user
      const result = await query(
        'UPDATE carts SET user_id = ?, session_id = NULL WHERE id = ?',
        [userId, guestCart.id]
      );
      
      return result.affectedRows > 0 ? guestCart.id : false;
    }
  }
  
  // Get abandoned carts (for marketing/recovery)
  static async getAbandonedCarts(filters = {}) {
    const hoursAgo = filters.hours_ago || 24;
    const hasEmail = filters.has_email || false;
    
    let sql = `
      SELECT 
        c.*,
        u.email,
        u.first_name,
        u.last_name,
        COUNT(ci.id) as item_count,
        SUM(ci.total_price) as cart_value
      FROM carts c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.updated_at < DATE_SUB(NOW(), INTERVAL ? HOUR)
        AND c.expires_at > NOW()
    `;
    
    const params = [hoursAgo];
    
    if (hasEmail) {
      sql += ' AND u.email IS NOT NULL';
    }
    
    sql += `
      GROUP BY c.id
      HAVING item_count > 0
      ORDER BY cart_value DESC, c.updated_at DESC
    `;
    
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }
    
    return await query(sql, params);
  }
  
  // Clean up expired carts
  static async cleanupExpiredCarts() {
    // Delete items from expired carts
    await query(`
      DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.expires_at <= NOW()
    `);
    
    // Delete expired carts
    const result = await query('DELETE FROM carts WHERE expires_at <= NOW()');
    
    return result.affectedRows;
  }
  
  // Update cart expiration
  static async updateExpiration(cartId, days = 30) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    
    const result = await query(
      'UPDATE carts SET expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [expiresAt, cartId]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Cart; 