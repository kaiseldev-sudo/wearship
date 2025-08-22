# API Security Configuration

## Overview

The API configuration has been updated to improve security and functionality. Here are the key changes and security considerations:

## Security Improvements

### 1. Environment-Based Configuration

**Before:**
```javascript
// Hardcoded in vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3001', // Hardcoded URL
    changeOrigin: true,
    secure: false,
  },
}
```

**After:**
```javascript
// Environment-based configuration
proxy: {
  '/api': {
    target: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
    configure: (proxy, options) => {
      // Proxy event handlers for debugging
    },
  },
}
```

### 2. API URL Configuration

**Before:**
```javascript
// Hardcoded API URL
API_URL: 'http://localhost:3001/api/v1'
```

**After:**
```javascript
// Proxy-based configuration
API_URL: '/api' // Uses Vite proxy
```

## Security Benefits

### 1. **No Hardcoded URLs in Production**
- API endpoints are not visible in client-side code
- Target URLs are configurable via environment variables
- Reduces information disclosure

### 2. **Proxy-Based Architecture**
- All API calls go through the development server
- Backend URLs are not exposed to the browser
- CORS issues are handled automatically

### 3. **Environment-Specific Configuration**
- Different configurations for development, staging, and production
- Sensitive URLs can be kept in environment variables
- Easy to switch between different backend environments

## Configuration Options

### Development (Recommended)
```bash
# .env
VITE_API_URL=/api
VITE_API_BASE_URL=http://localhost:3001
```

### Direct API Access (Alternative)
```bash
# .env
VITE_API_URL=http://localhost:3001/api/v1
```

### Production
```bash
# .env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## How It Works

1. **Frontend Request**: `POST /api/auth/login`
2. **Vite Proxy**: Intercepts `/api` requests
3. **URL Rewrite**: `/api/auth/login` → `/api/v1/auth/login`
4. **Backend**: Receives request at `http://localhost:3001/api/v1/auth/login`

## Security Considerations

### ✅ **What's Secure**
- No hardcoded backend URLs in client code
- Proxy configuration is server-side only
- Environment variables for sensitive configuration
- CORS is handled automatically by the proxy

### ⚠️ **Remaining Considerations**
- Environment variables in `.env` files should not be committed to version control
- Use `.env.local` for local development secrets
- Consider using a reverse proxy (like nginx) in production
- Implement proper authentication and authorization on the backend

## Troubleshooting

### Common Issues

1. **404 Errors**: Ensure the backend server is running on the correct port
2. **CORS Errors**: The proxy should handle this automatically
3. **Environment Variables**: Make sure `.env` files are properly configured

### Debug Mode

The proxy configuration includes debug logging:
```javascript
configure: (proxy, options) => {
  proxy.on('error', (err, req, res) => {
    console.log('proxy error', err);
  });
  proxy.on('proxyReq', (proxyReq, req, res) => {
    console.log('Sending Request to the Target:', req.method, req.url);
  });
  proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
  });
}
```

## Best Practices

1. **Never commit `.env` files** to version control
2. **Use different configurations** for different environments
3. **Validate environment variables** at startup
4. **Monitor proxy logs** in development
5. **Use HTTPS** in production environments 