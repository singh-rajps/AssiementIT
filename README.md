# E-commerce API - Production Ready

A production-ready RESTful API for e-commerce applications with products, inventory, and cart management built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Full CRUD operations for products with categories, pricing, and search
- **Inventory Management**: Real-time stock tracking, low stock alerts, and warehouse management
- **Shopping Cart**: Add/remove items, quantity management, and checkout functionality
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston logger with file and console transports
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs
- **Logging**: Winston, Morgan

## Project Structure

```
├── config/
│   ├── database.js       # MongoDB connection
│   └── logger.js         # Winston logger configuration
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── inventoryController.js
│   └── cartController.js
├── middleware/
│   ├── auth.js           # JWT authentication & authorization
│   ├── errorHandler.js   # Global error handler
│   └── validator.js      # Input validation rules
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Inventory.js
│   └── Cart.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── inventoryRoutes.js
│   └── cartRoutes.js
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── server.js             # Application entry point
└── package.json
```

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB** (make sure MongoDB is running):
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

4. **Run the application**:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Inventory
- `GET /api/inventory` - Get all inventory (Admin only)
- `GET /api/inventory/:productId` - Get product inventory (Admin only)
- `PUT /api/inventory/:productId` - Update inventory (Admin only)
- `POST /api/inventory/:productId/add-stock` - Add stock (Admin only)
- `POST /api/inventory/:productId/reduce-stock` - Reduce stock (Admin only)

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart/items` - Add item to cart (Protected)
- `PUT /api/cart/items/:productId` - Update cart item (Protected)
- `DELETE /api/cart/items/:productId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)
- `POST /api/cart/checkout` - Checkout (Protected)

## Usage Examples

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Product (Admin)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "brand": "TechBrand",
    "initialStock": 50
  }'
```

### 4. Get All Products
```bash
curl http://localhost:3000/api/products
```

### 5. Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### 6. Get Cart
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Checkout
```bash
curl -X POST http://localhost:3000/api/cart/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ecommerce |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Sets security HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: express-validator for request validation
- **Role-Based Access**: Admin and user roles

## Production Deployment

### Prerequisites
- Node.js 14+ installed
- MongoDB instance (local or cloud)
- Environment variables configured

### Deployment Steps

1. **Set NODE_ENV to production**:
```bash
export NODE_ENV=production
```

2. **Use a production MongoDB database**:
```bash
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce"
```

3. **Use a strong JWT secret**:
```bash
export JWT_SECRET="your-very-strong-secret-key"
```

4. **Use a process manager** (PM2 recommended):
```bash
npm install -g pm2
pm2 start server.js --name ecommerce-api
pm2 save
pm2 startup
```

5. **Set up reverse proxy** (Nginx example):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable SSL** (using Let's Encrypt):
```bash
sudo certbot --nginx -d yourdomain.com
```

## Monitoring & Logs

Logs are stored in the `logs/` directory:
- `error.log` - Error logs
- `combined.log` - All logs
- `access.log` - HTTP access logs

## Testing

Test the API using:
- **Postman**: Import the endpoints and test
- **curl**: Use the examples above
- **Thunder Client**: VS Code extension

## Best Practices Implemented

✅ Environment-based configuration  
✅ Centralized error handling  
✅ Input validation and sanitization  
✅ Secure password storage  
✅ JWT token authentication  
✅ Role-based authorization  
✅ Rate limiting  
✅ Logging and monitoring  
✅ Database indexing for performance  
✅ Soft delete for products  
✅ Stock validation before checkout  
✅ Proper HTTP status codes  
✅ RESTful API design  

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
