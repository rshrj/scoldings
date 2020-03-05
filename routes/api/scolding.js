const express = require('express');
const { validationResult } = require('express-validator');

const { auth } = require('../../middleware/auth');
const { validateNewScolding } = require('../../util/validation');
const Scolding = require('../../models/Scolding');
const User = require('../../models/User');

const router = express.Router();

// @routes
// GET /api/scoldings
// POST /api/scoldings/

// @route   GET /api/scoldings
// @desc    Get all of user's scoldings
// @access  Private
router.get('/', auth, async (req, res) => {
  const scoldings = Scolding.find({ to: req.user.id });
  const mappedScoldings = scoldings.map(
    scolding =>
      new Promise(resolve => {
        (async () => {
          const from = User.findById(Scolding.from);
          resolve({
            id: scolding.id,
            from: {
              id: from.id,
              name: from.name,
              email: from.email
            },
            scold: scolding.scold,
            scolded_at: scolding.scolded_at
          });
        })();
      })
  );
  res.json({ success: true, scoldings: mappedScoldings });
});

// @route   POST /api/scoldings/
// @desc    Scold someone
// @access  Private
router.post('/', auth, validateNewScolding, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { to, scold } = req.body;

  const toUser = await User.findById(to);

  if (toUser == null) {
    return res.status(400).json({ errors: [{ badrequest: 'User not found' }] });
  }

  if (toUser.id === req.user.id) {
    return res.status(400).json({ errors: [{ badrequest: "Can't scold yourself" }] });
  }

  // TODO: Implement: can scold only a follower

  const scolding = new Scolding({
    from: req.user.id,
    to: toUser.id,
    scold
  });

  await scolding.save();
  return res.json({ success: true, scolding });
});

module.exports = router;
