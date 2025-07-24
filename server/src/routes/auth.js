const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, date_of_birth } = req.body;

    // Basic validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, password, first_name, last_name'
      });
    }

    // Email format validation (regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // --- Abstract API Email Validation ---
    const apiKey = 'f5e9397ad9eb4c7dbacc31d58585c60d'; // Use your real API key
    const validationUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
    try {
      const validationResponse = await axios.get(validationUrl);
      const data = validationResponse.data;

      // Check for deliverability and format
      if (!data.is_valid_format.value) {
        return res.status(400).json({
          success: false,
          error: 'Email address format is invalid.'
        });
      }
      if (data.is_disposable_email.value) {
        return res.status(400).json({
          success: false,
          error: 'Disposable email addresses are not allowed.'
        });
      }
      if (data.deliverability !== 'DELIVERABLE') {
        return res.status(400).json({
          success: false,
          error: 'Email address is not deliverable. Please use a valid email.'
        });
      }
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Failed to validate email address. Please try again later.'
      });
    }
    // --- End Abstract API Email Validation ---

    // Password length validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Password strength validation (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      first_name,
      last_name,
      phone,
      date_of_birth
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to register user',
      message: error.message
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Verify password
    const isValid = await User.verifyPassword(email.toLowerCase(), password);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user details
    const user = await User.findByEmail(email.toLowerCase());
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account is not active'
      });
    }

    // In a real app, you'd generate and return a JWT token here
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          status: user.status
        },
        // token: 'jwt_token_would_go_here'
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
      message: error.message
    });
  }
});

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = await User.findByEmail(email.toLowerCase());
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (in a real app, you'd generate a proper token)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.setPasswordResetToken(email.toLowerCase(), resetToken, expiresAt);

    // In a real app, you'd send an email with the reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Error processing forgot password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request',
      message: error.message
    });
  }
});

// Password reset confirmation
router.post('/reset-password', async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const user = await User.verifyPasswordResetToken(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    await User.updatePassword(user.id, new_password);
    await User.clearPasswordResetToken(user.id);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      message: error.message
    });
  }
});

module.exports = router; 