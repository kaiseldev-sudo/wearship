const { query, transaction } = require('../config/database');

class Product {
  // Get all products with filters
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        pi.url as primary_image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE p.deleted_at IS NULL
    `;
    
    const params = [];
    
    if (filters.category_id) {
      sql += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }
    
    if (filters.is_featured !== undefined) {
      sql += ' AND p.is_featured = ?';
      params.push(filters.is_featured);
    }
    
    if (filters.is_active !== undefined) {
      sql += ' AND p.is_active = ?';
      params.push(filters.is_active);
    }
    
    if (filters.is_pre_order !== undefined) {
      sql += ' AND p.is_pre_order = ?';
      params.push(filters.is_pre_order);
    }
    
    if (filters.search) {
      sql += ' AND (MATCH(p.name, p.description, p.short_description) AGAINST (? IN NATURAL LANGUAGE MODE) OR p.name LIKE ?)';
      params.push(filters.search, `%${filters.search}%`);
    }
    
    sql += ' ORDER BY p.sort_order ASC, p.created_at DESC';
    
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
  
  // Get single product with full details
  static async findById(id) {
    const productSql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `;
    
    const [product] = await query(productSql, [id]);
    if (!product) return null;
    
    // Parse thumbnails JSON if it exists
    if (product.thumbnails) {
      try {
        product.thumbnails = JSON.parse(product.thumbnails);
      } catch (error) {
        console.error('Error parsing thumbnails JSON:', error);
        product.thumbnails = [];
      }
    } else {
      product.thumbnails = [];
    }
    
    // Get product variants
    product.variants = await this.getProductVariants(id);
    
    // Get product images
    product.images = await this.getProductImages(id);
    
    // Get product options
    product.options = await this.getProductOptions(id);
    
