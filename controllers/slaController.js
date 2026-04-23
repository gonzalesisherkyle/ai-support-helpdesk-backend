const SLAPolicy = require('../models/SLAPolicy');

exports.getPolicies = async (req, res) => {
  try {
    const policies = await SLAPolicy.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPolicy = async (req, res) => {
  try {
    const policy = new SLAPolicy(req.body);
    await policy.save();
    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
