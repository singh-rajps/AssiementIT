# Quick Start Guide

Get your e-commerce API up and running in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- MongoDB installed and running (or use MongoDB Atlas)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

The `.env` file is already created with development defaults. For production, update these values:

```bash
# Edit .env file
nano .env
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or if using macOS with Homebrew
brew services start mongodb-community
```

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

## Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
MongoDB Connected: localhost
Server running on port 3000
```

## Step 5: Test the API

### Option 1: Using the Test Script

Open a new terminal and run:

```bash
npm test
```

This will automatically test all endpoints and show results.

### Option 2: Manual Testing with curl

#### 1. Check Health
```bash
curl http://localhost:3000/health
```

#### 2. Register an Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Save the `token` from the response!

#### 3. Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "brand": "TechBrand",
    "initialStock": 50
  }'
```

#### 4. Get All Products
```bash
curl http://localhost:3000/api/products
```

#### 5. Register a Regular User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "user123",
    "role": "user"
  }'
```

#### 6. Add Product to Cart
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN_HERE" \
  -d '{
    "productId": "PRODUCT_ID_HERE",
    "quantity": 2
  }'
```

#### 7. View Cart
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer USER_TOKEN_HERE"
```

#### 8. Checkout
```bash
curl -X POST http://localhost:3000/api/cart/checkout \
  -H "Authorization: Bearer USER_TOKEN_HERE"
```

### Option 3: Using Postman

1. Import `postman-collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:3000/api`
3. Start making requests!

## Common Issues

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**: Make sure MongoDB is running:
```bash
sudo systemctl status mongod
```

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**: Change the port in `.env` or kill the process:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### JWT Token Invalid

**Error**: `Not authorized to access this route`

**Solution**: Make sure you're including the token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Next Steps

1. **Read the Documentation**: Check `README.md` for detailed API documentation
2. **Explore Endpoints**: Try all the available endpoints
3. **Deploy to Production**: Follow `DEPLOYMENT.md` for production deployment
4. **Customize**: Modify models and controllers to fit your needs

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Inventory
- `GET /api/inventory` - Get all inventory (Admin)
- `GET /api/inventory/:productId` - Get product inventory (Admin)
- `PUT /api/inventory/:productId` - Update inventory (Admin)
- `POST /api/inventory/:productId/add-stock` - Add stock (Admin)
- `POST /api/inventory/:productId/reduce-stock` - Reduce stock (Admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/checkout` - Checkout

## Development Tips

### Watch Logs
```bash
# In development mode, logs appear in console
npm run dev

# In production, check log files
tail -f logs/combined.log
tail -f logs/error.log
```

### Database Management

```bash
# Connect to MongoDB
mongo ecommerce

# View collections
show collections

# View users
db.users.find().pretty()

# View products
db.products.find().pretty()

# Clear database (be careful!)
db.dropDatabase()
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection | mongodb://localhost:27017/ecommerce |
| JWT_SECRET | JWT secret key | (set in .env) |
| JWT_EXPIRE | Token expiration | 7d |

## Support

- **Issues**: Open an issue on GitHub
- **Documentation**: Check README.md and DEPLOYMENT.md
- **Logs**: Check `logs/` directory for error details

---

**Happy Coding! 🚀**
