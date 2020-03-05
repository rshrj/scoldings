const express = require('express');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

const { auth } = require('../../middleware/auth');
const { validateNewUser } = require('../../util/validation');
const User = require('../../models/User');

const router = express.Router();

// @routes
// GET /api/users/followers
// GET /api/users/following
// GET /api/users/:userId
// GET /api/users
// POST /api/users/:userId
// POST /api/users

// @route   GET /api/users/followers
// @desc    Get all followers
// @access  Private
router.get('/followers', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const followersPromises = user.followers.map(
    followerId =>
      new Promise((resolve, reject) => {
        (async () => {
          try {
            const follower = await User.findById(followerId);
            resolve({
              name: follower.name,
              email: follower.email,
              followers: follower.followers.length,
              following: follower.following.length
            });
          } catch (error) {
            reject(new Error(`Error getting followers. ${error}`));
          }
        })();
      })
  );
  const followers = Promise.all(followersPromises);
  return res.json({ success: true, users: followers });
});

// @route   GET /api/users/following
// @desc    Get all following
// @access  Private
router.get('/following', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const followingPromises = user.following.map(
    followingId =>
      new Promise((resolve, reject) => {
        (async () => {
          try {
            const followingUser = await User.findById(followingId);
            resolve({
              name: followingUser.name,
              email: followingUser.email,
              followers: followingUser.followers.length,
              following: followingUser.following.length
            });
          } catch (error) {
            reject(new Error(`Error getting followers. ${error}`));
          }
        })();
      })
  );
  const following = Promise.all(followingPromises);
  return res.json({ success: true, users: following });
});

// @route   GET /api/users/:userId
// @desc    Get a user details
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ errors: { notfound: 'User not found' } });
    }
    return res.json({
      success: true,
      name: user.name,
      email: user.email,
      followers: user.followers.length,
      following: user.following.length
    });
  } catch (error) {
    console.log(`Error while looking up user. ${error}`);
    return res.status(500).json({ errors: { internal: `Error while looking up user. ${error}` } });
  }
});

// @route   GET /api/users
// @desc    Get all users for search
// @access  Private
router.get('/', auth, async (req, res) => {
  const users = await User.find();
  const mappedUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));
  return res.json({ success: true, users: mappedUsers });
});

// @route   POST /api/users/:userId
// @desc    Follow a user
// @access  Private
router.post('/:userId', auth, async (req, res) => {
  const FollowedUser = await User.findById(req.params.userId);
  const MyUser = await User.findById(req.user.id);
  if (FollowedUser == null) {
    return res.status(404).json({ errors: { notfound: 'User not found' } });
  }
  if (MyUser.following.includes(FollowedUser.id)) {
    return res.status(400).json({ errors: { badrequest: 'Already followed' } });
  }
  MyUser.following.push(FollowedUser.id);
  FollowedUser.followers.push(MyUser.id);
  await MyUser.save();
  await FollowedUser.save();
  return res.json({
    success: true,
    followed: { id: FollowedUser.id, name: FollowedUser.name, email: FollowedUser.email }
  });
});

// @route   POST /api/users
// @desc    Create a user
// @access  Public
router.post('/', validateNewUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const alreadyExists = User.countDocuments({ email });

  if (alreadyExists) {
    return res.status(400).json({ errors: { badrequest: 'User already Exists' } });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hash
  });

  await newUser.save();

  const payload = {
    id: newUser.id
  };

  jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
});

module.exports = router;