    return product;
  }
  
  // Get product by slug
  static async findBySlug(slug) {
    const productSql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.deleted_at IS NULL
    `;
    
    const [product] = await query(productSql, [slug]);
    if (!product) return null;
    
    // Parse thumbnails JSON if it exists
    if (product.thumbnails) {
      try {
        product.thumbnails = JSON.parse(product.thumbnails);
      } catch (error) {
        console.error('Error parsing thumbnails JSON:', error);
        product.thumbnails = [];
      }
    } else {
      product.thumbnails = [];
    }
    
    // Get additional details
    product.variants = await this.getProductVariants(product.id);
    product.images = await this.getProductImages(product.id);
    product.options = await this.getProductOptions(product.id);
    
    return product;
  }
  
  // Get product variants
  static async getProductVariants(productId) {
    const sql = `
      SELECT 
        pv.*,
        GROUP_CONCAT(
          CONCAT(po.name, ':', pov.value)
          ORDER BY po.position
          SEPARATOR ', '
        ) as option_details
      FROM product_variants pv
      LEFT JOIN variant_option_values vov ON pv.id = vov.variant_id
      LEFT JOIN product_option_values pov ON vov.option_value_id = pov.id
      LEFT JOIN product_options po ON pov.option_id = po.id
      WHERE pv.product_id = ? AND pv.is_active = TRUE
      GROUP BY pv.id
      ORDER BY pv.position ASC
    `;
    
    return await query(sql, [productId]);
  }
  
  // Get product images
  static async getProductImages(productId) {
    const sql = `
      SELECT * FROM product_images 
      WHERE product_id = ? 
      ORDER BY position ASC
    `;
    
    return await query(sql, [productId]);
  }
  
    // Get product options
  static async getProductOptions(productId) {
    // First get all options for the product
    const optionsSql = `
      SELECT * FROM product_options 
      WHERE product_id = ?
      ORDER BY position ASC
    `;
    
    const options = await query(optionsSql, [productId]);
    
    // Then get values for each option
    for (const option of options) {
      const valuesSql = `
        SELECT id, value, position 
        FROM product_option_values 
        WHERE option_id = ?
        ORDER BY position ASC
      `;
      
      option.values = await query(valuesSql, [option.id]);
    }
    
    return options;
  }

  // Update product thumbnails
  static async updateThumbnails(productId) {
    const thumbnailsSql = `
      SELECT url 
      FROM product_images 
      WHERE product_id = ? AND is_primary = FALSE
      ORDER BY position ASC
    `;
    
    const thumbnails = await query(thumbnailsSql, [productId]);
    const thumbnailUrls = thumbnails.map(img => img.url);
    
    const updateSql = `
      UPDATE products 
      SET thumbnails = ? 
      WHERE id = ?
    `;
    
    await query(updateSql, [JSON.stringify(thumbnailUrls), productId]);
    
    return thumbnailUrls;
  }
  
  // Create new product
  static async create(productData) {
    const {
      name,
      slug,
      description,
      short_description,
      sku,
      base_price,
      compare_at_price,
      cost_price,
      weight,
      category_id,
      brand,
      tags,
      is_active = true,
      is_featured = false,
      is_pre_order = false,
      pre_order_message,
      estimated_shipping_date,
      meta_title,
      meta_description,
      inventory_tracking = true,
      inventory_quantity = 0,
      low_stock_threshold = 10,
      allow_backorders = false,
      requires_shipping = true,
      is_digital = false,
      sort_order = 0
    } = productData;
    
    const sql = `
      INSERT INTO products (
        name, slug, description, short_description, sku, base_price,
        compare_at_price, cost_price, weight, category_id, brand, tags,
        is_active, is_featured, is_pre_order, pre_order_message,
        estimated_shipping_date, meta_title, meta_description,
        inventory_tracking, inventory_quantity, low_stock_threshold,
        allow_backorders, requires_shipping, is_digital, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      name, slug, description, short_description, sku, base_price,
      compare_at_price, cost_price, weight, category_id, brand,
      JSON.stringify(tags), is_active, is_featured, is_pre_order,
      pre_order_message, estimated_shipping_date, meta_title,
      meta_description, inventory_tracking, inventory_quantity,
      low_stock_threshold, allow_backorders, requires_shipping,
      is_digital, sort_order
    ];
    
    const result = await query(sql, params);
    return { id: result.insertId, ...productData };
  }
  
  // Update product
  static async update(id, productData) {
    const fields = [];
    const params = [];
    
    Object.keys(productData).forEach(key => {
      if (productData[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'tags') {
          params.push(JSON.stringify(productData[key]));
        } else {
          params.push(productData[key]);
        }
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }
  
  // Soft delete product
  static async delete(id) {
    const sql = 'UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
  
  // Get product categories
  static async getCategories() {
    const sql = `
      SELECT * FROM categories 
      WHERE is_active = TRUE 
      ORDER BY sort_order ASC, name ASC
    `;
    
    return await query(sql);
  }
  
  // Create product variant
  static async createVariant(variantData) {
    const {
      product_id,
      sku,
      title,
      price,
      compare_at_price,
      cost_price,
      weight,
      inventory_quantity = 0,
      inventory_tracking = true,
      allow_backorders = false,
      position = 0,
      is_active = true
    } = variantData;
    
    const sql = `
      INSERT INTO product_variants (
        product_id, sku, title, price, compare_at_price, cost_price,
        weight, inventory_quantity, inventory_tracking, allow_backorders,
        position, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      product_id, sku, title, price, compare_at_price, cost_price,
      weight, inventory_quantity, inventory_tracking, allow_backorders,
      position, is_active
    ];
    
    const result = await query(sql, params);
    return { id: result.insertId, ...variantData };
  }
  
  // Update inventory
  static async updateInventory(variantId, quantity, operation = 'set') {
    let sql;
    
    if (operation === 'increment') {
      sql = 'UPDATE product_variants SET inventory_quantity = inventory_quantity + ? WHERE id = ?';
    } else if (operation === 'decrement') {
      sql = 'UPDATE product_variants SET inventory_quantity = GREATEST(0, inventory_quantity - ?) WHERE id = ?';
    } else {
      sql = 'UPDATE product_variants SET inventory_quantity = ? WHERE id = ?';
    }
    
    const result = await query(sql, [quantity, variantId]);
    return result.affectedRows > 0;
  }
  
  // Check inventory availability
  static async checkInventory(variantId, requiredQuantity) {
    const sql = `
      SELECT 
        inventory_quantity,
        allow_backorders,
        inventory_tracking
      FROM product_variants 
      WHERE id = ? AND is_active = TRUE
    `;
    
    const [variant] = await query(sql, [variantId]);
    if (!variant) return { available: false, reason: 'Variant not found' };
    
    if (!variant.inventory_tracking) {
      return { available: true, reason: 'Inventory not tracked' };
    }
    
    if (variant.inventory_quantity >= requiredQuantity) {
      return { available: true, reason: 'In stock' };
    }
    
    if (variant.allow_backorders) {
      return { available: true, reason: 'Backorder allowed' };
    }
    
    return {
      available: false,
      reason: 'Insufficient inventory',
      available_quantity: variant.inventory_quantity
    };
  }
}

module.exports = Product; 