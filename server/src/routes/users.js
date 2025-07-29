const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
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

    const users = await User.findAll(filters);

    res.json({
      success: true,
      data: users,
      meta: {
        total: users.length,
        filters: filters
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Get single user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    const user = await User.findById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    const updated = await User.update(parseInt(id), updateData);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'User not found or no changes made'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// Delete user (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    const deleted = await User.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

// Get user addresses
router.get('/:id/addresses', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    const addresses = await User.getUserAddresses(parseInt(id));

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user addresses',
      message: error.message
    });
  }
});

// Add user address
router.post('/:id/addresses', async (req, res) => {
  try {
    const { id } = req.params;
    const addressData = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    // Basic validation
    const requiredFields = ['type', 'first_name', 'last_name', 'address_line_1', 'city', 'province', 'postal_code'];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        });
      }
    }

    const address = await User.addAddress(parseInt(id), addressData);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address
    });
  } catch (error) {
    console.error('Error adding user address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add address',
      message: error.message
    });
  }
});

// Update user address
router.put('/:id/addresses/:addressId', async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const updateData = req.body;

    if (!/^\d+$/.test(id) || !/^\d+$/.test(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    const updated = await User.updateAddress(parseInt(id), parseInt(addressId), updateData);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Address not found or no changes made'
      });
    }

    res.json({
      success: true,
      message: 'Address updated successfully'
    });
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update address',
      message: error.message
    });
  }
});

// Delete user address
router.delete('/:id/addresses/:addressId', async (req, res) => {
  try {
    const { id, addressId } = req.params;

    if (!/^\d+$/.test(id) || !/^\d+$/.test(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    const deleted = await User.deleteAddress(parseInt(id), parseInt(addressId));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete address',
      message: error.message
    });
  }
});

// Set default address
router.patch('/:id/addresses/:addressId/set-default', async (req, res) => {
  try {
    const { id, addressId } = req.params;

    if (!/^\d+$/.test(id) || !/^\d+$/.test(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    // First get the address to determine its type
    const addresses = await User.getUserAddresses(parseInt(id));
    const address = addresses.find(addr => addr.id == parseInt(addressId));
    
    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    const updated = await User.setDefaultAddress(parseInt(id), parseInt(addressId), address.type);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Failed to set default address'
      });
    }

    res.json({
      success: true,
      message: 'Default address set successfully'
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set default address',
      message: error.message
    });
  }
});

// Get user order history
router.get('/:id/orders', async (req, res) => {
  try {
    const { id } = req.params;
    const filters = {
      status: req.query.status,
      limit: req.query.limit
    };

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    const orders = await User.getOrderHistory(parseInt(id), filters);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user orders',
      message: error.message
    });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    const stats = await User.getUserStats(parseInt(id));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics',
      message: error.message
    });
  }
});

module.exports = router; 