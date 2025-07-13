# Wearship Backend API

Complete Node.js/Express backend for the Wearship Christian apparel e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ running
- Git for version control

### Installation

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the server root with:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=wearship_db

   # API Configuration
   API_PREFIX=/api/v1
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Set Up Database**
   ```bash
   # Option 1: Complete setup (schema + mock data)
   npm run db:setup

   # Option 2: Step by step
   npm run db:schema    # Create tables
   npm run db:seed      # Add mock data
   ```

4. **Start the Server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

5. **Verify Installation**
   Visit `http://localhost:3001/health` to confirm the server is running.

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Main Endpoints

#### 🛍️ **Products**
- `GET /products` - Get all products with filtering
- `GET /products/featured` - Get featured products
- `GET /products/categories` - Get product categories
- `GET /products/:id` - Get product by ID
- `GET /products/slug/:slug` - Get product by slug
- `GET /products/:id/variants` - Get product variants
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)

#### 🛒 **Shopping Cart**
- `GET /cart` - Get cart with items
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update item quantity
- `DELETE /cart/items/:itemId` - Remove item from cart
- `DELETE /cart` - Clear entire cart
- `GET /cart/totals` - Get cart totals
- `POST /cart/transfer` - Transfer guest cart to user

#### 📦 **Orders**
- `GET /orders` - Get all orders with filtering
- `GET /orders/:id` - Get order by ID
- `GET /orders/number/:orderNumber` - Get order by number
- `POST /orders/checkout` - Create order from cart
- `PATCH /orders/:id/status` - Update order status
- `PATCH /orders/:id/payment-status` - Update payment status
- `POST /orders/:id/payments` - Add payment transaction

#### 👤 **Authentication & Users**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `GET /users/:id/addresses` - Get user addresses
- `POST /users/:id/addresses` - Add user address

#### 📊 **Admin**
- `GET /admin/dashboard` - Admin dashboard overview
- `GET /admin/analytics/orders` - Order analytics
- `GET /admin/analytics/ministry-allocations` - Ministry allocation stats
- `GET /admin/abandoned-carts` - Get abandoned carts
- `DELETE /admin/cleanup-carts` - Cleanup expired carts

## 🗄️ Database Structure

The backend uses a comprehensive MySQL database with 20+ tables:

### Core Tables
- **Products & Variants** - Product catalog with size/color variations
- **Users & Addresses** - Customer management
- **Shopping Cart** - Persistent cart system
- **Orders & Payments** - Complete order lifecycle
- **Custom Designs** - T-shirt customization data
- **Ministry Allocations** - Profit distribution tracking

### Key Features
- ✅ Full e-commerce functionality
- ✅ Pre-order system support
- ✅ Ministry profit allocation
- ✅ Shopping cart persistence
- ✅ Inventory tracking
- ✅ Order management
- ✅ Customer addresses
- ✅ Payment transaction logging

## 📝 Usage Examples

### Add Item to Cart
```javascript
// Headers for cart identification
const headers = {
  'X-User-ID': '1',           // If logged in
  'X-Session-ID': 'guest-123', // If guest user
  'Content-Type': 'application/json'
};

// Add product to cart
fetch('http://localhost:3001/api/v1/cart/items', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    product_id: 1,
    variant_id: 3,
    quantity: 2
  })
});
```

### Create Order
```javascript
// Checkout cart
fetch('http://localhost:3001/api/v1/orders/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cart_id: 1,
    user_id: 1,
    email: 'customer@example.com',
    billing_address: {
      first_name: 'John',
      last_name: 'Doe',
      address_line_1: '123 Faith Street',
      city: 'Austin',
      state: 'TX',
      postal_code: '78701',
      country: 'United States'
    },
    shipping_address: { /* same structure */ }
  })
});
```

### Get Products
```javascript
// Get featured products
fetch('http://localhost:3001/api/v1/products/featured')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Search products
fetch('http://localhost:3001/api/v1/products?search=faith&featured=true&limit=10')
  .then(res => res.json())
  .then(data => console.log(data.data));
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm run test     # Run tests
npm run db:setup # Setup database
```

### Project Structure
```
server/
├── src/
│   ├── config/
│   │   └── database.js     # Database connection
│   ├── models/
│   │   ├── Product.js      # Product CRUD operations
│   │   ├── User.js         # User management
│   │   ├── Cart.js         # Shopping cart logic
│   │   └── Order.js        # Order processing
│   ├── routes/
│   │   ├── products.js     # Product API routes
│   │   ├── cart.js         # Cart API routes
│   │   ├── orders.js       # Order API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   └── admin.js        # Admin dashboard routes
│   └── server.js           # Main server file
├── database/
│   ├── schema.sql          # Database structure
│   ├── mock_data.sql       # Sample data
│   └── setup.sql           # Complete setup script
└── package.json
```

## 🔒 Security Features

- **Rate Limiting** - Prevents API abuse
- **CORS Protection** - Secure cross-origin requests
- **Input Validation** - Prevents injection attacks
- **Password Hashing** - bcrypt with salt rounds
- **SQL Injection Prevention** - Parameterized queries
- **Helmet.js** - Security headers

## 🎯 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PASSWORD=strong_production_password
JWT_SECRET=secure_random_jwt_secret
STRIPE_SECRET_KEY=live_stripe_key
EMAIL_PASSWORD=app_specific_password
```

### Deployment Checklist
- [ ] Update all environment variables
- [ ] Set up SSL/TLS certificates
- [ ] Configure production database
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Set up CI/CD pipeline
- [ ] Test all API endpoints

## 🤝 Integration with Frontend

This backend is designed to work seamlessly with your React frontend:

1. **Products** - Matches your frontend product structure
2. **Cart** - Persistent cart across sessions
3. **Orders** - Complete checkout flow
4. **Ministry Focus** - Profit allocation tracking
5. **Pre-orders** - Built-in pre-order support

### Connecting Frontend
Update your frontend API calls to point to:
```javascript
const API_BASE = 'http://localhost:3001/api/v1';
```

## 📊 Ministry Impact Tracking

The backend automatically tracks profit allocation to Christian ministries:

- **Automatic Calculation** - Profit = Revenue - Costs
- **Percentage Allocation** - Configurable ministry percentages
- **Tracking** - Complete audit trail
- **Reporting** - Ministry allocation analytics

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check MySQL is running
mysql -u root -p
# Verify credentials in .env file
```

**Port Already in Use**
```bash
# Change PORT in .env file or kill existing process
lsof -ti:3001 | xargs kill -9
```

**Missing Dependencies**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

This backend provides a robust foundation for the Wearship e-commerce platform with:
- Complete CRUD operations
- Production-ready security
- Comprehensive error handling
- Detailed logging
- Ministry-focused features

Built with ❤️ to support Christian ministries worldwide through fashion! 🙏 