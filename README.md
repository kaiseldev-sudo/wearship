# Wearship Store

A modern e-commerce platform built with React, TypeScript, and Node.js.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

Follow these steps to set up the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd wearship-store

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server
npm run dev
```

## Development

### Frontend

The frontend is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend

The backend includes:
- Node.js server
- Express.js
- MySQL database
- RESTful API endpoints
- PayPal payment integration

## Project Structure

```
wearship-store/
├── src/                 # Frontend React application
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions and API
├── server/             # Backend Node.js application
│   ├── src/
│   │   ├── models/     # Database models
│   │   ├── routes/     # API routes
│   │   └── config/     # Configuration files
│   └── database/       # Database schema and setup
```

## Features

- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart functionality
- Order management
- User profiles and preferences
- Responsive design for mobile and desktop

## License

This project is licensed under the MIT License.
