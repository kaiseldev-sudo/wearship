const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [reviews, stats] = await Promise.all([
      Review.getByProductId(productId, parseInt(limit), offset),
      Review.getProductStats(productId)
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        stats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: stats.total_reviews
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Create a new review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!product_id || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const review = await Review.create({
      user_id,
      product_id,
      rating,
      title,
      comment
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    
    if (error.message === 'You have already reviewed this product') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
});

// Get user's review for a product
router.get('/user/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const review = await Review.getUserReview(userId, productId);

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user review'
    });
  }
});

// Update a review
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user owns the review
    const existingReview = await Review.getUserReview(userId, req.body.product_id);
    if (!existingReview || existingReview.id != reviewId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    const review = await Review.update(reviewId, {
      rating,
      title,
      comment
    });

    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

// Delete a review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Check if user owns the review
    const existingReview = await Review.getUserReview(userId, req.body.product_id);
    if (!existingReview || existingReview.id != reviewId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    await Review.delete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', async (req, res) => {
  try {
    const { reviewId } = req.params;

    await Review.markHelpful(reviewId);

    res.json({
      success: true,
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful'
    });
  }
});

module.exports = router; 