const { body } = require('express-validator');

module.exports.validateNewUser = [
  body('name', 'Please enter a name')
    .not()
    .isEmpty(),
  body('name', 'Enter a valid name with only letters').isAlpha(),
  body('email', 'Please enter a email')
    .not()
    .isEmpty(),
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'Please enter a password')
    .not()
    .isEmpty(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('password2', "Passwords don't match, try again").custom((value, { req }) => value === req.body.password)
];

module.exports.validateLogin = [
  body('email', 'Please enter an email')
    .not()
    .isEmpty(),
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'Please enter password')
    .not()
    .isEmpty(),
  body('password', 'Must be at least 6 characters').isLength({ min: 6 })
];

module.exports.validateNewScolding = [
  body('scold', 'Please enter something to scold')
    .not()
    .isEmpty(),
  body('scold', 'Scolding must be atleast 3 and atmost 400 characters').isLength({ min: 3, max: 400 })
];
