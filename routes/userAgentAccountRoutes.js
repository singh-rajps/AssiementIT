// routes/userAgentAccountRoutes.js
const express = require('express');
const router = express.Router();
const userAgentAccountController = require('../controllers/userAgentAccountController');

// Create a new user agent account
router.post('/', userAgentAccountController.createUserAgentAccount);

// Get all user agent accounts
router.get('/', userAgentAccountController.getAllUserAgentAccounts);

// Get a single user agent account by ID
router.get('/:id', userAgentAccountController.getUserAgentAccountById);

// Update a user agent account by ID
router.put('/:id', userAgentAccountController.updateUserAgentAccount);

// Delete a user agent account by ID
router.delete('/:id', userAgentAccountController.deleteUserAgentAccount);

module.exports = router;
