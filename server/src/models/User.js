const { query, transaction } = require('../config/database');
const bcrypt = require('bcryptjs');
const axios = require('axios');

class User {
  // Find user by email
  static async findByEmail(email) {
    const sql = `
      SELECT 
        id, email, password_hash, first_name, last_name, phone,
        date_of_birth, email_verified_at, status, created_at, updated_at
      FROM users 
      WHERE email = ? AND deleted_at IS NULL
    `;
    
    const [user] = await query(sql, [email]);
    return user || null;
  }
  
  // Find user by ID
  static async findById(id) {
    const sql = `
      SELECT 
        id, email, first_name, last_name, phone, date_of_birth,
        email_verified_at, status, created_at, updated_at
      FROM users 
      WHERE id = ? AND deleted_at IS NULL
    `;
    
    const [user] = await query(sql, [id]);
    if (!user) return null;
    
    // Get user addresses
    user.addresses = await this.getUserAddresses(id);
    
    return user;
  }
  
  // Get all users with filters
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        id, email, first_name, last_name, phone, date_of_birth,
        email_verified_at, status, created_at, updated_at
      FROM users 
      WHERE deleted_at IS NULL
    `;
    
    const params = [];
    
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    
    if (filters.search) {
      sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }
    }
    
    return await query(sql, params);
  }
  
  // Create new user
  static async create(userData) {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      date_of_birth
    } = userData;
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const sql = `
      INSERT INTO users (
        email, password_hash, first_name, last_name, phone, date_of_birth, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [email, password_hash, first_name, last_name, phone || null, date_of_birth || null, 'inactive'];
    
    try {
      const result = await query(sql, params);
      return {
        id: result.insertId,
        email,
        first_name,
        last_name,
        phone,
        date_of_birth,
        status: ' '
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }
  
  // Update user
  static async update(id, userData) {
    const allowedFields = [
      'first_name', 'last_name', 'phone', 'date_of_birth', 'status'
    ];
    
    const fields = [];
    const params = [];
    
    Object.keys(userData).forEach(key => {
      if (allowedFields.includes(key) && userData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(userData[key]);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }
  
  // Update password
  static async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    const sql = 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await query(sql, [password_hash, id]);
    return result.affectedRows > 0;
  }
  
  // Verify password
  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return false;
    
    return await bcrypt.compare(password, user.password_hash);
  }
  
  // Set email verification
  static async setEmailVerified(id) {
    const sql = `
      UPDATE users 
      SET email_verified_at = CURRENT_TIMESTAMP, 
          email_verification_token = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
  
  // Set password reset token
  static async setPasswordResetToken(email, token, expiresAt) {
    const sql = `
      UPDATE users 
      SET password_reset_token = ?, 
          password_reset_expires_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `;
    
    const result = await query(sql, [token, expiresAt, email]);
    return result.affectedRows > 0;
  }
  
  // Verify password reset token
  static async verifyPasswordResetToken(token) {
    const sql = `
      SELECT id, email, first_name, last_name
      FROM users 
      WHERE password_reset_token = ? 
        AND password_reset_expires_at > NOW()
        AND deleted_at IS NULL
    `;
    
    const [user] = await query(sql, [token]);
    return user || null;
  }
  
  // Clear password reset token
  static async clearPasswordResetToken(id) {
    const sql = `
      UPDATE users 
      SET password_reset_token = NULL, 
          password_reset_expires_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
  
  // Soft delete user
  static async delete(id) {
    const sql = 'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
  
  // Get user addresses
  static async getUserAddresses(userId) {
    const sql = `
      SELECT * FROM user_addresses 
      WHERE user_id = ? 
      ORDER BY is_default DESC, type ASC, created_at ASC
    `;
    
    return await query(sql, [userId]);
  }
  
  // Add user address
  static async addAddress(userId, addressData) {
    const {
      type,
      is_default = false,
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country = 'United States'
    } = addressData;
    
    const queries = [];
    
    // If this is being set as default, unset other defaults appropriately
    if (is_default) {
      if (type === 'both') {
        // If setting 'both' as default, unset all other defaults
        queries.push({
          sql: 'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
          params: [userId]
        });
      } else {
        // If setting billing/shipping as default, unset same type and 'both' defaults
        queries.push({
          sql: 'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND (type = ? OR type = ?)',
          params: [userId, type, 'both']
        });
      }
    }
    
    // Insert new address
    queries.push({
      sql: `
        INSERT INTO user_addresses (
          user_id, type, is_default, first_name, last_name, company,
          address_line_1, address_line_2, city, state, postal_code, country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        userId, type, is_default, first_name, last_name, company || null,
        address_line_1, address_line_2 || null, city, state, postal_code, country
      ]
    });
    
    const results = await transaction(queries);
    const insertResult = results[results.length - 1];
    
    return {
      id: insertResult.insertId,
      ...addressData
    };
  }
  
  // Update user address
  static async updateAddress(userId, addressId, addressData) {
    const allowedFields = [
      'type', 'is_default', 'first_name', 'last_name', 'company',
      'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country'
    ];
    
    const fields = [];
    const params = [];
    
    Object.keys(addressData).forEach(key => {
      if (allowedFields.includes(key) && addressData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(addressData[key]);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(userId, addressId);
    
    const sql = `UPDATE user_addresses SET ${fields.join(', ')} WHERE user_id = ? AND id = ?`;
    
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }
  
  // Delete user address
  static async deleteAddress(userId, addressId) {
    const sql = 'DELETE FROM user_addresses WHERE user_id = ? AND id = ?';
    const result = await query(sql, [userId, addressId]);
    return result.affectedRows > 0;
  }
  
  // Set default address
  static async setDefaultAddress(userId, addressId, type) {
    let unsetQuery;
    
    if (type === 'both') {
      // If setting 'both' as default, unset all other defaults
      unsetQuery = {
        sql: 'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        params: [userId]
      };
    } else {
      // If setting billing/shipping as default, unset same type and 'both' defaults
      unsetQuery = {
        sql: 'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND (type = ? OR type = ?)',
        params: [userId, type, 'both']
      };
    }
    
    const queries = [
      unsetQuery,
      {
        sql: 'UPDATE user_addresses SET is_default = TRUE WHERE user_id = ? AND id = ?',
        params: [userId, addressId]
      }
    ];
    
    const results = await transaction(queries);
    return results[1].affectedRows > 0;
  }
  
  // Get user's order history
  static async getOrderHistory(userId, filters = {}) {
    let sql = `
      SELECT 
        o.id, o.order_number, o.status, o.payment_status, 
        o.fulfillment_status, o.total_amount, o.currency,
        o.created_at, o.updated_at, o.confirmed_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    
    const params = [userId];
    
    if (filters.status) {
      sql += ' AND o.status = ?';
      params.push(filters.status);
    }
    
    sql += ' GROUP BY o.id ORDER BY o.created_at DESC';
    
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }
    
    return await query(sql, params);
  }
  
  // Get user statistics
  static async getUserStats(userId) {
    const stats = {};
    
    // Total orders
    const [orderStats] = await query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_spent
      FROM orders 
      WHERE user_id = ?
    `, [userId]);
    
    // Total addresses
    const [addressCount] = await query('SELECT COUNT(*) as total_addresses FROM user_addresses WHERE user_id = ?', [userId]);
    
    return {
      ...orderStats,
      total_addresses: addressCount.total_addresses
    };
  }
}

module.exports = User; 