// models/userAgentAccount.js
const mongoose = require('mongoose');

const userAgentAccountSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
});

const UserAgentAccount = mongoose.model('UserAgentAccount', userAgentAccountSchema);

module.exports = UserAgentAccount;
