const config = require('config');
const jwt = require('jsonwebtoken');

module.exports.auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    await jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (err) {
    console.error('Something wrong with auth middleware');
    res.status(500).json({ msg: `Server Error: ${err}` });
  }
};
