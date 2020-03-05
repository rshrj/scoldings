const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

const User = require('../../models/User');
const { auth } = require('../../middleware/auth');
const { validateLogin } = require('../../util/validation');

const router = express.Router();

// @route   GET /api/auth
// @desc    Get the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    followers: user.followers,
    following: user.following,
    created_at: user.created_at
  });
});

// @route   POST /api/auth
// @desc    Login User and send token
// @access  Public
router.post('/', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user == null) {
    return res.status(400).json({ errors: [{ msg: "User doesn't exist" }] });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: 'Incorrect Password. Try again' }] });
  }

  const payload = {
    id: user.id
  };

  jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
});

module.exports = router;
