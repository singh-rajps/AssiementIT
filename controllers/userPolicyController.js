// controllers/userPolicyController.js
const UserPolicy = require('../models/userPolicy');

// Create a new user policy
exports.createUserPolicy = async (req, res) => {
  try {
    const newUserPolicy = await UserPolicy.create(req.body);
    res.status(201).json(newUserPolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all user policies
exports.getAllUserPolicies = async (req, res) => {
  try {
    const userPolicies = await UserPolicy.find();
    res.json(userPolicies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user policy by ID
exports.getUserPolicyById = async (req, res) => {
  try {
    const userPolicy = await UserPolicy.findById(req.params.id);
    if (!userPolicy) {
      return res.status(404).json({ message: 'User policy not found' });
    }
    res.json(userPolicy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user policy by ID
exports.updateUserPolicy = async (req, res) => {
  try {
    const updatedUserPolicy = await UserPolicy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUserPolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user policy by ID
exports.deleteUserPolicy = async (req, res) => {
  try {
    const deletedUserPolicy = await UserPolicy.findByIdAndRemove(req.params.id);
    res.json(deletedUserPolicy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
