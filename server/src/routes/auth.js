const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
require('dotenv').config();
const { sendVerificationEmail } = require('../lib/mailer');
const crypto = require('crypto');

const apiKey = process.env.VITE_ABSTRACT_API_KEY;

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
    const validationUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
    try {
      const validationResponse = await axios.get(validationUrl);
      const data = validationResponse.data;

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

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      });
    }

    // Register user with email verification (atomic operation)
    const user = await User.registerWithEmailVerification({
      email: email.toLowerCase(),
      password,
      first_name,
      last_name,
      phone,
      date_of_birth
    }, sendVerificationEmail);

    // Success
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
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
    if (error.message === 'Failed to send verification email') {
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email. Please try again later.'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
      message: error.message
    });
  }
});

// Test email configuration
router.get('/test-email', async (req, res) => {
  try {
    const testEmail = 'test@example.com';
    const testToken = 'test-token-123';
    
    await sendVerificationEmail(testEmail, testToken);
    
    res.json({
      success: true,
      message: 'Email service is working correctly'
    });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Email service is not working',
      message: error.message
    });
  }
});

// Phone validation endpoint
router.get('/validate-phone', async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    const phoneApiKey = process.env.ABSTRACT_PHONE_API_KEY;
    if (!phoneApiKey) {
      return res.status(500).json({
        success: false,
        error: 'Phone validation service is not configured'
      });
    }

    // Basic Philippines mobile number validation
    const philippinesMobileRegex = /^(09|\+639)\d{9}$/;
    const cleanPhone = phone.replace(/\s+/g, ''); // Remove spaces
    
    if (!philippinesMobileRegex.test(cleanPhone)) {
      return res.json({
        phone: cleanPhone,
        valid: false,
        format: {
          international: cleanPhone.startsWith('09') ? `+63${cleanPhone.slice(1)}` : cleanPhone,
          local: cleanPhone
        },
        country: {
          code: 'PH',
          name: 'Philippines',
          prefix: '+63'
        },
        location: 'Philippines',
        type: 'mobile',
        carrier: null
      });
    }

    const validationUrl = `https://phonevalidation.abstractapi.com/v1/?api_key=${phoneApiKey}&phone=${encodeURIComponent(cleanPhone)}&country=PH`;
    
    const response = await axios.get(validationUrl);
    const data = response.data;

    // Additional validation for Philippines mobile numbers
    const isValidPhilippinesMobile = data.valid && 
                                   data.country?.code === 'PH' && 
                                   data.type === 'mobile';

    res.json({
      phone: data.phone,
      valid: isValidPhilippinesMobile,
      format: data.format,
      country: data.country,
      location: data.location,
      type: data.type,
      carrier: data.carrier
    });
  } catch (error) {
    console.error('Phone validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate phone number',
      message: error.message
    });
  }
});

// DEBUG: List all users and their email_verification_token (for troubleshooting only)
router.get('/debug-list-verification-tokens', async (req, res) => {
  try {
    const users = await require('../models/User').findAll();
    // You may want to adjust this to only show relevant fields
    res.json(users.map(u => ({ email: u.email, token: u.email_verification_token })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// Email verification endpoint
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  console.log('Received verification token:', token); // Debug log
  if (!token) {
    return res.status(400).json({ success: false, error: 'Verification token is required.' });
  }
  try {
    const user = await User.findByEmailVerificationToken(token);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification token.' });
    }
    await User.setEmailVerified(user.id);
    res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ success: false, error: 'Failed to verify email.' });
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