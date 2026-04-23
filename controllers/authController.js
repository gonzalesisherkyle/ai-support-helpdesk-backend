const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Generate a 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({ 
      name, 
      email, 
      password, 
      role,
      verificationCode,
      isVerified: false 
    });
    await user.save();

    // In a real app, send email here. For now, we return it so the frontend can "see" it for testing.
    res.status(201).json({ 
      message: 'User created. Please verify your email.',
      email,
      debugCode: verificationCode // ONLY FOR DEMO
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email, verificationCode: code });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: { $in: ['Agent', 'Admin', 'Support Manager'] } }).select('name email role');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
