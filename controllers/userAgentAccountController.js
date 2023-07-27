// controllers/userAgentAccountController.js
const UserAgentAccount = require('../models/userAgentAccount');

// Create a new user agent account
exports.createUserAgentAccount = async (req, res) => {
  try {
    const newUserAgentAccount = await UserAgentAccount.create(req.body);
    res.status(201).json(newUserAgentAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all user agent accounts
exports.getAllUserAgentAccounts = async (req, res) => {
  try {
    const userAgentAccounts = await UserAgentAccount.find();
    res.json(userAgentAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user agent account by ID
exports.getUserAgentAccountById = async (req, res) => {
  try {
    const userAgentAccount = await UserAgentAccount.findById(req.params.id);
    if (!userAgentAccount) {
      return res.status(404).json({ message: 'User agent account not found' });
    }
    res.json(userAgentAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user agent account by ID
exports.updateUserAgentAccount = async (req, res) => {
  try {
    const updatedUserAgentAccount = await UserAgentAccount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUserAgentAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user agent account by ID
exports.deleteUserAgentAccount = async (req, res) => {
  try {
    const deletedUserAgentAccount = await UserAgentAccount.findByIdAndRemove(
      req.params.id
    );
    res.json(deletedUserAgentAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
