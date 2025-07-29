# Environment Setup for Phone Validation

## Required Environment Variables

To enable phone validation using the Abstract API, you need to set up the following environment variables in your server's `.env` file:

### 1. Phone Validation API Key
```
ABSTRACT_PHONE_API_KEY=your-phone-validation-api-key
```

### 2. Email Validation API Key (already in use)
```
VITE_ABSTRACT_API_KEY=your-email-validation-api-key
```

## How to Get Your API Keys

1. **Visit Abstract API**: Go to [https://www.abstractapi.com/](https://www.abstractapi.com/)
2. **Sign up/Login**: Create an account or log in to your existing account
3. **Get Phone Validation API Key**:
   - Navigate to the Phone Validation API section
   - Copy your unique API key
   - Add it to your `.env` file as `VITE_ABSTRACT_PHONE_API_KEY`

## Complete Environment File Example

Create a `.env` file in your server directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-database-password
DB_NAME=wearship_db

# Server Configuration
PORT=8080
NODE_ENV=development

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
BASE_URL=http://localhost:3000

# Abstract API Keys
VITE_ABSTRACT_API_KEY=your-email-validation-api-key
ABSTRACT_PHONE_API_KEY=your-phone-validation-api-key

# JWT Secret (for future JWT implementation)
JWT_SECRET=your-jwt-secret-key
```

## Testing Phone Validation

Once you've set up the environment variables, you can test the phone validation:

1. **Start your server**: `npm run dev` in the server directory
2. **Test the endpoint**: 
   ```bash
   curl "http://localhost:8080/api/v1/auth/validate-phone?phone=14152007986"
   ```
3. **Expected response**:
   ```json
   {
     "phone": "14152007986",
     "valid": true,
     "format": {
       "international": "+14152007986",
       "local": "(415) 200-7986"
     },
     "country": {
       "code": "US",
       "name": "United States",
       "prefix": "+1"
     },
     "location": "California",
     "type": "mobile",
     "carrier": "T-Mobile USA, Inc."
   }
   ```

## Features

The phone validation system provides:

- ✅ **Philippines mobile number validation** only
- ✅ **Real-time validation** as users type
- ✅ **Visual feedback** with icons and colors
- ✅ **Detailed information** including carrier and location
- ✅ **Debounced requests** to avoid excessive API calls
- ✅ **Error handling** for network issues
- ✅ **Form validation** before saving
- ✅ **Format validation** (09XXXXXXXXX or +639XXXXXXXXX)
- ✅ **Address phone validation** for delivery contact

## API Usage

The Abstract Phone Validation API provides:
- Philippines mobile number validity checking
- International and local formatting
- Country and location information
- Carrier information
- Phone type validation (mobile only)

## Valid Philippines Mobile Number Formats

- **Local format**: `09123456789` (11 digits starting with 09)
- **International format**: `+639123456789` (12 digits starting with +639)

## Validation Rules

1. **Must be a Philippines mobile number** (country code +63)
2. **Must be mobile type** (not landline)
3. **Must follow the correct format**: 09XXXXXXXXX or +639XXXXXXXXX
4. **Must be exactly 11 digits** (local) or **12 digits** (international)

For more details, visit: [https://docs.abstractapi.com/phone-validation](https://docs.abstractapi.com/phone-validation) 