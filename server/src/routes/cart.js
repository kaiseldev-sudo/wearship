const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Helper function to get cart identifier
const getCartIdentifier = (req) => {
  // In a real app, you'd get userId from JWT token
  const userId = req.headers['x-user-id'] ? parseInt(req.headers['x-user-id']) : null;
  const sessionId = req.headers['x-session-id'] || req.sessionID || 'guest-session';
  
  return { userId, sessionId };
};

// Get cart with items
router.get('/', async (req, res) => {
  try {
    const { userId, sessionId } = getCartIdentifier(req);
    
    const cart = await Cart.getOrCreateCart(userId, sessionId);
    const cartWithItems = await Cart.getCartWithItems(cart.id);
    const totals = await Cart.getCartTotals(cart.id);

    res.json({
      success: true,
      data: {
        ...cartWithItems,
        totals
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart',
      message: error.message
    });
  }
});

// Add item to cart
router.post('/items', async (req, res) => {
  try {
    const { userId, sessionId } = getCartIdentifier(req);
    const { product_id, variant_id, custom_design_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.getOrCreateCart(userId, sessionId);
    
    const item = await Cart.addItem(cart.id, {
      product_id: parseInt(product_id),
      variant_id: variant_id ? parseInt(variant_id) : null,
      custom_design_id: custom_design_id ? parseInt(custom_design_id) : null,
      quantity: parseInt(quantity)
    });

    // Get updated cart totals
    const totals = await Cart.getCartTotals(cart.id);

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        item,
        totals
      }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    
    if (error.message.includes('inventory') || error.message.includes('not found')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
      message: error.message
    });
  }
});

// Update cart item quantity
router.put('/items/:itemId', async (req, res) => {
  try {
    const { userId, sessionId } = getCartIdentifier(req);
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!/^\d+$/.test(itemId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid item ID format'
      });
    }

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid quantity is required'
      });
    }

    const cart = await Cart.getOrCreateCart(userId, sessionId);
    
    const updated = await Cart.updateItemQuantity(
      cart.id, 
      parseInt(itemId), 
      parseInt(quantity)
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // Get updated cart totals
    const totals = await Cart.getCartTotals(cart.id);

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: { totals }
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    
    if (error.message.includes('inventory')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update cart item',
      message: error.message
    });
  }
});

// Remove item from cart
router.delete('/items/:itemId', async (req, res) => {
  try {
    const { userId, sessionId } = getCartIdentifier(req);
    const { itemId } = req.params;

    if (!/^\d+$/.test(itemId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid item ID format'
      });
    }

    const cart = await Cart.getOrCreateCart(userId, sessionId);
    
    const removed = await Cart.removeItem(cart.id, parseInt(itemId));

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // Get updated cart totals
    const totals = await Cart.getCartTotals(cart.id);

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: { totals }
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove cart item',
      message: error.message
    });
  }
});

// Clear entire cart
router.delete('/', async (req, res) => {
  try {
    const { userId, sessionId } = getCartIdentifier(req);
    
    const cart = await Cart.getOrCreateCart(userId, sessionId);
    const itemsRemoved = await Cart.clearCart(cart.id);

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items_removed: itemsRemoved
      }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      message: error.message
    });
  }
});

// Get cart totals
router.get('/totals', async (req, res) => {
  try {
    const { userId, sessionId } = getCartIdentifier(req);
    
    const cart = await Cart.getOrCreateCart(userId, sessionId);
    const totals = await Cart.getCartTotals(cart.id);

    res.json({
      success: true,
      data: totals
    });
  } catch (error) {
    console.error('Error fetching cart totals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart totals',
      message: error.message
    });
  }
});

// Transfer guest cart to user account (when user logs in)
router.post('/transfer', async (req, res) => {
  try {
    const { session_id, user_id } = req.body;

    if (!session_id || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and User ID are required'
      });
    }

    const cartId = await Cart.transferGuestCartToUser(session_id, parseInt(user_id));

    if (!cartId) {
      return res.status(404).json({
        success: false,
        error: 'No guest cart found to transfer'
      });
    }

    res.json({
      success: true,
      message: 'Cart transferred successfully',
      data: {
        cart_id: cartId
      }
    });
  } catch (error) {
    console.error('Error transferring cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transfer cart',
      message: error.message
    });
  }
});

// Update cart expiration (extend cart life)
router.patch('/extend', async (req, res) => {
  try {
    const { userId, sessionId } = getCartIdentifier(req);
    const { days = 30 } = req.body;

    const cart = await Cart.getOrCreateCart(userId, sessionId);
    const updated = await Cart.updateExpiration(cart.id, parseInt(days));

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    res.json({
      success: true,
      message: `Cart expiration extended by ${days} days`
    });
  } catch (error) {
    console.error('Error extending cart expiration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to extend cart expiration',
      message: error.message
    });
  }
});

module.exports = router; 