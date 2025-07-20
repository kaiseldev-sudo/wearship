const { query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Order {
  // Generate unique order number
  static generateOrderNumber() {
    const prefix = 'WS';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${prefix}-${year}-${random}`;
  }
  
  // Create new order from cart
  static async createFromCart(cartId, orderData) {
    const {
      user_id = null,
      email,
      billing_address,
      shipping_address,
      payment_method = 'paypal',
      notes = null
    } = orderData;
    
    // Get cart items
    const cartItems = await query(`
      SELECT 
        ci.*,
        p.name as product_name,
        p.cost_price,
        pv.title as variant_title,
        pv.sku as variant_sku
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.cart_id = ?
    `, [cartId]);
    
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const taxRate = 0.0825; // Should come from settings
    const tax_amount = subtotal * taxRate;
    const shippingThreshold = 75.00;
    const shipping_amount = subtotal >= shippingThreshold ? 0 : 5.99;
    const total_amount = subtotal + tax_amount + shipping_amount;
    
    const order_number = this.generateOrderNumber();
    
    const queries = [];
    
    // Create order
    queries.push({
      sql: `
        INSERT INTO orders (
          order_number, user_id, email, status, payment_status, fulfillment_status,
          currency, subtotal, tax_amount, shipping_amount, total_amount,
          billing_first_name, billing_last_name, billing_company, billing_address_line_1,
          billing_address_line_2, billing_city, billing_state, billing_postal_code,
          billing_country, billing_phone,
          shipping_first_name, shipping_last_name, shipping_company, shipping_address_line_1,
          shipping_address_line_2, shipping_city, shipping_state, shipping_postal_code,
          shipping_country, shipping_phone, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        order_number, user_id, email, 'pending', 'pending', 'unfulfilled',
        'USD', subtotal.toFixed(2), tax_amount.toFixed(2), shipping_amount.toFixed(2), total_amount.toFixed(2),
        billing_address.first_name, billing_address.last_name, billing_address.company, billing_address.address_line_1,
        billing_address.address_line_2, billing_address.city, billing_address.state, billing_address.postal_code,
        billing_address.country, billing_address.phone,
        shipping_address.first_name, shipping_address.last_name, shipping_address.company, shipping_address.address_line_1,
        shipping_address.address_line_2, shipping_address.city, shipping_address.state, shipping_address.postal_code,
        shipping_address.country, shipping_address.phone, notes
      ]
    });
    
    const results = await transaction(queries);
    const orderId = results[0].insertId;
    
    // Create order items
    const orderItemQueries = cartItems.map(item => ({
      sql: `
        INSERT INTO order_items (
          order_id, product_id, variant_id, custom_design_id, product_name, variant_title,
          sku, quantity, unit_price, total_price, fulfillment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        orderId, item.product_id, item.variant_id, item.custom_design_id, item.product_name,
        item.variant_title, item.variant_sku, item.quantity, item.unit_price, item.total_price, 'unfulfilled'
      ]
    }));
    
    await transaction(orderItemQueries);
    
    // Clear cart items
    await query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    
    return {
      id: orderId,
      order_number,
      total_amount: total_amount.toFixed(2),
      status: 'pending',
      payment_status: 'pending'
    };
  }
  
  // Get order by ID with full details
  static async findById(id) {
    const [order] = await query(`
      SELECT * FROM orders WHERE id = ?
    `, [id]);
    
    if (!order) return null;
    
    // Get order items
    order.items = await query(`
      SELECT 
        oi.*,
        p.slug as product_slug,
        pi.url as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE oi.order_id = ?
      ORDER BY oi.created_at ASC
    `, [id]);
    
    // Get payment transactions
    order.payments = await query(`
      SELECT * FROM payment_transactions 
      WHERE order_id = ? 
      ORDER BY created_at DESC
    `, [id]);
    
    return order;
  }
  
  // Get order by order number
  static async findByOrderNumber(orderNumber) {
    const [order] = await query(`
      SELECT * FROM orders WHERE order_number = ?
    `, [orderNumber]);
    
    if (!order) return null;
    
    return this.findById(order.id);
  }
  
  // Get all orders with filters
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        o.*,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.user_id) {
      sql += ' AND o.user_id = ?';
      params.push(filters.user_id);
    }
    
    if (filters.status) {
      sql += ' AND o.status = ?';
      params.push(filters.status);
    }
    
    if (filters.payment_status) {
      sql += ' AND o.payment_status = ?';
      params.push(filters.payment_status);
    }
    
    if (filters.fulfillment_status) {
      sql += ' AND o.fulfillment_status = ?';
      params.push(filters.fulfillment_status);
    }
    
    if (filters.search) {
      sql += ' AND (o.order_number LIKE ? OR o.email LIKE ? OR CONCAT(u.first_name, " ", u.last_name) LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    if (filters.date_from) {
      sql += ' AND o.created_at >= ?';
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      sql += ' AND o.created_at <= ?';
      params.push(filters.date_to);
    }
    
    sql += ' GROUP BY o.id ORDER BY o.created_at DESC';
    
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }
    }
    
    const orders = await query(sql, params);
    
    // Fetch order items for each order
    for (let order of orders) {
      order.items = await query(`
        SELECT 
          oi.*,
          p.slug as product_slug,
          pi.url as product_image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
        WHERE oi.order_id = ?
        ORDER BY oi.created_at ASC
      `, [order.id]);
    }
    
    return orders;
  }
  
  // Update order status
  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }
    
    const updates = { status };
    
    // Set timestamp based on status
    if (status === 'confirmed') {
      updates.confirmed_at = new Date();
    } else if (status === 'shipped') {
      updates.shipped_at = new Date();
    } else if (status === 'delivered') {
      updates.delivered_at = new Date();
    } else if (status === 'cancelled') {
      updates.cancelled_at = new Date();
    }
    
    const fields = Object.keys(updates).map(key => `${key} = ?`);
    const values = Object.values(updates);
    values.push(id);
    
    const sql = `UPDATE orders SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    const result = await query(sql, values);
    return result.affectedRows > 0;
  }
  
  // Update payment status
  static async updatePaymentStatus(id, paymentStatus) {
    const validStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'];
    
    if (!validStatuses.includes(paymentStatus)) {
      throw new Error('Invalid payment status');
    }
    
    const result = await query(
      'UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [paymentStatus, id]
    );
    
    return result.affectedRows > 0;
  }
  
  // Update fulfillment status
  static async updateFulfillmentStatus(id, fulfillmentStatus) {
    const validStatuses = ['unfulfilled', 'partial', 'fulfilled'];
    
    if (!validStatuses.includes(fulfillmentStatus)) {
      throw new Error('Invalid fulfillment status');
    }
    
    const result = await query(
      'UPDATE orders SET fulfillment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [fulfillmentStatus, id]
    );
    
    return result.affectedRows > 0;
  }
  
  // Add payment transaction
  static async addPaymentTransaction(orderId, transactionData) {
    const {
      transaction_id,
      payment_method,
      payment_type = 'payment',
      amount,
      currency = 'USD',
      status = 'pending',
      gateway_response = {}
    } = transactionData;
    
    const sql = `
      INSERT INTO payment_transactions (
        order_id, transaction_id, payment_method, payment_type,
        amount, currency, status, gateway_response
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      orderId, transaction_id, payment_method, payment_type,
      amount, currency, status, JSON.stringify(gateway_response)
    ]);
    
    return result.insertId;
  }
  
  // Update payment transaction
  static async updatePaymentTransaction(transactionId, updateData) {
    const allowedFields = ['status', 'gateway_response', 'processed_at'];
    const fields = [];
    const params = [];
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'gateway_response') {
          params.push(JSON.stringify(updateData[key]));
        } else {
          params.push(updateData[key]);
        }
      }
    });
    
    if (fields.length === 0) return false;
    
    params.push(transactionId);
    const sql = `UPDATE payment_transactions SET ${fields.join(', ')} WHERE transaction_id = ?`;
    
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }
  
  // Calculate and allocate ministry profits
  static async allocateMinistryProfits(orderId) {
    // Get order details
    const [order] = await query(`
      SELECT subtotal, tax_amount, shipping_amount FROM orders WHERE id = ?
    `, [orderId]);
    
    if (!order) throw new Error('Order not found');
    
    // Get order items with cost information
    const orderItems = await query(`
      SELECT oi.*, p.cost_price FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);
    
    // Calculate total cost
    const totalCost = orderItems.reduce((sum, item) => {
      const itemCost = (parseFloat(item.cost_price || 0) * item.quantity);
      return sum + itemCost;
    }, 0);
    
    // Calculate profit (revenue - costs)
    const revenue = parseFloat(order.subtotal);
    const profit = revenue - totalCost;
    
    if (profit <= 0) return []; // No profit to allocate
    
    // Get active ministries with allocation percentages
    const ministries = await query(`
      SELECT * FROM ministries WHERE is_active = TRUE ORDER BY allocation_percentage DESC
    `);
    
    // Allocate profits to ministries
    const allocations = [];
    
    for (const ministry of ministries) {
      const allocationAmount = (profit * ministry.allocation_percentage / 100);
      
      if (allocationAmount > 0) {
        await query(`
          INSERT INTO ministry_allocations (
            order_id, ministry_id, profit_amount, allocation_percentage
          ) VALUES (?, ?, ?, ?)
        `, [orderId, ministry.id, allocationAmount.toFixed(2), ministry.allocation_percentage]);
        
        allocations.push({
          ministry_name: ministry.name,
          allocation_percentage: ministry.allocation_percentage,
          amount: allocationAmount.toFixed(2)
        });
      }
    }
    
    return allocations;
  }
  
  // Get order statistics
  static async getOrderStats(filters = {}) {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (filters.date_from) {
      whereClause += ' AND created_at >= ?';
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      whereClause += ' AND created_at <= ?';
      params.push(filters.date_to);
    }
    
    const [stats] = await query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
        SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue,
        AVG(CASE WHEN payment_status = 'paid' THEN total_amount ELSE NULL END) as average_order_value
      FROM orders ${whereClause}
    `, params);
    
    return stats;
  }
  
  // Get ministry allocation summary
  static async getMinistryAllocationStats(filters = {}) {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (filters.date_from) {
      whereClause += ' AND ma.allocated_at >= ?';
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      whereClause += ' AND ma.allocated_at <= ?';
      params.push(filters.date_to);
    }
    
    return await query(`
      SELECT 
        m.name as ministry_name,
        m.allocation_percentage,
        COUNT(ma.id) as allocation_count,
        SUM(ma.profit_amount) as total_allocated,
        SUM(CASE WHEN ma.disbursed_at IS NOT NULL THEN ma.profit_amount ELSE 0 END) as total_disbursed,
        SUM(CASE WHEN ma.disbursed_at IS NULL THEN ma.profit_amount ELSE 0 END) as pending_disbursement
      FROM ministries m
      LEFT JOIN ministry_allocations ma ON m.id = ma.ministry_id ${whereClause.replace('WHERE 1=1', '')}
      ${whereClause}
      GROUP BY m.id
      ORDER BY total_allocated DESC
    `, params);
  }
  
  // Mark order items as fulfilled
  static async fulfillItems(orderId, itemIds) {
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      throw new Error('Item IDs array is required');
    }
    
    const placeholders = itemIds.map(() => '?').join(',');
    const params = [...itemIds, orderId];
    
    const result = await query(`
      UPDATE order_items 
      SET fulfillment_status = 'fulfilled', fulfilled_at = CURRENT_TIMESTAMP 
      WHERE id IN (${placeholders}) AND order_id = ?
    `, params);
    
    // Check if all items are fulfilled
    const [unfulfilled] = await query(`
      SELECT COUNT(*) as count FROM order_items 
      WHERE order_id = ? AND fulfillment_status = 'unfulfilled'
    `, [orderId]);
    
    if (unfulfilled.count === 0) {
      await this.updateFulfillmentStatus(orderId, 'fulfilled');
    } else {
      await this.updateFulfillmentStatus(orderId, 'partial');
    }
    
    return result.affectedRows;
  }
}

module.exports = Order; 