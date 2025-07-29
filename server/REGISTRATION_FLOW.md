# Registration Flow Documentation

## Overview
The registration system has been improved to ensure data consistency and proper error handling. The system now uses atomic operations to prevent orphaned user records.

## How It Works

### 1. Atomic Registration Process
- User data is only stored in the database AFTER the verification email is successfully sent
- If email sending fails, no user record is created
- Uses database transactions to ensure data consistency

### 2. Error Handling
- **Email Service Failure**: If the email service is down or misconfigured, the registration fails completely
- **Duplicate Email**: Proper handling of existing email addresses
- **Database Errors**: Comprehensive error handling for database issues

### 3. Environment Variables Required
Make sure these environment variables are set in your `.env` file:
```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USERNAME=your-email@domain.com
SMTP_PASSWORD=your-email-password
BASE_URL=http://localhost:3000
```

## Testing the Registration Flow

### 1. Test Email Configuration
```bash
GET /auth/test-email
```
This endpoint tests if the email service is working correctly.

### 2. Test Registration
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

### 3. Expected Behavior

#### Success Case:
- User data is stored in database
- Verification email is sent
- User status is set to 'inactive'
- Response: 201 with success message

#### Failure Cases:
- **Email Service Down**: Registration fails, no user created
- **Invalid Email**: Registration fails with validation error
- **Duplicate Email**: Registration fails with conflict error
- **Weak Password**: Registration fails with validation error

## Debugging

### Check Email Configuration
```bash
curl http://localhost:8080/auth/test-email
```

### View Verification Tokens (Debug)
```bash
curl http://localhost:8080/auth/debug-list-verification-tokens
```

### Check Server Logs
The system logs detailed information about:
- Email sending attempts
- Success/failure of email delivery
- Database operations
- Error details

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **Email Validation**: Uses Abstract API for email validation
3. **Token Security**: 32-byte random tokens for email verification
4. **Soft Deletes**: Users are soft-deleted, not hard-deleted
5. **Input Validation**: Comprehensive validation of all inputs

## Troubleshooting

### Common Issues:

1. **"Failed to send verification email"**
   - Check SMTP configuration
   - Verify environment variables
   - Test email service with `/auth/test-email`

2. **"Missing required environment variables"**
   - Ensure all SMTP variables are set
   - Check `.env` file format

3. **"Email already exists"**
   - User with this email already registered
   - Check if user needs email verification

4. **Database connection issues**
   - Check database configuration
   - Verify database is running
   - Check connection pool settings 