// models/userPolicy.js
const mongoose = require('mongoose');

const userPolicySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  premiumAmount: { type: Number, required: true },
});

const UserPolicy = mongoose.model('UserPolicy', userPolicySchema);

module.exports = UserPolicy;
