const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || !/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const wishlist = await Wishlist.getUserWishlist(parseInt(userId));

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wishlist',
      message: error.message
    });
  }
});

// Add item to wishlist
router.post('/:userId/items', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;
    
    if (!userId || !/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    const result = await Wishlist.addToWishlist(parseInt(userId), parseInt(productId));

    res.json({
      success: true,
      message: 'Item added to wishlist',
      data: result
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: 'Item already in wishlist'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to add to wishlist',
      message: error.message
    });
  }
});

// Remove item from wishlist
router.delete('/:userId/items/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    if (!userId || !/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    if (!productId || !/^\d+$/.test(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    const result = await Wishlist.removeFromWishlist(parseInt(userId), parseInt(productId));

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from wishlist',
      message: error.message
    });
  }
});

// Check if item is in wishlist
router.get('/:userId/items/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    if (!userId || !/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    if (!productId || !/^\d+$/.test(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    const isInWishlist = await Wishlist.isInWishlist(parseInt(userId), parseInt(productId));

    res.json({
      success: true,
      data: { isInWishlist }
    });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check wishlist status',
      message: error.message
    });
  }
});

// Clear entire wishlist
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || !/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const result = await Wishlist.clearWishlist(parseInt(userId));

    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: { itemsRemoved: result }
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear wishlist',
      message: error.message
    });
  }
});

module.exports = router; 