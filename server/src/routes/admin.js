const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Admin dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic statistics
    const [orderStats] = await Order.getOrderStats();
    const [userCount] = await User.findAll({ limit: 1 });
    const [productCount] = await Product.findAll({ limit: 1 });
    
    // Get recent orders
    const recentOrders = await Order.findAll({ limit: 10 });
    
    // Get ministry allocations
    const ministryStats = await Order.getMinistryAllocationStats();

    res.json({
      success: true,
      data: {
        overview: {
          total_orders: orderStats?.total_orders || 0,
          total_revenue: orderStats?.total_revenue || 0,
          average_order_value: orderStats?.average_order_value || 0,
          confirmed_orders: orderStats?.confirmed_orders || 0,
          shipped_orders: orderStats?.shipped_orders || 0,
          delivered_orders: orderStats?.delivered_orders || 0
        },
        recent_orders: recentOrders,
        ministry_allocations: ministryStats,
        summary: {
          total_users: userCount?.length || 0,
          total_products: productCount?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

// Get order analytics
router.get('/analytics/orders', async (req, res) => {
  try {
    const filters = {
      date_from: req.query.date_from,
      date_to: req.query.date_to
    };

    const stats = await Order.getOrderStats(filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order analytics',
      message: error.message
    });
  }
});

// Get ministry allocation analytics
router.get('/analytics/ministry-allocations', async (req, res) => {
  try {
    const filters = {
      date_from: req.query.date_from,
      date_to: req.query.date_to
    };

    const stats = await Order.getMinistryAllocationStats(filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching ministry allocation analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ministry allocation analytics',
      message: error.message
    });
  }
});

// Get abandoned carts
router.get('/abandoned-carts', async (req, res) => {
  try {
    const filters = {
      hours_ago: req.query.hours_ago || 24,
      has_email: req.query.has_email === 'true',
      limit: req.query.limit || 50
    };

    const abandonedCarts = await Cart.getAbandonedCarts(filters);

    res.json({
      success: true,
      data: abandonedCarts
    });
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch abandoned carts',
      message: error.message
    });
  }
});

// Cleanup expired carts
router.delete('/cleanup-carts', async (req, res) => {
  try {
    const cartsRemoved = await Cart.cleanupExpiredCarts();

    res.json({
      success: true,
      message: 'Expired carts cleaned up successfully',
      data: {
        carts_removed: cartsRemoved
      }
    });
  } catch (error) {
    console.error('Error cleaning up carts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired carts',
      message: error.message
    });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    const { testConnection } = require('../config/database');
    const dbConnected = await testConnection();

    res.json({
      success: true,
      data: {
        database: dbConnected ? 'Connected' : 'Disconnected',
        server: 'Running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({
      success: false,
      error: 'System health check failed',
      message: error.message
    });
  }
});

module.exports = router; 