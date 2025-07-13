# Wearship Database Setup

This directory contains the complete MySQL database schema and mock data for the Wearship e-commerce platform.

## Quick Start

### Prerequisites
- MySQL 8.0+ installed and running
- MySQL client or phpMyAdmin access
- Sufficient permissions to create databases

### Option 1: Single Command Setup
```bash
mysql -u root -p < setup.sql
```

### Option 2: Step by Step Setup
```bash
# 1. Create schema
mysql -u root -p < schema.sql

# 2. Add mock data
mysql -u root -p < mock_data.sql
```

### Option 3: MySQL Workbench/phpMyAdmin
1. Open your MySQL client
2. Run `schema.sql` first
3. Then run `mock_data.sql`

## Database Structure

### Core E-commerce Tables

**Products & Inventory**
- `products` - Base product information
- `product_variants` - Size/color combinations
- `product_options` - Available options (Size, Color)
- `product_option_values` - Specific values (M, L, XL, etc.)
- `variant_option_values` - Links variants to their options
- `product_images` - Product photography
- `categories` - Product categorization

**Users & Authentication**
- `users` - Customer accounts
- `user_addresses` - Billing/shipping addresses
- `admin_users` - Admin panel access

**Shopping & Orders**
- `carts` - Shopping cart sessions
- `cart_items` - Items in shopping carts
- `orders` - Completed orders
- `order_items` - Individual items in orders
- `payment_transactions` - Payment processing records

**Custom Design System**
- `custom_designs` - User-created t-shirt designs
- Design data stored as JSON with text, fonts, positioning

**Ministry Integration**
- `ministries` - Organizations receiving profit donations
- `ministry_allocations` - Tracking of profit distributions

**System Management**
- `settings` - Configurable system settings
- `email_notifications` - Email delivery tracking

## Sample Data Overview

The mock data includes:

### Products (6 items)
1. **Faith Over Fear Tee** - $24.99 (Featured, Pre-order)
2. **Worship Warrior Tee** - $26.99 (Featured, Pre-order)
3. **His Grace Tee** - $23.99 (Pre-order)
4. **Blessed & Grateful Tee** - $25.99 (Featured, Pre-order)
5. **Chosen & Beloved Tee** - $24.99 (Pre-order)
6. **Jesus is King Hoodie** - $45.99 (Featured, Pre-order)

### Product Variants
- Multiple size options (XS-XXL)
- Various color combinations per product
- Proper SKU generation
- All set for pre-order (0 inventory)

### Test Customers (5 users)
- john.doe@email.com
- sarah.johnson@email.com
- mike.wilson@email.com
- emma.brown@email.com
- david.miller@email.com
- Password for all: `password123` (hashed)

### Sample Orders (4 orders)
- 3 confirmed and paid orders
- 1 pending payment order
- Realistic order totals with tax/shipping
- Complete billing/shipping addresses

### Ministry Partners (4 organizations)
- Global Mission Outreach (40% allocation)
- Local Community Ministry (30% allocation)
- Youth Ministry International (20% allocation)
- Christian Education Fund (10% allocation)

### Active Shopping Carts
- Sample cart items for testing checkout flow
- Various products and quantities

### Custom Designs
- 3 sample custom t-shirt designs
- JSON design data with fonts, colors, positioning

## Key Features Implemented

### E-commerce Best Practices
✅ Proper normalization with foreign keys  
✅ Inventory tracking system  
✅ Order state management  
✅ Payment transaction logging  
✅ Address management  
✅ Product variant system  
✅ Shopping cart persistence  
✅ Email notification tracking  
✅ Soft deletes where appropriate  

### Wearship-Specific Features
✅ Pre-order system for all products  
✅ Custom design storage (JSON)  
✅ Ministry profit allocation tracking  
✅ Christian-themed product catalog  
✅ Multi-variant products (sizes/colors)  

### Performance Optimizations
✅ Strategic indexing on frequently queried columns  
✅ Full-text search on product descriptions  
✅ Proper data types for optimal storage  
✅ Foreign key constraints for data integrity  

## Configuration

### Default Settings
- Currency: USD
- Tax Rate: 8.25%
- Standard Shipping: $5.99
- Free Shipping Threshold: $75.00
- Pre-order Message: "Expected shipping in 3-4 weeks"

### Admin Access
- Email: admin@wearship.com
- Password: password123 (change in production!)
- Role: super_admin

## Next Steps for Backend Development

1. **API Endpoints** - Create REST/GraphQL APIs for:
   - Product catalog with variants
   - Shopping cart management
   - Order processing
   - User authentication
   - Custom design builder
   - Admin dashboard

2. **Payment Integration** - Connect with:
   - Stripe/PayPal for payments
   - Tax calculation services
   - Shipping rate APIs

3. **Email System** - Implement:
   - Order confirmations
   - Shipping notifications
   - Pre-order updates
   - Ministry impact reports

4. **Admin Features** - Build:
   - Product management
   - Order fulfillment
   - Customer support
   - Ministry allocation reports

## Database Maintenance

### Backup Recommendations
```bash
# Full backup
mysqldump -u root -p wearship_db > wearship_backup.sql

# Data only backup
mysqldump -u root -p --no-create-info wearship_db > wearship_data.sql
```

### Production Considerations
- Change all default passwords
- Set up proper user permissions
- Configure automated backups
- Monitor query performance
- Set up replication if needed

## Support

This database structure follows e-commerce industry standards and is production-ready for the Wearship platform. All tables include proper timestamps, indexing, and relationships for optimal performance and data integrity. 