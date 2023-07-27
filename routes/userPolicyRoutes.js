// routes/userPolicyRoutes.js
const express = require('express');
const router = express.Router();
const userPolicyController = require('../controllers/userPolicyController');

// Create a new user policy
router.post('/', userPolicyController.createUserPolicy);

// Get all user policies
router.get('/', userPolicyController.getAllUserPolicies);

// Get a single user policy by ID
router.get('/:id', userPolicyController.getUserPolicyById);

// Update a user policy by ID
router.put('/:id', userPolicyController.updateUserPolicy);

// Delete a user policy by ID
router.delete('/:id', userPolicyController.deleteUserPolicy);

module.exports = router;
