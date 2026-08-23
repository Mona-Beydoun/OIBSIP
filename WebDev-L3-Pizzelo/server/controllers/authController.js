const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendEmail(
      email,
      'Verify your Pizzelo account',
      `<h2>Welcome to Pizzelo, ${name}!</h2>
       <p>Please click the link below to verify your email:</p>
       <a href="${verifyUrl}">${verifyUrl}</a>`
    );

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, 'user');

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account with that email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      email,
      'Reset your Pizzelo password',
      `<h2>Password Reset Request</h2>
       <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
};