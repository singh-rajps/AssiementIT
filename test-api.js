/**
 * API Testing Script
 * This script tests the main functionality of the e-commerce API
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let adminToken = '';
let productId = '';
let userId = '';

// Helper function to log results
const log = (message, data = null) => {
  console.log('\n' + '='.repeat(60));
  console.log(message);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
  console.log('='.repeat(60));
};

// Test functions
async function testHealthCheck() {
  try {
    const response = await axios.get('http://localhost:3000/health');
    log('✅ Health Check', response.data);
    return true;
  } catch (error) {
    log('❌ Health Check Failed', error.message);
    return false;
  }
}

async function testRegisterAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    adminToken = response.data.token;
    log('✅ Admin Registration', response.data);
    return true;
  } catch (error) {
    log('❌ Admin Registration Failed', error.response?.data || error.message);
    return false;
  }
}

async function testRegisterUser() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    authToken = response.data.token;
    userId = response.data.user.id;
    log('✅ User Registration', response.data);
    return true;
  } catch (error) {
    log('❌ User Registration Failed', error.response?.data || error.message);
    return false;
  }
}

async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@example.com',
      password: 'user123'
    });
    authToken = response.data.token;
    log('✅ User Login', response.data);
    return true;
  } catch (error) {
    log('❌ Login Failed', error.response?.data || error.message);
    return false;
  }
}

async function testCreateProduct() {
  try {
    const response = await axios.post(`${BASE_URL}/products`, {
      name: 'Test Laptop',
      description: 'High-performance laptop for testing',
      price: 999.99,
      category: 'Electronics',
      brand: 'TestBrand',
      initialStock: 50
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    productId = response.data.data._id;
    log('✅ Product Created', response.data);
    return true;
  } catch (error) {
    log('❌ Product Creation Failed', error.response?.data || error.message);
    return false;
  }
}

async function testGetProducts() {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    log('✅ Get All Products', response.data);
    return true;
  } catch (error) {
    log('❌ Get Products Failed', error.response?.data || error.message);
    return false;
  }
}

async function testGetSingleProduct() {
  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}`);
    log('✅ Get Single Product', response.data);
    return true;
  } catch (error) {
    log('❌ Get Single Product Failed', error.response?.data || error.message);
    return false;
  }
}

async function testGetInventory() {
  try {
    const response = await axios.get(`${BASE_URL}/inventory/${productId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log('✅ Get Inventory', response.data);
    return true;
  } catch (error) {
    log('❌ Get Inventory Failed', error.response?.data || error.message);
    return false;
  }
}

async function testAddToCart() {
  try {
    const response = await axios.post(`${BASE_URL}/cart/items`, {
      productId: productId,
      quantity: 2
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('✅ Add to Cart', response.data);
    return true;
  } catch (error) {
    log('❌ Add to Cart Failed', error.response?.data || error.message);
    return false;
  }
}

async function testGetCart() {
  try {
    const response = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('✅ Get Cart', response.data);
    return true;
  } catch (error) {
    log('❌ Get Cart Failed', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateCartItem() {
  try {
    const response = await axios.put(`${BASE_URL}/cart/items/${productId}`, {
      quantity: 3
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('✅ Update Cart Item', response.data);
    return true;
  } catch (error) {
    log('❌ Update Cart Item Failed', error.response?.data || error.message);
    return false;
  }
}

async function testCheckout() {
  try {
    const response = await axios.post(`${BASE_URL}/cart/checkout`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('✅ Checkout', response.data);
    return true;
  } catch (error) {
    log('❌ Checkout Failed', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🚀 Starting API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Register Admin', fn: testRegisterAdmin },
    { name: 'Register User', fn: testRegisterUser },
    { name: 'Login', fn: testLogin },
    { name: 'Create Product', fn: testCreateProduct },
    { name: 'Get Products', fn: testGetProducts },
    { name: 'Get Single Product', fn: testGetSingleProduct },
    { name: 'Get Inventory', fn: testGetInventory },
    { name: 'Add to Cart', fn: testAddToCart },
    { name: 'Get Cart', fn: testGetCart },
    { name: 'Update Cart Item', fn: testUpdateCartItem },
    { name: 'Checkout', fn: testCheckout },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${tests.length}`);
  console.log('='.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:3000/health');
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ Server is not running. Please start the server first with: npm start');
    process.exit(1);
  }
  
  await runTests();
})();
