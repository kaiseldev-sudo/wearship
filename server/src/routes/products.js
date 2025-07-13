const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category_id,
      is_featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
      is_active: req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined,
      is_pre_order: req.query.pre_order === 'true' ? true : req.query.pre_order === 'false' ? false : undefined,
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const products = await Product.findAll(filters);

    res.json({
      success: true,
      data: products,
      meta: {
        total: products.length,
        page: req.query.page || 1,
        limit: req.query.limit || null
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findAll({ 
      is_featured: true, 
      is_active: true,
      limit: req.query.limit || 10
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

// Get product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.getCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q: search, limit = 10, offset = 0 } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const products = await Product.findAll({
      search,
      is_active: true,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: products,
      meta: {
        search_term: search,
        total: products.length
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search products',
      message: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is numeric
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(parseInt(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// Get product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// Get product variants
router.get('/:id/variants', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    const variants = await Product.getProductVariants(parseInt(id));

    res.json({
      success: true,
      data: variants
    });
  } catch (error) {
    console.error('Error fetching product variants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product variants',
      message: error.message
    });
  }
});

// Get product images
router.get('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    const images = await Product.getProductImages(parseInt(id));

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product images',
      message: error.message
    });
  }
});

// Check inventory for variant
router.get('/:id/variants/:variantId/inventory', async (req, res) => {
  try {
    const { id, variantId } = req.params;
    const { quantity = 1 } = req.query;

    if (!/^\d+$/.test(id) || !/^\d+$/.test(variantId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    const inventoryCheck = await Product.checkInventory(
      parseInt(variantId), 
      parseInt(quantity)
    );

    res.json({
      success: true,
      data: inventoryCheck
    });
  } catch (error) {
    console.error('Error checking inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check inventory',
      message: error.message
    });
  }
});

// Admin routes (basic implementation - would need proper authentication middleware)

// Create new product
router.post('/', async (req, res) => {
  try {
    const productData = req.body;

    // Basic validation
    if (!productData.name || !productData.slug || !productData.base_price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, slug, base_price'
      });
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle duplicate slug error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'Product slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    const updated = await Product.update(parseInt(id), updateData);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or no changes made'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// Delete product (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    const deleted = await Product.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

// Create product variant
router.post('/:id/variants', async (req, res) => {
  try {
    const { id } = req.params;
    const variantData = { ...req.body, productId: parseInt(id) };

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    if (!variantData.title) {
      return res.status(400).json({
        success: false,
        error: 'Variant title is required'
      });
    }

    const variant = await Product.createVariant(variantData);

    res.status(201).json({
      success: true,
      message: 'Product variant created successfully',
      data: variant
    });
  } catch (error) {
    console.error('Error creating product variant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product variant',
      message: error.message
    });
  }
});

// Update inventory
router.patch('/:id/variants/:variantId/inventory', async (req, res) => {
  try {
    const { id, variantId } = req.params;
    const { quantity, operation = 'set' } = req.body;

    if (!/^\d+$/.test(id) || !/^\d+$/.test(variantId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid quantity is required'
      });
    }

    const updated = await Product.updateInventory(
      parseInt(variantId), 
      parseInt(quantity), 
      operation
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Product variant not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory updated successfully'
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update inventory',
      message: error.message
    });
  }
});

module.exports = router; 