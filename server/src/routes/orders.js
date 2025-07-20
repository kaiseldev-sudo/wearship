const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders with filtering
router.get('/', async (req, res) => {
  try {
    const filters = {
      user_id: req.query.user_id,
      status: req.query.status,
      payment_status: req.query.payment_status,
      fulfillment_status: req.query.fulfillment_status,
      search: req.query.search,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      limit: req.query.limit,
      offset: req.query.offset
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const orders = await Order.findAll(filters);

    res.json({
      success: true,
      data: orders,
      meta: {
        total: orders.length,
        filters: filters
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(parseInt(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

// Get order by order number
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findByOrderNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order by number:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

// Create order from cart (checkout)
router.post('/checkout', async (req, res) => {
  try {
    const {
      cart_id,
      user_id,
      email,
      billing_address,
      shipping_address,
      payment_method = 'paypal',
      notes
    } = req.body;

    // Basic validation
    if (!cart_id || !email || !billing_address || !shipping_address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: cart_id, email, billing_address, shipping_address'
      });
    }

    // Validate addresses have required fields
    const requiredAddressFields = ['first_name', 'last_name', 'address_line_1', 'city', 'state', 'postal_code', 'country'];
    
    for (const field of requiredAddressFields) {
      if (!billing_address[field] || !shipping_address[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required address field: ${field}`
        });
      }
    }

    const order = await Order.createFromCart(parseInt(cart_id), {
      user_id: user_id ? parseInt(user_id) : null,
      email,
      billing_address,
      shipping_address,
      payment_method,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error.message === 'Cart is empty') {
      return res.status(400).json({
        success: false,
        error: 'Cannot create order from empty cart'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const updated = await Order.updateStatus(parseInt(id), status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    
    if (error.message.includes('Invalid')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: error.message
    });
  }
});

// Update payment status
router.patch('/:id/payment-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!payment_status) {
      return res.status(400).json({
        success: false,
        error: 'Payment status is required'
      });
    }

    const updated = await Order.updatePaymentStatus(parseInt(id), payment_status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // If payment is successful, allocate ministry profits
    if (payment_status === 'paid') {
      try {
        const allocations = await Order.allocateMinistryProfits(parseInt(id));
        console.log('Ministry allocations created:', allocations);
      } catch (allocationError) {
        console.error('Error allocating ministry profits:', allocationError);
        // Don't fail the payment status update if allocation fails
      }
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    
    if (error.message.includes('Invalid')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update payment status',
      message: error.message
    });
  }
});

// Add payment transaction
router.post('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    const transactionData = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!transactionData.transaction_id || !transactionData.payment_method || !transactionData.amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: transaction_id, payment_method, amount'
      });
    }

    const transactionId = await Order.addPaymentTransaction(parseInt(id), transactionData);

    res.status(201).json({
      success: true,
      message: 'Payment transaction added successfully',
      data: {
        transaction_id: transactionId
      }
    });
  } catch (error) {
    console.error('Error adding payment transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add payment transaction',
      message: error.message
    });
  }
});

// Complete PayPal payment
router.post('/:id/paypal-complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { paypalOrderDetails, paypalOrderId } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!paypalOrderDetails || !paypalOrderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: paypalOrderDetails, paypalOrderId'
      });
    }

    // Extract payment details from PayPal response
    const paymentDetails = {
      transaction_id: paypalOrderId,
      payment_method: 'paypal',
      payment_type: 'payment',
      amount: paypalOrderDetails.purchase_units?.[0]?.amount?.value || '0.00',
      currency: paypalOrderDetails.purchase_units?.[0]?.amount?.currency_code || 'USD',
      status: 'completed',
      gateway_response: paypalOrderDetails,
      processed_at: new Date()
    };

    // Add payment transaction to database
    const transactionId = await Order.addPaymentTransaction(parseInt(id), paymentDetails);

    // Update order payment status to paid
    await Order.updatePaymentStatus(parseInt(id), 'paid');

    // Allocate ministry profits
    try {
      const allocations = await Order.allocateMinistryProfits(parseInt(id));
      console.log('Ministry allocations created:', allocations);
    } catch (allocationError) {
      console.error('Error allocating ministry profits:', allocationError);
    }

    res.json({
      success: true,
      message: 'PayPal payment completed successfully',
      data: {
        transaction_id: transactionId,
        order_id: id,
        paypal_order_id: paypalOrderId
      }
    });
  } catch (error) {
    console.error('Error completing PayPal payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete PayPal payment',
      message: error.message
    });
  }
});

// Fulfill order items
router.post('/:id/fulfill', async (req, res) => {
  try {
    const { id } = req.params;
    const { item_ids } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Item IDs array is required'
      });
    }

    const itemsFulfilled = await Order.fulfillItems(parseInt(id), item_ids);

    res.json({
      success: true,
      message: 'Order items fulfilled successfully',
      data: {
        items_fulfilled: itemsFulfilled
      }
    });
  } catch (error) {
    console.error('Error fulfilling order items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fulfill order items',
      message: error.message
    });
  }
});

// Get order statistics
router.get('/stats/overview', async (req, res) => {
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
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order statistics',
      message: error.message
    });
  }
});

// Get ministry allocation statistics
router.get('/stats/ministry-allocations', async (req, res) => {
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
    console.error('Error fetching ministry allocation stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ministry allocation statistics',
      message: error.message
    });
  }
});

module.exports = router; 